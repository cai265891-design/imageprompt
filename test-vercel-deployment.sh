#!/bin/bash
# 测试 Vercel 部署

echo "=== Vercel 部署前检查清单 ==="
echo ""

# 检查必需文件
echo "✅ 检查必需文件:"
[ -f "package.json" ] && echo "  ✓ package.json" || echo "  ✗ package.json 缺失"
[ -f "bun.lockb" ] && echo "  ✓ bun.lockb" || echo "  ✗ bun.lockb 缺失"
[ -f "vercel.json" ] && echo "  ✓ vercel.json" || echo "  ✗ vercel.json 缺失"
[ -f "turbo.json" ] && echo "  ✓ turbo.json" || echo "  ✗ turbo.json 缺失"

echo ""
echo "✅ 检查工作区:"
for dir in apps/* packages/*; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo "  ✓ $dir"
    fi
done

echo ""
echo "✅ 检查构建命令:"
echo "  Install: bun install"
echo "  Build: bun run build"

echo ""
echo "✅ 检查环境变量需求:"
echo "  必需: POSTGRES_URL, NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_CLERK_*"
echo ""

echo "=== 检查完成 ==="
