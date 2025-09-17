#!/bin/bash

# 最终部署测试脚本
# 验证所有修复是否生效

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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "========================================"
echo "      Vercel 部署最终测试"
echo "========================================"
echo ""

# 测试 URL
DEPLOY_URL="${1:-https://show.saasfly.io}"

log_info "测试目标: $DEPLOY_URL"
echo ""

# 等待部署完成（给 Vercel 一些时间）
log_info "等待 60 秒让部署完成..."
sleep 60

echo ""
echo "开始测试..."
echo ""

# 测试计数器
total_tests=0
passed_tests=0

# 测试函数
test_url() {
    local url=$1
    local expected=$2
    local description=$3

    total_tests=$((total_tests + 1))
    echo -n "[$total_tests] $description... "

    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")

    if [[ " $expected " =~ " $STATUS " ]]; then
        echo -e "${GREEN}✅ PASS${NC} ($STATUS)"
        passed_tests=$((passed_tests + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (期望: $expected, 实际: $STATUS)"
        return 1
    fi
}

echo "=== 基础功能测试 ==="
echo ""

# 1. 主页测试
test_url "$DEPLOY_URL/" "200 307 308" "主页访问"
test_url "$DEPLOY_URL/en" "200 308" "英文主页"
test_url "$DEPLOY_URL/zh" "200 308" "中文主页"

echo ""
echo "=== 公开页面测试（不需要登录）==="
echo ""

# 2. Image Prompt 页面测试
test_url "$DEPLOY_URL/zh/image-prompt" "200" "中文 Image Prompt 页面"
test_url "$DEPLOY_URL/en/image-prompt" "200" "英文 Image Prompt 页面"
test_url "$DEPLOY_URL/zh/image-to-prompt" "200" "中文 Image-to-Prompt 页面"
test_url "$DEPLOY_URL/en/image-to-prompt" "200" "英文 Image-to-Prompt 页面"
test_url "$DEPLOY_URL/zh/tutorials" "200" "中文教程页面"

echo ""
echo "=== 静态资源测试 ==="
echo ""

# 3. 静态文件测试
test_url "$DEPLOY_URL/favicon.ico" "200 304" "Favicon 图标"
test_url "$DEPLOY_URL/robots.txt" "200" "Robots.txt 文件"

echo ""
echo "=== API 测试 ==="
echo ""

# 4. API 端点测试
test_url "$DEPLOY_URL/api/trpc/edge/health" "200 204 405" "tRPC API 健康检查"

echo ""
echo "=== 受保护页面测试（需要登录）==="
echo ""

# 5. Dashboard 页面（应该重定向到登录）
test_url "$DEPLOY_URL/zh/dashboard" "307 302" "Dashboard（应重定向到登录）"
test_url "$DEPLOY_URL/zh/dashboard/settings" "307 302" "设置页面（应重定向到登录）"

echo ""
echo "========================================"
echo ""

# 结果汇总
if [ $passed_tests -eq $total_tests ]; then
    log_success "✅ 所有测试通过！($passed_tests/$total_tests)"
    echo ""
    echo "🎉 部署成功！"
    echo ""
    echo "可访问的公开页面："
    echo "  - $DEPLOY_URL/zh/image-prompt"
    echo "  - $DEPLOY_URL/zh/image-to-prompt"
    echo "  - $DEPLOY_URL/zh/tutorials"
    echo ""
    exit 0
else
    log_error "❌ 部分测试失败！($passed_tests/$total_tests 通过)"
    echo ""
    echo "失败的测试数: $((total_tests - passed_tests))"
    echo ""
    echo "请检查："
    echo "  1. Vercel Dashboard 中的函数日志"
    echo "  2. 中间件配置是否正确"
    echo "  3. 环境变量是否完整"
    echo ""
    echo "调试命令："
    echo "  vercel logs --follow"
    echo ""
    exit 1
fi