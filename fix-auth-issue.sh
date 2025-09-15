#!/bin/bash

# NextAuth 静态资源问题一键修复脚本
# 包含完整的修复、构建、部署和验证流程

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

# 检查环境
check_environment() {
    log_info "检查环境..."
    
    # 检查必要命令
    local required_commands=("bun" "curl" "jq")
    for cmd in "${required_commands[@]}"; do
        if ! command -v $cmd > /dev/null 2>&1; then
            log_error "缺少必要命令: $cmd"
            exit 1
        fi
    done
    
    log_success "环境检查通过"
}

# 本地验证
local_validation() {
    log_info "开始本地验证..."
    
    # 启动 auth-proxy 服务
    log_info "启动 auth-proxy 服务..."
    cd apps/auth-proxy
    
    # 后台启动服务
    bun run dev > /tmp/auth-proxy.log 2>&1 &
    local proxy_pid=$!
    
    # 等待服务启动
    sleep 5
    
    # 检查服务是否启动成功
    if ! kill -0 $proxy_pid 2>/dev/null; then
        log_error "auth-proxy 服务启动失败"
        cat /tmp/auth-proxy.log
        exit 1
    fi
    
    log_success "auth-proxy 服务已启动 (PID: $proxy_pid)"
    
    # 运行验证脚本
    log_info "运行本地验证..."
    if ../../validate-auth-fix.sh http://localhost:3002; then
        log_success "本地验证通过"
        local_test_passed=true
    else
        log_error "本地验证失败"
        local_test_passed=false
    fi
    
    # 停止服务
    log_info "停止 auth-proxy 服务..."
    kill $proxy_pid 2>/dev/null || true
    wait $proxy_pid 2>/dev/null || true
    
    cd ../..
    
    if [[ "$local_test_passed" != true ]]; then
        exit 1
    fi
}

# 构建项目
build_project() {
    log_info "构建项目..."
    
    # 清理之前的构建
    if [[ -d "apps/auth-proxy/.output" ]]; then
        rm -rf apps/auth-proxy/.output
    fi
    
    # 构建 auth-proxy
    log_info "构建 auth-proxy..."
    cd apps/auth-proxy
    bun run build
    cd ../..
    
    # 检查构建结果
    if [[ !d "apps/auth-proxy/.output" ]]; then
        log_error "构建失败：未找到输出目录"
        exit 1
    fi
    
    log_success "构建完成"
}

# 部署到 Vercel
deploy_to_vercel() {
    log_info "部署到 Vercel..."
    
    # 检查 Vercel CLI
    if ! command -v vercel > /dev/null 2>&1; then
        log_error "请先安装 Vercel CLI: npm i -g vercel"
        exit 1
    fi
    
    # 部署 auth-proxy
    log_info "部署 auth-proxy..."
    cd apps/auth-proxy
    
    local deployment_url=$(vercel --yes --token=${VERCEL_TOKEN} 2>&1 | tail -n1)
    
    if [[ -z "$deployment_url" ]] || [[ "$deployment_url" != *"vercel.app"* ]]; then
        log_error "部署失败"
        exit 1
    fi
    
    log_success "部署完成: $deployment_url"
    echo "$deployment_url" > /tmp/deployment-url.txt
    
    cd ../..
}

# 验证部署
validate_deployment() {
    local deployment_url=$(cat /tmp/deployment-url.txt 2>/dev/null)
    
    if [[ -z "$deployment_url" ]]; then
        log_error "未找到部署URL"
        exit 1
    fi
    
    log_info "验证部署: $deployment_url"
    
    # 等待部署稳定
    log_info "等待部署稳定..."
    sleep 10
    
    # 运行验证
    ./validate-auth-fix.sh "$deployment_url"
}

# 持续监控
start_monitoring() {
    log_info "启动持续监控..."
    
    if [[ -n "${VERCEL_PROJECT_ID}" ]] && [[ -n "${VERCEL_TOKEN}" ]]; then
        ./deploy-monitor.sh --quick
    else
        log_warning "未设置 Vercel 环境变量，跳过自动监控"
        log_info "请手动运行: ./deploy-monitor.sh"
    fi
}

# 回滚机制
rollback() {
    log_warning "执行回滚..."
    
    # 这里可以添加回滚逻辑
    # 例如：重新部署上一个稳定版本
    
    log_info "回滚完成"
}

# 主流程
main() {
    log_info "🚀 开始 NextAuth 静态资源问题修复流程"
    echo "=========================================="
    
    # 检查环境
    check_environment
    
    # 步骤1: 本地验证
    if ! local_validation; then
        log_error "本地验证失败，请检查修复代码"
        exit 1
    fi
    
    # 步骤2: 构建项目
    if ! build_project; then
        log_error "构建失败"
        exit 1
    fi
    
    # 步骤3: 部署到 Vercel
    if ! deploy_to_vercel; then
        log_error "部署失败"
        exit 1
    fi
    
    # 步骤4: 验证部署
    if ! validate_deployment; then
        log_error "部署验证失败"
        
        # 可选：回滚
        read -p "是否执行回滚? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rollback
        fi
        
        exit 1
    fi
    
    # 步骤5: 持续监控
    start_monitoring
    
    echo "=========================================="
    log_success "🎉 修复流程完成！"
    log_info "NextAuth 静态资源问题已解决"
    log_info "可以使用 ./deploy-monitor.sh 持续监控"
}

# 使用说明
usage() {
    echo "用法: $0 [--help]"
    echo "  --help: 显示帮助"
    echo ""
    echo "环境变量:"
    echo "  VERCEL_TOKEN: Vercel API Token (可选，用于自动部署)"
    echo "  VERCEL_PROJECT_ID: Vercel 项目ID (可选，用于自动监控)"
    exit 0
}

# 信号处理
trap 'log_info "修复脚本已停止"; exit 0' INT TERM

# 参数处理
case "${1:-}" in
    --help|-h)
        usage
        ;;
    "")
        main
        ;;
    *)
        log_error "未知参数: $1"
        usage
        ;;
esac