# Clerk Webhook 配置指南

## 配置步骤

### 1. 获取 Webhook Secret

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com)
2. 选择你的应用
3. 进入 **Webhooks** 部分
4. 点击 **Add Endpoint**

### 2. 配置 Webhook 端点

在 Clerk Dashboard 中配置以下信息：

- **Endpoint URL**:
  - 本地开发: `https://[your-ngrok-url]/api/webhooks/clerk`
  - 生产环境: `https://your-domain.com/api/webhooks/clerk`

- **Events to listen**: 选择以下事件
  - `user.created`
  - `user.updated`
  - `user.deleted`

### 3. 获取 Webhook Secret

创建端点后，Clerk 会生成一个 Signing Secret。复制这个密钥。

### 4. 配置环境变量

在 `.env.local` 文件中添加：

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

在 Vercel 中也需要添加这个环境变量。

### 5. 本地测试（可选）

使用 ngrok 或类似工具来测试本地 webhook：

```bash
# 安装 ngrok
brew install ngrok

# 暴露本地端口
ngrok http 3000

# 将生成的 URL 配置到 Clerk Dashboard
```

## 验证 Webhook 工作

1. 注册新用户
2. 检查数据库中的 `User` 表，应该看到新创建的用户记录
3. 检查 `Customer` 表，应该看到对应的客户记录

## 数据同步说明

当以下事件发生时，数据会自动同步：

- **用户注册** (`user.created`): 在 User 表和 Customer 表中创建记录
- **用户更新** (`user.updated`): 更新 User 表中的用户信息
- **用户删除** (`user.deleted`): 删除 User 表和 Customer 表中的记录

## 故障排除

### 常见问题

1. **Webhook 验证失败**: 确保 `CLERK_WEBHOOK_SECRET` 配置正确
2. **数据库错误**: 确保数据库连接正常，并且已运行 `bun db:push`
3. **用户 ID 不匹配**: Webhook 使用 Clerk 的用户 ID 作为数据库主键

### 日志查看

- 本地开发: 查看控制台输出
- Vercel: 在 Vercel Dashboard 的 Functions 日志中查看

## 重要提示

- Webhook Secret 是敏感信息，请勿提交到版本控制系统
- 生产环境必须使用 HTTPS
- 建议设置重试策略以处理临时失败