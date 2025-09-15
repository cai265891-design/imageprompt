#!/bin/bash

# NextAuth 静态资源问题修复部署脚本

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

# 构建 auth-proxy
build_auth_proxy() {
    log_info "构建 auth-proxy..."
    cd apps/auth-proxy
    
    # 清理之前的构建
    rm -rf .output .vercel
    
    # 构建项目
    bun run build
    
    if [[ ! -d ".output" ]]; then
        log_error "构建失败：未找到输出目录"
        exit 1
    fi
    
    log_success "构建完成"
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
    log_info "等待部署稳定..."
    sleep 15
    
    # 运行验证脚本
    ./validate-auth-fix.sh "$deployment_url"
}

# 主流程
main() {
    log_info "🚀 开始部署 NextAuth 静态资源修复"
    echo "==========================================="
    
    # 检查 Vercel CLI
    check_vercel_cli
    
    # 构建项目
    build_auth_proxy
    
    # 部署到 Vercel
    local deployment_url=$(deploy_to_vercel)
    
    # 验证部署
    if validate_deployment "$deployment_url"; then
        echo "==========================================="
        log_success "🎉 部署和验证完成！"
        log_info "部署URL: $deployment_url"
        log_info "NextAuth 静态资源问题已修复"
        log_info "可以使用以下命令持续监控:"
        log_info "  ./deploy-monitor.sh --monitor"
        log_info "  ./validate-auth-fix.sh $deployment_url --monitor"
    else
        log_error "部署验证失败，请检查日志"
        exit 1
    fi
}

# 信号处理
trap 'log_info "部署脚本已停止"; exit 0' INT TERM

# 运行主程序
main "$@"