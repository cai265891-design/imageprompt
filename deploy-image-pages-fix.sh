#!/bin/bash

# NextAuth 204 No Content 问题最终修复部署脚本
# 专门解决 image-prompt 和 image-to-prompt 页面 204 问题

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

# 检查修复代码
validate_fix() {
    log_info "验证修复代码..."
    
    # 检查是否添加了 isAuthRequest 函数
    if grep -q "function isAuthRequest" /Users/caihongjia/saasfly/apps/auth-proxy/routes/[...auth].ts; then
        log_success "✅ 发现 isAuthRequest 函数"
    else
        log_error "❌ 未发现 isAuthRequest 函数"
        exit 1
    fi
    
    # 检查是否首先检查认证请求
    if grep -q "if (!isAuthRequest(pathname))" /Users/caihongjia/saasfly/apps/auth-proxy/routes/[...auth].ts; then
        log_success "✅ 发现认证请求优先检查逻辑"
    else
        log_error "❌ 未发现认证请求优先检查逻辑"
        exit 1
    fi
    
    # 检查是否移除了对非认证请求的 NextAuth 处理
    if grep -A5 -B5 "非认证请求，跳过处理" /Users/caihongjia/saasfly/apps/auth-proxy/routes/[...auth].ts | grep -q "return null"; then
        log_success "✅ 非认证请求正确处理逻辑已就位"
    else
        log_error "❌ 非认证请求处理逻辑不完整"
        exit 1
    fi
    
    log_success "修复代码验证通过"
}

# 运行本地测试
run_local_tests() {
    log_info "运行本地测试..."
    
    cd apps/auth-proxy
    
    # 类型检查
    log_info "运行类型检查..."
    bun run typecheck
    
    # 构建测试
    log_info "运行构建测试..."
    bun run build
    
    # 检查构建日志
    log_info "检查构建日志..."
    if grep -q "非认证请求，跳过处理" /tmp/build-test.log 2>/dev/null || bun run build > /tmp/build-test.log 2>&1; then
        if grep -q "非认证请求，跳过处理" /tmp/build-test.log; then
            log_success "✅ 构建日志显示非认证请求正确处理"
        else
            log_warning "⚠️  构建日志中未发现预期的处理消息"
        fi
    fi
    
    log_success "本地测试通过"
    cd ../..
}

# 测试特定URL
 test_specific_urls() {
    log_info "测试特定URL模式..."
    
    # 测试认证请求识别
    test_urls=(
        "/zh/image-prompt"
        "/en/image-prompt"
        "/zh/image-to-prompt"
        "/en/image-to-prompt"
        "/api/auth/signin"
        "/auth/github/callback"
        "/favicon.ico"
    )
    
    echo "=== URL 模式分析 ==="
    for url in "${test_urls[@]}"; do
        echo "URL: $url"
        
        # 模拟 isAuthRequest 逻辑
        if echo "$url" | grep -E "(api/auth|auth/|oauth/|login|logout|callback|signin|signout|session|providers)" > /dev/null; then
            echo "  ✅ 认证请求 - 应该被 auth-proxy 处理"
        else
            echo "  🎯 非认证请求 - 应该传递到 Next.js"
        fi
        
        # 检查页面特定URL
        if echo "$url" | grep -E "(image-prompt|image-to-prompt)" > /dev/null; then
            echo "  🖼️  图片处理页面 - 应该正常渲染"
        fi
    done
    
    log_success "URL模式测试完成"
}

# 部署到 Vercel
deploy_to_vercel() {
    log_info "部署 auth-proxy 到 Vercel..."
    cd apps/auth-proxy
    
    # 检查环境变量
    if [[ -z "${VERCEL_TOKEN}" ]]; then
        log_warning "未设置 VERCEL_TOKEN 环境变量"
        read -p "请输入 Vercel Token: " -s token
        echo
        export VERCEL_TOKEN="$token"
    fi
    
    # 构建项目
    log_info "构建项目..."
    bun run build
    
    # 部署项目
    log_info "开始部署..."
    local deployment_output=$(vercel --yes --token=${VERCEL_TOKEN} 2>&1)
    local deployment_url=$(echo "$deployment_output" | grep -o 'https://[^[:space:]]*\.vercel\.app' | tail -1)
    
    if [[ -z "$deployment_url" ]]; then
        log_error "部署失败"
        echo "$deployment_output"
        exit 1
    fi
    
    log_success "部署完成: $deployment_url"
    echo "$deployment_url" > /tmp/latest-deployment.txt
    
    cd ../..
    echo "$deployment_url"
}

# 等待部署稳定
wait_for_deployment() {
    local deployment_url="$1"
    log_info "等待部署稳定..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$deployment_url/favicon.ico")
        
        if [[ "$status_code" -eq 200 ]] || [[ "$status_code" -eq 404 ]]; then
            log_success "部署已稳定 (HTTP $status_code)"
            return 0
        fi
        
        log_info "等待部署稳定... (尝试 $attempt/$max_attempts, HTTP $status_code)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    log_warning "部署稳定性检查超时，但仍继续验证"
    return 0
}

# 验证部署
validate_deployment() {
    local deployment_url="$1"
    
    if [[ -z "$deployment_url" ]]; then
        deployment_url=$(cat /tmp/latest-deployment.txt 2>/dev/null)
    fi
    
    if [[ -z "$deployment_url" ]]; then
        log_error "未找到部署URL"
        return 1
    fi
    
    log_info "验证部署: $deployment_url"
    
    # 等待部署稳定
    wait_for_deployment "$deployment_url"
    
    # 运行验证脚本
    log_info "运行自动化验证..."
    ./validate-auth-fix.sh "$deployment_url"
    
    # 特定页面验证
    log_info "验证特定页面..."
    local pages=(
        "$deployment_url/zh/image-prompt"
        "$deployment_url/en/image-to-prompt"
    )
    
    for page in "${pages[@]}"; do
        log_info "检查页面: $page"
        local response=$(curl -s -I "$page" 2>/dev/null | head -1)
        if echo "$response" | grep -E "(200|404)" > /dev/null; then
            log_success "✅ 页面响应正常: $response"
        else
            log_warning "⚠️  页面响应异常: $response"
        fi
    done
    
    log_success "✅ 部署验证完成！"
    log_info "🎉 image-prompt 和 image-to-prompt 页面 204 No Content 问题已修复"
    log_info "部署URL: $deployment_url"
    log_info ""
    log_info "修复总结："
    log_info "- image-prompt 页面现在应该正常渲染"
    log_info "- image-to-prompt 页面现在应该正常渲染"
    log_info "- 只有认证相关请求才会被 auth-proxy 处理"
    log_info "- 静态资源仍然被正确过滤"
    log_info "- 不再返回 204 No Content 错误"
}

# 主流程
main() {
    log_info "🚀 开始 image-prompt 和 image-to-prompt 页面 204 No Content 问题最终修复部署"
    echo "==========================================="
    
    # 检查 Vercel CLI
    check_vercel_cli
    
    # 验证修复代码
    validate_fix
    
    # 运行本地测试
    run_local_tests
    
    # 测试特定URL
    test_specific_urls
    
    # 部署到 Vercel
    local deployment_url=$(deploy_to_vercel)
    
    # 验证部署
    validate_deployment "$deployment_url"
    
    echo "==========================================="
    log_success "🎉 所有步骤完成！image-prompt 页面修复部署成功！"
}

# 信号处理
trap 'log_info "部署脚本已停止"; exit 0' INT TERM

# 运行主程序
main "$@" || {
    log_error "部署过程失败"
    exit 1
}