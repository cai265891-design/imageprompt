#!/bin/bash

# 修复 Vercel 构建失败问题
# 错误: Command "bun install" exited with 1

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

log_info "开始修复 Vercel 构建问题..."

# 1. 检查并安装缺失的依赖
log_info "步骤 1: 安装缺失的依赖..."

# 检查是否安装了 manypkg
if ! grep -q "manypkg" package.json; then
    log_warning "manypkg 未在依赖中，添加到 devDependencies..."
    bun add -D @manypkg/cli
    log_success "✅ 安装 manypkg"
fi

# 2. 更新 bun.lockb
log_info "步骤 2: 更新 bun.lockb..."
bun install
log_success "✅ 更新 bun.lockb"

# 3. 验证工作区配置
log_info "步骤 3: 验证工作区配置..."

# 检查所有工作区的 package.json
for workspace in apps/* packages/* tooling/*; do
    if [ -d "$workspace" ] && [ -f "$workspace/package.json" ]; then
        pkg_name=$(grep '"name"' "$workspace/package.json" | head -1 | cut -d'"' -f4)
        log_info "  检查工作区: $pkg_name"
    fi
done

# 4. 清理并重新安装
log_info "步骤 4: 清理并重新安装依赖..."

# 清理 node_modules
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf tooling/*/node_modules

# 重新安装
bun install
log_success "✅ 重新安装依赖完成"

# 5. 验证构建
log_info "步骤 5: 验证构建..."

# 尝试本地构建
log_info "运行本地构建测试..."
if bun run build; then
    log_success "✅ 本地构建成功"
else
    log_error "❌ 本地构建失败"
    exit 1
fi

# 6. 创建 Vercel 特定的配置
log_info "步骤 6: 创建 Vercel 环境变量文件..."

cat > .env.vercel << 'EOF'
# Vercel 构建环境变量
SKIP_ENV_VALIDATION=true
NODE_ENV=production
EOF

log_success "✅ 创建 .env.vercel"

# 7. 提交更改
log_info "步骤 7: 准备提交更改..."

git add package.json bun.lockb
if [ -f .env.vercel ]; then
    git add .env.vercel
fi

log_success "✅ 文件已添加到 git"

log_warning "请执行以下命令完成修复："
echo ""
echo "  1. 提交更改："
echo "     git commit -m 'fix: 修复 Vercel 构建依赖问题'"
echo ""
echo "  2. 推送到远程："
echo "     git push origin main"
echo ""
echo "  3. 在 Vercel 中重新触发部署"
echo ""

log_success "✅ 修复脚本执行完成！"

# 额外提示
log_info "如果问题仍然存在，请检查："
echo "  - Vercel 项目设置中的 Node.js 版本（建议 18.x 或 20.x）"
echo "  - Vercel 项目设置中的包管理器（确保选择 Bun）"
echo "  - 环境变量是否正确配置"