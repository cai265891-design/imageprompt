# Auth-Proxy Vercel 部署配置指南

## 问题
Vercel 错误地将 auth-proxy 识别为 Next.js 应用，导致寻找 `.next/routes-manifest.json` 文件失败。

## 解决方案

### 方法 1: 重新创建 Vercel 项目（推荐）

1. **删除现有的 auth-proxy Vercel 项目**
   - 登录 Vercel 控制台
   - 找到 auth-proxy 项目并删除

2. **重新创建项目并正确配置**
   - 点击 "New Project"
   - 选择相同的 GitHub 仓库
   - **重要：** 在 "Root Directory" 中选择 `apps/auth-proxy`
   - **重要：** Framework 选择 "Other" 或让 Vercel 自动检测
   - Build Command: `bun run build`
   - Output Directory: `.vercel/output` (自动检测)

3. **配置环境变量**
   - AUTH_SECRET
   - AUTH_REDIRECT_PROXY_URL
   - GITHUB_CLIENT_ID
   - GITHUB_CLIENT_SECRET

### 方法 2: 修改现有项目配置

如果不能重新创建项目，尝试：

1. **进入项目设置**
   - General → Root Directory → 设置为 `apps/auth-proxy`
   - Build & Development Settings → Framework → 选择 "Other"
   - Build Command → `bun run build`

2. **高级设置**
   - Ignored Build Step: 设置为检查 auth-proxy 目录是否有变更

## 关键配置点

- **Root Directory**: 必须设置为 `apps/auth-proxy`
- **Framework**: 不能是 Next.js，应该是 "Other" 或自动检测
- **Build Output**: Nitro 会自动输出到 `.vercel/output`

## 验证部署

部署成功后应该看到：
- 构建输出在 `.vercel/output/`
- 不再寻找 `.next/routes-manifest.json`
- 函数正确部署为边缘函数或 Node.js 函数