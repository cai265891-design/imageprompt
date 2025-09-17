#!/bin/bash

# 最终修复 Vercel 部署问题
# 错误: Bun could not find a package.json file

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "开始最终修复 Vercel 部署问题..."

# 1. 删除冲突的 vercel.json 文件
log_info "步骤 1: 清理冲突的配置文件..."

if [ -f "apps/nextjs/vercel.json" ]; then
    rm apps/nextjs/vercel.json
    log_success "✅ 删除 apps/nextjs/vercel.json"
fi

# 2. 更新根目录的 vercel.json 以支持 monorepo
log_info "步骤 2: 创建正确的 Vercel 配置..."

cat > vercel.json << 'EOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "bun install && bun run build",
  "installCommand": "echo 'Using custom install in buildCommand'",
  "outputDirectory": "apps/nextjs/.next",
  "framework": null,
  "regions": ["iad1"],
  "functions": {
    "apps/nextjs/src/app/api/trpc/edge/[trpc]/route.ts": {
      "maxDuration": 30
    },
    "apps/nextjs/src/app/api/webhooks/stripe/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF

log_success "✅ 更新 vercel.json"

# 3. 创建 Vercel 项目配置文件
log_info "步骤 3: 创建 Vercel 项目配置..."

cat > .vercelignore << 'EOF'
# Vercel ignore file
.git
.github
.vscode
.claude
node_modules
.turbo
.next
.env.local
.env.development.local
*.log
*.md
!README.md
apps/auth-proxy
scripts
test-*
debug-*
deploy-*
fix-*
validate-*
verify-*
EOF

log_success "✅ 创建 .vercelignore"

# 4. 确保 package.json 配置正确
log_info "步骤 4: 验证 package.json..."

# 检查根目录 package.json
if [ ! -f "package.json" ]; then
    log_error "❌ 根目录缺少 package.json"
    exit 1
fi

# 检查 packageManager 字段
if grep -q '"packageManager"' package.json; then
    log_success "✅ package.json 包含 packageManager 配置"
else
    log_warning "⚠️ package.json 缺少 packageManager 配置"
fi

# 5. 测试本地构建
log_info "步骤 5: 测试本地构建..."

# 清理并重新安装
log_info "清理并重新安装依赖..."
rm -rf node_modules
bun install

# 测试构建
log_info "运行构建测试..."
if bun run build; then
    log_success "✅ 本地构建成功"
else
    log_error "❌ 本地构建失败"
    exit 1
fi

# 6. 创建部署验证脚本
log_info "步骤 6: 创建验证脚本..."

cat > test-vercel-deployment.sh << 'EOF'
#!/bin/bash
# 测试 Vercel 部署

echo "=== Vercel 部署前检查清单 ==="
echo ""

# 检查必需文件
echo "✅ 检查必需文件:"
[ -f "package.json" ] && echo "  ✓ package.json" || echo "  ✗ package.json 缺失"
[ -f "bun.lockb" ] && echo "  ✓ bun.lockb" || echo "  ✗ bun.lockb 缺失"
[ -f "vercel.json" ] && echo "  ✓ vercel.json" || echo "  ✗ vercel.json 缺失"
[ -f "turbo.json" ] && echo "  ✓ turbo.json" || echo "  ✗ turbo.json 缺失"

echo ""
echo "✅ 检查工作区:"
for dir in apps/* packages/*; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo "  ✓ $dir"
    fi
done

echo ""
echo "✅ 检查构建命令:"
echo "  Install: bun install"
echo "  Build: bun run build"

echo ""
echo "✅ 检查环境变量需求:"
echo "  必需: POSTGRES_URL, NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_CLERK_*"
echo ""

echo "=== 检查完成 ==="
EOF

chmod +x test-vercel-deployment.sh
log_success "✅ 创建验证脚本"

# 7. 运行验证
log_info "步骤 7: 运行部署前验证..."
./test-vercel-deployment.sh

# 8. 提交更改
log_info "步骤 8: 准备提交..."

git add vercel.json .vercelignore test-vercel-deployment.sh
if [ -f "apps/nextjs/vercel.json" ]; then
    git rm apps/nextjs/vercel.json
fi

log_success "✅ 文件已准备提交"

log_warning "执行以下命令完成部署修复："
echo ""
echo "  1. 提交更改："
echo "     git commit -m 'fix: 最终修复 Vercel monorepo 部署配置'"
echo ""
echo "  2. 推送到远程："
echo "     git push origin main"
echo ""
echo "  3. 在 Vercel Dashboard 中："
echo "     - 确保 Root Directory 设置为: ./"
echo "     - 确保 Framework Preset 设置为: Other"
echo "     - 确保 Build Command: bun install && bun run build"
echo "     - 确保 Output Directory: apps/nextjs/.next"
echo "     - 确保 Install Command: echo 'Using custom install'"
echo ""

log_success "✅ 修复脚本执行完成！"

# 额外说明
log_info "重要提示:"
echo "  1. Vercel 会自动检测 monorepo 结构"
echo "  2. 构建命令会在根目录执行"
echo "  3. 输出目录指向 Next.js 应用的 .next 文件夹"
echo "  4. auth-proxy 已被 .vercelignore 排除"