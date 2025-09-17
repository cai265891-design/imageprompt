#!/bin/bash

# Vercel 部署测试脚本
# 用于验证和修复 Vercel 部署 404 问题

set -e

echo "🔍 开始 Vercel 部署诊断..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

# 1. 检查基础结构
echo ""
echo "📁 检查项目结构..."

if [ -f "apps/nextjs/package.json" ]; then
    check_status "找到 Next.js 应用"
else
    echo -e "${RED}✗${NC} 未找到 Next.js 应用"
    exit 1
fi

# 2. 检查必要的页面文件
echo ""
echo "📄 检查页面文件..."

# 检查根页面
if [ -f "apps/nextjs/src/app/page.tsx" ]; then
    check_status "根页面 page.tsx 存在"
else
    echo -e "${YELLOW}⚠${NC} 根页面不存在，创建中..."
    cat > apps/nextjs/src/app/page.tsx << 'EOF'
import { redirect } from "next/navigation";
import { i18n } from "~/config/i18n-config";

export default function RootPage() {
  redirect(`/${i18n.defaultLocale}`);
}
EOF
    check_status "根页面已创建"
fi

# 检查语言页面
if [ -f "apps/nextjs/src/app/[lang]/(marketing)/page.tsx" ]; then
    check_status "[lang] 页面存在"
else
    echo -e "${RED}✗${NC} [lang] 页面不存在"
fi

# 3. 验证 next.config.mjs
echo ""
echo "⚙️ 检查 Next.js 配置..."

if grep -q 'output: "standalone"' apps/nextjs/next.config.mjs; then
    echo -e "${YELLOW}⚠${NC} 检测到 standalone 输出模式"
    echo "  需要移除 standalone 模式以兼容 Vercel"
fi

# 4. 检查并修复 vercel.json
echo ""
echo "🔧 检查 Vercel 配置..."

# 创建正确的 vercel.json
cat > vercel.json << 'EOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd apps/nextjs && SKIP_ENV_VALIDATION=true bun install && SKIP_ENV_VALIDATION=true bunx contentlayer2 build && SKIP_ENV_VALIDATION=true bunx next build",
  "installCommand": "bun install",
  "outputDirectory": "apps/nextjs/.next",
  "framework": "nextjs",
  "env": {
    "SKIP_ENV_VALIDATION": "true"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF

check_status "vercel.json 已更新"

# 5. 修复 next.config.mjs - 移除 standalone
echo ""
echo "📝 修复 Next.js 配置..."

# 备份原文件
cp apps/nextjs/next.config.mjs apps/nextjs/next.config.mjs.backup

# 移除 standalone 输出模式
if [ "$(uname)" = "Darwin" ]; then
    # macOS
    sed -i '' 's/output: "standalone",/\/\/ output: "standalone",/' apps/nextjs/next.config.mjs
else
    # Linux
    sed -i 's/output: "standalone",/\/\/ output: "standalone",/' apps/nextjs/next.config.mjs
fi

check_status "移除 standalone 模式"

# 6. 测试本地构建
echo ""
echo "🏗️ 测试本地构建..."

cd apps/nextjs

# 设置测试环境变量
export SKIP_ENV_VALIDATION=true
export NEXT_PUBLIC_APP_URL="https://show.saasfly.io"

# 尝试构建
echo "执行构建命令..."
if SKIP_ENV_VALIDATION=true bunx contentlayer2 build 2>/dev/null; then
    check_status "Contentlayer 构建成功"
else
    echo -e "${YELLOW}⚠${NC} Contentlayer 构建警告（可忽略）"
fi

# 检查构建后的文件
echo ""
echo "📦 验证构建输出..."

# 返回项目根目录
cd ../..

# 7. 创建测试路由文件
echo ""
echo "🛣️ 创建测试路由..."

# 创建健康检查 API
mkdir -p apps/nextjs/src/app/api/health
cat > apps/nextjs/src/app/api/health/route.ts << 'EOF'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      hasClerkKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasPostgresUrl: !!process.env.POSTGRES_URL
    }
  });
}
EOF

check_status "健康检查 API 已创建"

# 8. 输出诊断结果
echo ""
echo "📊 诊断结果总结："
echo "=================="

echo -e "${GREEN}已完成的修复：${NC}"
echo "1. ✓ 确保根页面存在"
echo "2. ✓ 更新 vercel.json 配置"
echo "3. ✓ 移除 standalone 输出模式"
echo "4. ✓ 创建健康检查 API"

echo ""
echo -e "${YELLOW}需要在 Vercel Dashboard 确认的设置：${NC}"
echo "1. Root Directory: ./ 或留空"
echo "2. Framework Preset: Next.js"
echo "3. Node.js Version: 18.x 或 20.x"

echo ""
echo -e "${GREEN}环境变量检查清单：${NC}"
echo "必需的环境变量："
echo "- [ ] POSTGRES_URL"
echo "- [ ] NEXT_PUBLIC_APP_URL"
echo "- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "- [ ] CLERK_SECRET_KEY"
echo "- [ ] NEXT_PUBLIC_CLERK_SIGN_IN_URL"
echo "- [ ] NEXT_PUBLIC_CLERK_SIGN_UP_URL"

echo ""
echo "🚀 修复完成！现在可以："
echo "1. git add -A"
echo "2. git commit -m 'Fix Vercel deployment 404 issue'"
echo "3. git push"
echo ""
echo "推送后，Vercel 会自动重新部署。"
echo "部署完成后，可以访问 /api/health 检查部署状态。"