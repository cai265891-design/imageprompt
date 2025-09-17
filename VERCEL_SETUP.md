# Vercel Dashboard 设置指南

## 重要：请在 Vercel Dashboard 中按照以下设置配置项目

### 1. General Settings（常规设置）

进入项目设置页面：Settings → General

#### Build & Development Settings（构建和开发设置）

**Framework Preset（框架预设）:**
```
Other
```

**Root Directory（根目录）:**
```
留空 或 ./
```
⚠️ **重要**: 不要设置为 `apps/nextjs`，保持为根目录

**Build Command（构建命令）:**
```
bun install && bun run build
```

**Output Directory（输出目录）:**
```
apps/nextjs/.next
```

**Install Command（安装命令）:**
```
echo 'Skip install - handled by buildCommand'
```

### 2. Environment Variables（环境变量）

确保设置了以下必需的环境变量：

#### 必需变量
- `POSTGRES_URL` - PostgreSQL 数据库连接字符串
- `NEXT_PUBLIC_APP_URL` - 应用的公开 URL（如 https://your-app.vercel.app）

#### Clerk 认证（必需）
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk 公开密钥
- `CLERK_SECRET_KEY` - Clerk 私密密钥
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - 设置为 `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - 设置为 `/sign-up`

#### 可选变量
- `STRIPE_API_KEY` - Stripe API 密钥（支付功能）
- `STRIPE_WEBHOOK_SECRET` - Stripe Webhook 密钥
- `RESEND_API_KEY` - Resend 邮件服务密钥
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog 分析密钥

### 3. Node.js Version（Node.js 版本）

Settings → General → Node.js Version
```
20.x (推荐) 或 18.x
```

### 4. 验证检查清单

部署前请确认：

- [ ] Root Directory 设置为空或 `./`
- [ ] Framework Preset 设置为 `Other`
- [ ] Build Command 包含 `bun install`
- [ ] Output Directory 设置为 `apps/nextjs/.next`
- [ ] 所有必需的环境变量已设置
- [ ] Node.js 版本为 18.x 或 20.x

### 5. 重新部署

完成以上设置后：

1. 在 Vercel Dashboard 中点击 "Redeploy"
2. 选择 "Redeploy with existing Build Cache" 或 "Redeploy without Cache"
3. 监控构建日志，确保没有错误

### 6. 常见问题

**如果仍然出现 "Bun could not find package.json" 错误：**

1. 确保 Root Directory 为空或 `./`
2. 清除构建缓存并重新部署
3. 检查是否有旧的项目设置缓存

**如果出现权限错误：**

1. 确保所有环境变量都已正确设置
2. 检查 Clerk 配置是否正确

### 7. 验证部署

部署成功后，访问以下页面验证：

- 主页：`https://your-app.vercel.app`
- 公开页面：`https://your-app.vercel.app/zh/image-prompt`
- API 健康检查：`https://your-app.vercel.app/api/trpc/edge/health`

---

⚠️ **注意**: 这些设置会覆盖 `vercel.json` 中的部分配置，请确保 Dashboard 设置与此文档一致。