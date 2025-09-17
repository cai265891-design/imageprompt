#!/bin/bash
# 验证部署是否成功

DEPLOY_URL="${1:-https://show.saasfly.io}"

echo "验证部署: $DEPLOY_URL"
echo "---"

# 测试主页
echo -n "测试主页... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/")
if [ "$STATUS" = "200" ] || [ "$STATUS" = "308" ] || [ "$STATUS" = "307" ]; then
    echo "✅ OK ($STATUS)"
else
    echo "❌ 失败 ($STATUS)"
fi

# 测试 image-prompt 页面
echo -n "测试 /zh/image-prompt... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/zh/image-prompt")
if [ "$STATUS" = "200" ]; then
    echo "✅ OK ($STATUS)"
else
    echo "❌ 失败 ($STATUS)"
fi

# 测试 favicon
echo -n "测试 /favicon.ico... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/favicon.ico")
if [ "$STATUS" = "200" ] || [ "$STATUS" = "304" ]; then
    echo "✅ OK ($STATUS)"
else
    echo "❌ 失败 ($STATUS)"
fi
