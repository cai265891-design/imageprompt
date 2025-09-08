# Auth-Proxy Vercel 部署修复指南

## 🚨 问题诊断
Vercel 持续将 auth-proxy 错误识别为 Next.js 项目，导致寻找 `.next/routes-manifest.json` 文件失败。

## 🔧 已实施的修复措施

### 1. 强制构建配置 (`vercel.json`)
```json
{
  "buildCommand": "./vercel-build.sh",
  "outputDirectory": ".vercel/output", 
  "framework": null,
  "installCommand": "bun install",
  "version": 2
}
```

### 2. 自定义构建脚本 (`vercel-build.sh`)
- ✅ 明确声明使用 Nitro 框架
- ✅ 清理潜在的 .next 目录
- ✅ 验证正确的输出结构

### 3. 代码级 Edge Runtime 声明
```typescript
export const runtime = 'edge';
export const preferredRegion = ['iad1', 'hnd1'];
```

### 4. Node.js 版本锁定
```json
{
  "engines": {
    "node": "20.x"
  }
}
```

## 🚀 Vercel 控制台配置步骤

### 方法 A: 重新创建项目（推荐）
1. 删除现有的 auth-proxy Vercel 项目
2. 创建新项目 → 选择相同仓库
3. **关键设置**：
   - Root Directory: `apps/auth-proxy`
   - Framework: **选择 "Other"** （不要选 Next.js）
   - Build Command: `./vercel-build.sh`
   - Install Command: `bun install`
   - Output Directory: `.vercel/output`

### 方法 B: 修改现有项目
1. 进入 Vercel 项目设置
2. General → Root Directory: `apps/auth-proxy`
3. Build Settings → Framework: **选择 "Other"**
4. Build Command: `./vercel-build.sh`
5. Install Command: `bun install`
6. Output Directory: `.vercel/output`

## ✅ 验证标准
部署成功后应该：
- 不再出现 `.next/routes-manifest.json` 错误
- 构建输出在 `.vercel/output/` 目录
- 函数正确识别为 Edge Runtime
- 控制台显示 Framework 为 "Other" 或空

## 🎯 关键成功因素
1. **Framework 必须设为 "Other"** - 这是最关键的一步
2. **使用自定义构建脚本** - 确保 Vercel 了解这不是 Next.js
3. **正确的输出目录** - `.vercel/output` 而不是 `.next`

## 📋 下一步操作
1. 在 Vercel 控制台应用上述配置
2. 重新部署项目
3. 验证部署日志中是否还有 Next.js 相关错误