#!/bin/bash

# 系统性调试204 No Content问题
# 完整分析请求流向和路由处理

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

log_debug() {
    echo -e "${CYAN}[DEBUG]${NC} $1"
}

log_critical() {
    echo -e "${PURPLE}[CRITICAL]${NC} $1"
}

# 分析架构问题
analyze_architecture() {
    log_info "=== 架构分析 ==="
    
    log_info "1. 项目结构分析:"
    echo "   📁 Next.js 主应用: /apps/nextjs (端口3000)"
    echo "   🔐 Auth-proxy 服务: /apps/auth-proxy (端口3002)"
    echo "   ☁️  Vercel 部署: 边缘函数 + 路由重写"
    echo ""
    
    log_info "2. 当前Vercel重写规则:"
    if [ -f "apps/auth-proxy/vercel.json" ]; then
        cat apps/auth-proxy/vercel.json | grep -A5 -B5 "rewrite"
    fi
    echo ""
    
    log_info "3. Auth-proxy路由结构:"
    ls -la apps/auth-proxy/routes/ | cat -v
    echo ""
    
    log_info "4. 页面文件位置:"
    find apps/nextjs/src/app -name "*image*" -type f | head -5
    echo ""
}

# 分析路由匹配逻辑
analyze_routing_logic() {
    log_info "=== 路由匹配逻辑分析 ==="
    
    log_info "测试URL: /zh/image-prompt"
    
    # 检查Vercel重写规则
    log_debug "1. Vercel重写规则检查:"
    if grep -q "/api/auth/" apps/auth-proxy/vercel.json; then
        log_debug "   ✅ 发现规则: /api/auth/(.*) -> [...auth].ts"
        log_debug "   📝 /zh/image-prompt 不匹配此规则"
    fi
    echo ""
    
    # 检查Nitro路由
    log_debug "2. Nitro路由分析:"
    if [ -f "apps/auth-proxy/routes/[...auth].ts" ]; then
        log_debug "   📄 发现catch-all路由: [...auth].ts"
        log_debug "   🎯 理论上会捕获所有请求"
    fi
    echo ""
    
    # 检查isAuthRequest函数
    log_debug "3. isAuthRequest函数分析:"
    if grep -q "function isAuthRequest" apps/auth-proxy/routes/[...auth].ts; then
        log_success "   ✅ 发现isAuthRequest函数"
        
        # 提取认证模式
        log_debug "   🔍 认证模式列表:"
        grep -A20 "const authPatterns" apps/auth-proxy/routes/[...auth].ts | grep "^\s*\/^" | while read line; do
            echo "      $line"
        done
    fi
    echo ""
    
    # 测试特定URL
    test_url="/zh/image-prompt"
    log_debug "4. URL匹配测试: $test_url"
    
    # 检查是否匹配认证模式
    if echo "$test_url" | grep -E "(api/auth|auth/|oauth/|login|logout|callback|signin|signout|session|providers)" > /dev/null; then
        log_success "   ✅ 匹配认证模式"
    else
        log_warning "   🎯 不匹配认证模式 - 应该传递到Next.js"
    fi
    
    # 检查是否匹配静态资源
    if echo "$test_url" | grep -E "\.(ico|png|jpg|jpeg|gif|svg|webp|bmp|css|js|txt|xml|json)$" > /dev/null || \
       echo "$test_url" | grep -E "^/(images|fonts|logos|css|js|_next|static)/" > /dev/null; then
        log_success "   📁 匹配静态资源模式"
    fi
    echo ""
}

# 分析Edge Runtime行为
analyze_edge_runtime() {
    log_info "=== Edge Runtime行为分析 ==="
    
    log_info "1. Edge Runtime声明:"
    if grep -q "export const runtime = \"edge\"" apps/auth-proxy/routes/[...auth].ts; then
        log_success "   ✅ 声明为Edge Runtime"
    fi
    echo ""
    
    log_info "2. 响应处理逻辑:"
    if grep -q "return null" apps/auth-proxy/routes/[...auth].ts; then
        log_warning "   ⚠️  发现 return null - 可能导致204 No Content"
        log_info "   📝 在Edge Runtime中，return null 可能不会产生预期的转发行为"
    fi
    echo ""
    
    log_info "3. 错误处理:"
    if grep -q "catch.*error" apps/auth-proxy/routes/[...auth].ts; then
        log_debug "   ✅ 发现错误处理逻辑"
    fi
    echo ""
}

# 创建测试环境
create_test_environment() {
    log_info "=== 创建测试环境 ==="
    
    # 创建测试脚本
    cat > /tmp/test-edge-runtime.js << 'EOF'
// 测试Edge Runtime行为
const testCases = [
    { url: "/zh/image-prompt", expected: "Next.js页面" },
    { url: "/en/image-to-prompt", expected: "Next.js页面" },
    { url: "/api/auth/signin", expected: "认证处理" },
    { url: "/favicon.ico", expected: "静态资源" },
    { url: "/auth/github/callback", expected: "认证回调" }
];

console.log("=== Edge Runtime响应测试 ===");
testCases.forEach(test => {
    console.log(`URL: ${test.url}`);
    
    // 模拟isAuthRequest逻辑
    const isAuth = /(api\/auth|auth\/|oauth\/|login|logout|callback|signin|signout|session|providers)/.test(test.url);
    const isStatic = /\.(ico|png|jpg|jpeg|gif|svg|webp|bmp|css|js|txt|xml|json)$/.test(test.url) || 
                     /^\/(images|fonts|logos|css|js|_next|static)\//.test(test.url);
    
    if (isAuth) {
        console.log("  ✅ 认证相关 - 应该被处理");
    } else if (isStatic) {
        console.log("  📁 静态资源 - 应该被跳过");
    } else {
        console.log("  🎯 页面请求 - 应该传递到Next.js");
    }
});

console.log("\n=== 问题分析 ===");
console.log("如果返回null，在Edge Runtime中可能产生204 No Content");
console.log("需要找到正确的转发机制");
EOF

    node /tmp/test-edge-runtime.js
    echo ""
}

# 分析解决方案
analyze_solutions() {
    log_info "=== 解决方案分析 ==="
    
    log_critical "🎯 核心问题识别:"
    echo "   1. [...auth].ts 是catch-all路由，理论上接收所有请求"
    echo "   2. Vercel重写规则只匹配 /api/auth/(.*)"
    echo "   3. 但非认证请求仍然到达auth-proxy并返回null"
    echo "   4. 在Edge Runtime中，return null 可能产生204 No Content"
    echo ""
    
    log_info "💡 可能解决方案:"
    echo "   方案1: 修改Vercel重写规则，精确匹配认证路径"
    echo "   方案2: 在Edge Runtime中使用正确的转发机制"
    echo "   方案3: 返回适当的HTTP响应而不是null"
    echo "   方案4: 使用Edge Runtime兼容的响应格式"
    echo ""
    
    log_info "🔍 需要验证:"
    echo "   - Vercel重写规则的实际行为"
    echo "   - Edge Runtime中null返回的具体行为"
    echo "   - 正确的请求转发机制"
    echo ""
}

# 主流程
main() {
    echo "🔍 NextAuth 204 No Content 问题系统性分析"
    echo "==========================================="
    echo ""
    
    analyze_architecture
    echo ""
    
    analyze_routing_logic
    echo ""
    
    analyze_edge_runtime
    echo ""
    
    create_test_environment
    echo ""
    
    analyze_solutions
    echo ""
    
    echo "==========================================="
    log_info "分析完成！准备实施解决方案..."
}

# 运行分析
main "$@" || {
    log_error "分析过程失败"
    exit 1
}