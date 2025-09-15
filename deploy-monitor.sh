#!/bin/bash

# Vercel 部署监控脚本
# 自动检查部署状态并验证 NextAuth 静态资源修复

set -e

# 配置
PROJECT_ID="${VERCEL_PROJECT_ID:-}"
TOKEN="${VERCEL_TOKEN:-}"
DEPLOYMENT_URL=""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
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
    log_info "检查环境配置..."
    
    if [[ -z "$PROJECT_ID" ]]; then
        log_error "未设置 VERCEL_PROJECT_ID 环境变量"
        exit 1
    fi
    
    if [[ -z "$TOKEN" ]]; then
        log_error "未设置 VERCEL_TOKEN 环境变量"
        exit 1
    fi
    
    # 检查 jq 是否安装
    if ! command -v jq &> /dev/null; then
        log_error "请先安装 jq: brew install jq"
        exit 1
    fi
    
    log_success "环境检查通过"
}

# 获取最新部署信息
get_latest_deployment() {
    log_info "获取最新部署信息..."
    
    local response=$(curl -s "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=1" \
        -H "Authorization: Bearer $TOKEN")
    
    if [[ -z "$response" ]]; then
        log_error "无法获取部署信息"
        return 1
    fi
    
    local status=$(echo "$response" | jq -r '.deployments[0].state')
    local url=$(echo "$response" | jq -r '.deployments[0].url')
    local id=$(echo "$response" | jq -r '.deployments[0].uid')
    
    if [[ "$status" == "null" ]] || [[ -z "$status" ]]; then
        log_error "无法解析部署状态"
        return 1
    fi
    
    DEPLOYMENT_URL="$url"
    
    log_info "部署状态: $status"
    log_info "部署ID: $id"
    log_info "预览URL: https://$url"
    
    echo "$status"
}

# 验证静态资源
validate_static_resources() {
    local base_url="https://$1"
    log_info "验证静态资源: $base_url"
    
    # 测试URL列表 - 基于错误日志
    local test_urls=(
        "/favicon.ico"
        "/favicon.png"
        "/robots.txt"
        "/sitemap.xml"
        "/"
    )
    
    local failed=0
    local passed=0
    
    for url in "${test_urls[@]}"; do
        local full_url="${base_url}${url}"
        log_info "测试: $full_url"
        
        # 执行请求
        local response
        local http_code
        
        for i in {1..3}; do
            response=$(curl -s -w "\n%{http_code}" -I "$full_url" 2>/dev/null || true)
            http_code=$(echo "$response" | tail -n1)
            local headers=$(echo "$response" | head -n-1)
            
            # 检查是否有认证错误
            if echo "$headers" | grep -qi "UnknownAction\|Cannot parse action\|auth.*error\|@auth/core"; then
                log_error "检测到认证错误 (尝试 $i/3)"
                if [[ $i -lt 3 ]]; then
                    sleep 2
                    continue
                fi
                failed=$((failed + 1))
                break
            fi
            
            # 检查响应码
            if [[ "$http_code" -ge 200 && "$http_code" -lt 400 ]]; then
                log_success "正常响应 ($http_code)"
                passed=$((passed + 1))
                break
            elif [[ "$http_code" == 404 ]]; then
                log_warning "资源不存在 (404) - 这是正常的"
                passed=$((passed + 1))
                break
            else
                log_warning "异常响应码: $http_code (尝试 $i/3)"
                if [[ $i -eq 3 ]]; then
                    failed=$((failed + 1))
                else
                    sleep 2
                fi
            fi
        done
    done
    
    log_info "=== 验证结果 ==="
    log_info "✅ 通过: $passed"
    log_info "❌ 失败: $failed"
    log_info "总计: $((passed + failed))"
    
    if [[ $failed -eq 0 ]]; then
        log_success "🎉 所有测试通过！NextAuth 静态资源问题已修复"
        return 0
    else
        log_error "❌ 仍有 $failed 个问题需要修复"
        return 1
    fi
}

# 等待部署完成
wait_for_deployment() {
    local max_attempts=30
    local attempt=1
    
    log_info "等待部署完成..."
    
    while [[ $attempt -le $max_attempts ]]; do
        local status=$(get_latest_deployment)
        
        case "$status" in
            "READY")
                log_success "部署完成！"
                return 0
                ;;
            "ERROR")
                log_error "部署失败"
                return 1
                ;;
            "CANCELED")
                log_error "部署被取消"
                return 1
                ;;
            *)
                log_info "部署状态: $status (尝试 $attempt/$max_attempts)"
                ;;
        esac
        
        sleep 10
        attempt=$((attempt + 1))
    done
    
    log_error "等待部署超时"
    return 1
}

# 主监控循环
monitor_deployment() {
    log_info "开始部署监控循环..."
    
    while true; do
        log_info "=== $(date) ==="
        
        # 获取部署状态
        local status=$(get_latest_deployment)
        
        case "$status" in
            "READY")
                log_success "部署已完成，开始验证..."
                if validate_static_resources "$DEPLOYMENT_URL"; then
                    log_success "🎉 修复验证成功！"
                    log_info "部署URL: https://$DEPLOYMENT_URL"
                    log_info "可以安全地使用此部署"
                    return 0
                else
                    log_error "验证失败，继续监控..."
                fi
                ;;
            "ERROR"|"CANCELED")
                log_error "部署失败，等待新的部署..."
                ;;
            *)
                log_info "部署进行中，继续监控..."
                ;;
        esac
        
        log_info "下次检查: $(date -d '+60 seconds')"
        echo "---"
        sleep 60
    done
}

# 快速验证模式
quick_validate() {
    log_info "快速验证模式"
    
    local status=$(get_latest_deployment)
    if [[ "$status" != "READY" ]]; then
        log_warning "部署状态: $status，等待完成..."
        if ! wait_for_deployment; then
            return 1
        fi
    fi
    
    validate_static_resources "$DEPLOYMENT_URL"
}

# 使用说明
usage() {
    echo "用法: $0 [--quick|--monitor|--help]"
    echo "  --quick: 快速验证当前部署"
    echo "  --monitor: 持续监控部署状态（默认）"
    echo "  --help: 显示帮助"
    echo ""
    echo "环境变量:"
    echo "  VERCEL_PROJECT_ID: Vercel 项目ID"
    echo "  VERCEL_TOKEN: Vercel API Token"
    exit 0
}

# 主程序
main() {
    case "${1:-}" in
        --help|-h)
            usage
            ;;
        --quick|-q)
            check_environment
            quick_validate
            ;;
        --monitor|-m|"")
            check_environment
            monitor_deployment
            ;;
        *)
            log_error "未知参数: $1"
            usage
            ;;
    esac
}

# 信号处理
trap 'log_info "监控脚本已停止"; exit 0' INT TERM

# 运行主程序
main "$@"