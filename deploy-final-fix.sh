#!/bin/bash

# NextAuth 静态资源问题最终修复部署脚本
# 修复了生产环境的 404 Not Found 问题

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

# 检查 Vercel CLI
check_vercel_cli() {
    if ! command -v vercel > /dev/null 2>&1; then
        log_error "请先安装 Vercel CLI: npm i -g vercel"
        exit 1
    fi
}

# 验证修复
validate_fix() {
    log_info "验证修复代码..."
    
    # 检查是否使用了正确的返回格式
    if grep -q "return null" /Users/caihongjia/saasfly/apps/auth-proxy/routes/[...auth].ts; then
        log_success "✅ 发现正确的 null 返回格式"
    else
        log_error "❌ 未发现 null 返回格式"
        exit 1
    fi
    
    # 检查是否移除了有问题的 send 函数调用
    if ! grep -q "send.*404.*'Not Found'" /Users/caihongjia/saasfly/apps/auth-proxy/routes/[...auth].ts; then
        log_success "✅ 已移除有问题的 send 函数调用"
    else
        log_error "❌ 仍存在有问题的 send 函数调用"
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
    
    log_success "本地测试通过"
    cd ../..
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
    
    log_success "✅ 部署验证完成！"
    log_info "🎉 NextAuth 静态资源问题已完全修复"
    log_info "部署URL: $deployment_url"
    log_info ""
    log_info "修复总结："
    log_info "- 生产环境不再返回 404 Not Found"
    log_info "- 静态资源正确绕过 NextAuth 处理"
    log_info "- 使用 null 返回让请求继续传递"
    log_info "- 兼容 Edge Runtime 环境"
}

# 主流程
main() {
    log_info "🚀 开始 NextAuth 静态资源问题最终修复部署"
    echo "==========================================="
    
    # 检查 Vercel CLI
    check_vercel_cli
    
    # 验证修复代码
    validate_fix
    
    # 运行本地测试
    run_local_tests
    
    # 部署到 Vercel
    local deployment_url=$(deploy_to_vercel)
    
    # 验证部署
    validate_deployment "$deployment_url"
    
    echo "==========================================="
    log_success "🎉 所有步骤完成！修复部署成功！"
}

# 信号处理
trap 'log_info "部署脚本已停止"; exit 0' INT TERM

# 运行主程序
main "$@" || {
    log_error "部署过程失败"
    exit 1
}