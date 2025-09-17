#!/bin/bash

# 监控 Vercel 部署状态
# 持续检查部署是否成功

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 部署 URL（根据实际情况修改）
DEPLOY_URL="${1:-https://show.saasfly.io}"
CHECK_INTERVAL=30
MAX_ATTEMPTS=20

log_info "开始监控 Vercel 部署状态..."
log_info "目标 URL: $DEPLOY_URL"
log_info "检查间隔: ${CHECK_INTERVAL} 秒"
log_info "最大尝试次数: $MAX_ATTEMPTS"

echo ""
echo "等待部署完成..."
echo ""

attempt=1
deployment_success=false

while [ $attempt -le $MAX_ATTEMPTS ]; do
    log_info "尝试 #$attempt/$MAX_ATTEMPTS..."

    # 检查主页
    echo -n "  检查主页... "
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/" || echo "000")

    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "308" ] || [ "$HTTP_STATUS" = "307" ]; then
        echo "✅ OK ($HTTP_STATUS)"

        # 检查 API 健康状态
        echo -n "  检查 API... "
        API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/api/trpc/edge/health" || echo "000")
        if [ "$API_STATUS" = "200" ] || [ "$API_STATUS" = "204" ]; then
            echo "✅ OK ($API_STATUS)"
        else
            echo "⚠️ API 未就绪 ($API_STATUS)"
        fi

        # 检查静态资源
        echo -n "  检查静态资源... "
        STATIC_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/favicon.ico" || echo "000")
        if [ "$STATIC_STATUS" = "200" ] || [ "$STATIC_STATUS" = "304" ]; then
            echo "✅ OK ($STATIC_STATUS)"
        else
            echo "⚠️ 静态资源未就绪 ($STATIC_STATUS)"
        fi

        # 检查特定页面
        echo -n "  检查 /zh/image-prompt... "
        PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/zh/image-prompt" || echo "000")
        if [ "$PAGE_STATUS" = "200" ]; then
            echo "✅ OK ($PAGE_STATUS)"
            deployment_success=true
            break
        else
            echo "❌ 页面错误 ($PAGE_STATUS)"
        fi
    else
        echo "❌ 站点未就绪 ($HTTP_STATUS)"
    fi

    if [ $attempt -lt $MAX_ATTEMPTS ]; then
        echo ""
        echo "  等待 $CHECK_INTERVAL 秒后重试..."
        sleep $CHECK_INTERVAL
    fi

    attempt=$((attempt + 1))
    echo ""
done

echo ""
echo "========================================"
echo ""

if [ "$deployment_success" = true ]; then
    log_success "✅ 部署成功！"
    echo ""
    echo "站点已上线："
    echo "  🌐 主页: $DEPLOY_URL"
    echo "  📄 Image Prompt: $DEPLOY_URL/zh/image-prompt"
    echo "  🎨 Image to Prompt: $DEPLOY_URL/zh/image-to-prompt"
    echo ""

    # 详细测试
    log_info "运行详细测试..."
    echo ""

    # 测试多语言路由
    for lang in en zh ko ja; do
        echo -n "  测试 /$lang... "
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/$lang")
        if [ "$STATUS" = "200" ] || [ "$STATUS" = "308" ]; then
            echo "✅"
        else
            echo "❌ ($STATUS)"
        fi
    done

    echo ""
    log_success "部署验证完成！"
else
    log_error "❌ 部署失败或超时！"
    echo ""
    echo "请检查："
    echo "  1. Vercel Dashboard 中的构建日志"
    echo "  2. 环境变量是否正确配置"
    echo "  3. 域名 DNS 设置"
    echo ""
    echo "调试命令："
    echo "  vercel logs --follow"
    echo "  vercel env ls"
    exit 1
fi

echo ""
echo "========================================"
echo ""
log_info "监控完成"