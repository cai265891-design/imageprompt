#!/bin/bash

# NextAuth 静态资源问题验证脚本
# 用于本地和部署后验证修复效果

echo "🔄 开始验证 NextAuth 静态资源修复..."

# 配置
BASE_URL="${1:-http://localhost:3002}"
MAX_RETRIES=5
RETRY_DELAY=3

# 测试URL列表 - 包含问题日志中出现的URL
TEST_URLS=(
    "/favicon.ico"
    "/favicon.png" 
    "/robots.txt"
    "/sitemap.xml"
    "/"
    "/images/test.png"
    "/css/style.css"
    "/js/app.js"
)

# 错误模式
ERROR_PATTERNS=(
    "UnknownAction"
    "Cannot parse action"
    "auth.*error"
    "@auth/core"
)

check_url() {
    local url="$1"
    local full_url="${BASE_URL}${url}"
    
    echo "Testing: $full_url"
    
    # 执行请求并捕获响应
    local response
    local http_code
    
    # 尝试多次
    for i in $(seq 1 $MAX_RETRIES); do
        response=$(curl -s -w "\n%{http_code}" -I "$full_url" 2>/dev/null || echo -e "\n000")
        http_code=$(echo "$response" | tail -n1)
        local headers=$(echo "$response" | sed '$d')
        
        # 检查是否有认证错误
        local has_auth_error=false
        for pattern in "${ERROR_PATTERNS[@]}"; do
            if echo "$headers" | grep -qi "$pattern"; then
                has_auth_error=true
                break
            fi
        done
        
        if [[ "$has_auth_error" == true ]]; then
            echo "❌ 检测到认证错误 (尝试 $i/$MAX_RETRIES)"
            if [[ $i -lt $MAX_RETRIES ]]; then
                sleep $RETRY_DELAY
                continue
            fi
            return 1
        fi
        
        # 检查响应码
        if [[ "$http_code" -ge 200 && "$http_code" -lt 400 ]]; then
            echo "✅ 正常响应 ($http_code)"
            return 0
        elif [[ "$http_code" == 404 ]]; then
            echo "⚠️  资源不存在 (404) - 这是正常的"
            return 0
        else
            echo "⚠️  异常响应码: $http_code (尝试 $i/$MAX_RETRIES)"
            if [[ $i -lt $MAX_RETRIES ]]; then
                sleep $RETRY_DELAY
                continue
            fi
            return 1
        fi
    done
    
    return 1
}

# 主要验证函数
validate_all() {
    local failed=0
    local passed=0
    
    echo "=== 开始验证 $(date) ==="
    echo "目标URL: $BASE_URL"
    echo ""
    
    for url in "${TEST_URLS[@]}"; do
        if check_url "$url"; then
            passed=$((passed + 1))
        else
            failed=$((failed + 1))
        fi
        echo ""
    done
    
    echo "=== 验证结果 ==="
    echo "✅ 通过: $passed"
    echo "❌ 失败: $failed"
    echo "总计: $((passed + failed))"
    
    if [[ $failed -eq 0 ]]; then
        echo "🎉 所有测试通过！NextAuth 静态资源问题已修复"
        return 0
    else
        echo "❌ 仍有 $failed 个问题需要修复"
        return 1
    fi
}

# 循环监控模式
monitor_mode() {
    echo "🔍 启动持续监控模式（按 Ctrl+C 退出）"
    while true; do
        if validate_all; then
            echo "✅ 本轮验证通过，等待下次检查..."
        else
            echo "❌ 发现问题，继续监控..."
        fi
        echo "下次检查: $(date -d '+30 seconds')"
        echo "---"
        sleep 30
    done
}

# 使用说明
usage() {
    echo "用法: $0 [URL] [--monitor]"
    echo "  URL: 测试的基础URL (默认: http://localhost:3002)"
    echo "  --monitor: 启用持续监控模式"
    exit 1
}

# 主程序
main() {
    if [[ "$1" == "--help" || "$1" == "-h" ]]; then
        usage
    fi
    
    local url="${1:-http://localhost:3002}"
    BASE_URL="$url"
    
    if [[ "$2" == "--monitor" || "$1" == "--monitor" ]]; then
        monitor_mode
    else
        validate_all
        exit $?
    fi
}

# 运行主程序
main "$@"