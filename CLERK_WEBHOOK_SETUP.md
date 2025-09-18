# Clerk Webhook 配置指南

## 🚀 快速开始（生产环境）

如果你只需要在 Vercel 生产环境配置 webhook，按以下步骤操作：

### 1. 登录 Clerk Dashboard
访问 [Clerk Dashboard](https://dashboard.clerk.com) → 选择你的应用 → **Webhooks** → **Add Endpoint**

### 2. 配置 Webhook URL
填写你的生产环境 URL：
```
https://你的项目名.vercel.app/api/webhooks/clerk
```

**如何找到你的 Vercel 域名？**
- 登录 Vercel Dashboard
- 找到你的项目
- 域名通常是：`项目名.vercel.app`

**示例**：
- 如果项目名是 `saasfly`
- Webhook URL 就是：`https://saasfly.vercel.app/api/webhooks/clerk`

### 3. 选择监听事件
勾选以下三个事件：
- ✅ `user.created` - 用户注册时触发
- ✅ `user.updated` - 用户信息更新时触发
- ✅ `user.deleted` - 用户删除账号时触发

### 4. 保存并获取 Secret
点击创建后，Clerk 会显示一个 **Signing Secret**（格式：`whsec_xxxxxxxxxxxxx`）

### 5. 配置 Vercel 环境变量
1. 登录 [Vercel Dashboard](https://vercel.com)
2. 进入你的项目 → Settings → Environment Variables
3. 添加新变量：
   - **Name**: `CLERK_WEBHOOK_SECRET`
   - **Value**: `whsec_xxxxxxxxxxxxx`（粘贴刚才复制的 Secret）
   - **Environment**: 选择 Production

4. 重新部署项目让环境变量生效

---

## 💻 本地开发配置（可选）

本地测试 webhook 需要使用 ngrok 创建公网隧道：

### 1. 安装 ngrok
```bash
# macOS
brew install ngrok

# 或从官网下载
# https://ngrok.com/download
```

### 2. 启动本地服务
```bash
# 启动 Next.js 开发服务器
bun run dev:web
```

### 3. 创建公网隧道
在新终端运行：
```bash
ngrok http 3000
```

你会看到类似输出：
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

### 4. 配置本地 Webhook
1. 在 Clerk Dashboard 创建新的 webhook 端点
2. 使用 ngrok 生成的 URL：
   ```
   https://abc123.ngrok.io/api/webhooks/clerk
   ```

### 5. 添加本地环境变量
在 `.env.local` 添加：
```env
CLERK_WEBHOOK_SECRET=whsec_本地测试用的secret
```

**注意**：
- ngrok 免费版每次重启地址会变化
- 仅用于开发测试，生产环境使用固定域名

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

## ❓ 常见问题

### 不配置 Webhook 会怎样？
- 用户可以正常登录，但数据不会同步到你的数据库
- 你在 Neon 数据库的 User 表中看不到用户记录
- 订阅、计费等依赖本地用户数据的功能可能无法正常工作

### 如何确认 Webhook 配置成功？
1. 在 Clerk Dashboard 的 Webhooks 页面可以看到请求日志
2. 成功的请求会显示 ✅ 200 状态码
3. 失败的请求会显示 ❌ 错误状态

### 生产环境和本地能同时配置吗？
- 可以！你可以在 Clerk Dashboard 创建多个 webhook 端点
- 一个指向生产环境，一个指向本地 ngrok
- 它们可以使用不同的 Signing Secret

## 重要提示

- Webhook Secret 是敏感信息，请勿提交到版本控制系统
- 生产环境必须使用 HTTPS
- 建议设置重试策略以处理临时失败
- 如果只是想看登录功能，可以暂时不配置 webhook