# 同步已存在用户到数据库

## 问题说明
如果你在配置 Webhook 之前就已经注册了账号，那么数据库中不会有你的用户记录。这是因为 Webhook 只处理配置后的新事件。

## 解决方案

### 方案 1：手动同步当前用户（最简单）

1. **确保已登录**你的应用

2. **在浏览器中访问同步 API**：
   ```
   http://localhost:3000/api/sync-current-user
   ```

   或者在生产环境：
   ```
   https://你的域名.vercel.app/api/sync-current-user
   ```

3. **查看响应**，你应该看到：
   ```json
   {
     "success": true,
     "message": "用户已同步到数据库，Customer 记录已创建",
     "user": {
       "id": "user_xxx",
       "email": "your-email@example.com",
       "name": "Your Name"
     }
   }
   ```

4. **验证数据库**：
   检查 Neon 数据库，现在应该能看到你的用户记录了。

### 方案 2：批量同步所有用户（管理员使用）

运行同步脚本：
```bash
bun run scripts/sync-existing-users.ts
```

这会同步所有 Clerk 用户到数据库。

### 方案 3：触发更新事件

在 Clerk Dashboard 中更新你的用户信息（比如修改名字），这会触发 `user.updated` 事件，现在的 webhook 会自动创建缺失的用户记录。

## 工作原理

我们改进了 Webhook 处理逻辑：
- `user.updated` 事件现在也会检查用户是否存在
- 如果用户不存在，会创建新记录
- 同时确保 Customer 表也有对应记录

## 验证同步成功

在 Neon 数据库中执行：
```sql
-- 查看最近添加的用户
SELECT * FROM "User"
ORDER BY "emailVerified" DESC
LIMIT 5;

-- 查看 Customer 记录
SELECT * FROM "Customer"
ORDER BY "createdAt" DESC
LIMIT 5;
```

## 注意事项

- 同步 API 需要用户已登录
- 每个用户只需要同步一次
- 之后的更新会通过 Webhook 自动处理