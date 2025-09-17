# Vercel 环境变量配置

## 必须在 Vercel Dashboard 中设置的环境变量

登录 Vercel Dashboard → 选择您的项目 → Settings → Environment Variables

### 1. 必需的环境变量（复制以下内容）

#### 应用 URL（必需）
```
NEXT_PUBLIC_APP_URL = https://show.saasfly.io
```
或者使用您的实际域名，如：`https://your-app.vercel.app`

#### 数据库（必需）
```
POSTGRES_URL = postgresql://neondb_owner:npg_9m4RjIrEXKqC@ep-orange-smoke-adv2gq47-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

⚠️ **注意**: 变量名是 `POSTGRES_URL` 而不是 `DATABASE_URL`

#### Clerk 认证（必需）
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_aHVtYmxlLXRyb2xsLTMxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY = sk_test_OAN95uptydywkDryIwcUbV8H4ptF4zJ2XaGMpOrLpb
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
```

### 2. 可选的环境变量

#### Clerk 额外配置（可选）
```
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /dashboard
```

#### 邮件服务（可选）
```
RESEND_API_KEY = your-resend-api-key
RESEND_FROM = noreply@yourdomain.com
```

#### Stripe 支付（可选）
```
STRIPE_API_KEY = your-stripe-api-key
STRIPE_WEBHOOK_SECRET = your-stripe-webhook-secret
```

#### 分析服务（可选）
```
NEXT_PUBLIC_POSTHOG_KEY = your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST = https://app.posthog.com
```

### 3. 设置步骤

1. **进入环境变量页面**
   - 打开 Vercel Dashboard
   - 选择您的项目
   - 点击 "Settings" 标签
   - 在左侧菜单选择 "Environment Variables"

2. **添加环境变量**
   - 点击 "Add New" 按钮
   - 输入 "Key"（变量名）
   - 输入 "Value"（变量值）
   - 选择环境：全部勾选（Production, Preview, Development）
   - 点击 "Save"

3. **必须添加的变量**（按顺序添加）:
   - ✅ `NEXT_PUBLIC_APP_URL`
   - ✅ `POSTGRES_URL`
   - ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - ✅ `CLERK_SECRET_KEY`
   - ✅ `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   - ✅ `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

### 4. 重新部署

完成环境变量设置后：

1. 返回项目主页
2. 点击 "Redeploy" 按钮
3. 选择 "Redeploy with existing Build Cache"
4. 等待部署完成

### 5. 验证清单

部署前确认：
- [ ] 所有必需的环境变量已添加
- [ ] `NEXT_PUBLIC_APP_URL` 使用了正确的域名
- [ ] `POSTGRES_URL` 而不是 `DATABASE_URL`
- [ ] Clerk 密钥正确设置
- [ ] 所有环境变量应用于 Production 环境

### 6. 常见问题

**Q: 仍然出现 "Invalid environment variables" 错误？**
- 确保变量名完全正确，注意大小写
- 确保没有多余的空格
- 确保值没有被引号包围（Vercel 会自动处理）

**Q: 数据库连接失败？**
- 确保使用 `POSTGRES_URL` 而不是 `DATABASE_URL`
- 检查数据库连接字符串是否完整

**Q: Clerk 认证不工作？**
- 确保所有 Clerk 变量都已设置
- 检查 Clerk Dashboard 中的域名配置

---

⚠️ **安全提示**: 不要在代码中硬编码这些密钥，始终使用环境变量！