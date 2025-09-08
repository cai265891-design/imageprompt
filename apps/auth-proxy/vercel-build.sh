#!/bin/bash
# 强制 Vercel 识别为非 Next.js 项目的构建脚本

echo "🚀 Building auth-proxy with Nitro..."
echo "🔧 Framework: Nitro (not Next.js)"
echo "📁 Build directory: $(pwd)"
echo "🎯 Build command: nitropack build"

# 执行 Nitro 构建
bun run nitropack build

# 验证构建输出
if [ -d ".vercel/output" ]; then
    echo "✅ Nitro build completed successfully"
    echo "📊 Output structure:"
    ls -la .vercel/output/
else
    echo "❌ Build failed - no output directory found"
    exit 1
fi

# 确保没有 .next 目录
if [ -d ".next" ]; then
    echo "⚠️  Warning: .next directory found, removing..."
    rm -rf .next
fi

echo "🎉 Build process completed"