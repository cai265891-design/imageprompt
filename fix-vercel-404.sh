#!/bin/bash

# 修复 Vercel 部署 404 错误
# 问题：auth-proxy 拦截了所有请求导致 404

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

# 1. 禁用 auth-proxy 部署
log_info "步骤 1: 禁用 auth-proxy 部署..."

# 创建 auth-proxy 的 .vercelignore 文件
cat > apps/auth-proxy/.vercelignore << 'EOF'
# Ignore everything for auth-proxy
# This app should not be deployed as it's for NextAuth which is not being used
*
EOF

log_success "✅ 创建 auth-proxy/.vercelignore"

# 2. 确保主应用配置正确
log_info "步骤 2: 检查主应用配置..."

# 确保 vercel.json 配置正确
if [ -f "vercel.json" ]; then
    log_info "检查 vercel.json..."

    # 确保没有指向 auth-proxy 的重写规则
    if grep -q "auth-proxy" vercel.json; then
        log_warning "⚠️ vercel.json 包含 auth-proxy 引用，需要清理"
    else
        log_success "✅ vercel.json 配置正确"
    fi
fi

# 3. 确保 middleware 正确配置
log_info "步骤 3: 验证 middleware 配置..."

if [ -f "apps/nextjs/src/middleware.ts" ]; then
    if grep -q "clerkMiddleware" apps/nextjs/src/middleware.ts; then
        log_success "✅ Clerk middleware 已配置"
    else
        log_error "❌ Clerk middleware 未找到"
    fi
fi

# 4. 验证公开路由配置
log_info "步骤 4: 验证公开路由..."

if grep -q "image-prompt" apps/nextjs/src/middleware.ts; then
    log_success "✅ image-prompt 路由已配置为公开路由"
else
    log_warning "⚠️ image-prompt 路由可能未配置为公开路由"
fi

# 5. 创建部署验证脚本
log_info "步骤 5: 创建验证脚本..."

cat > verify-deployment.sh << 'EOF'
#!/bin/bash
# 验证部署是否成功

DEPLOY_URL="${1:-https://show.saasfly.io}"

echo "验证部署: $DEPLOY_URL"
echo "---"

# 测试主页
echo -n "测试主页... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/")
if [ "$STATUS" = "200" ] || [ "$STATUS" = "308" ] || [ "$STATUS" = "307" ]; then
    echo "✅ OK ($STATUS)"
else
    echo "❌ 失败 ($STATUS)"
fi

# 测试 image-prompt 页面
echo -n "测试 /zh/image-prompt... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/zh/image-prompt")
if [ "$STATUS" = "200" ]; then
    echo "✅ OK ($STATUS)"
else
    echo "❌ 失败 ($STATUS)"
fi

# 测试 favicon
echo -n "测试 /favicon.ico... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/favicon.ico")
if [ "$STATUS" = "200" ] || [ "$STATUS" = "304" ]; then
    echo "✅ OK ($STATUS)"
else
    echo "❌ 失败 ($STATUS)"
fi
EOF

chmod +x verify-deployment.sh
log_success "✅ 创建验证脚本 verify-deployment.sh"

# 6. 提交更改
log_info "步骤 6: 准备提交..."

git add apps/auth-proxy/.vercelignore
git add verify-deployment.sh

log_warning "请执行以下命令完成修复："
echo ""
echo "  1. 提交更改："
echo "     git commit -m 'fix: 禁用 auth-proxy 以解决 404 错误'"
echo ""
echo "  2. 推送到远程："
echo "     git push origin main"
echo ""
echo "  3. 等待 Vercel 自动部署"
echo ""
echo "  4. 验证部署："
echo "     ./verify-deployment.sh"
echo ""

log_success "✅ 修复脚本执行完成！"