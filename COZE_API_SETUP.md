# Coze API 配置指南

## 问题诊断

当前错误：`Workflow execution failed: Workflow not found. Please verify the workflow exist`

这个错误表明工作流ID不正确或工作流未发布。

## 获取正确的配置信息

### 1. 获取工作流ID (workflow_id)

1. 登录 [Coze平台](https://www.coze.cn)
2. 进入「工作流」页面
3. 找到你的图片提示词生成工作流
4. 点击进入工作流编辑页面
5. 查看浏览器地址栏，格式如：
   ```
   https://www.coze.cn/work_flow?space_id=xxx&workflow_id=yyy
   ```
6. 复制 `workflow_id=yyy` 中的 `yyy` 部分

**重要**：确保工作流已发布！未发布的工作流无法通过API调用。

### 2. 获取机器人ID (bot_id)

1. 登录 [Coze平台](https://www.coze.cn)
2. 进入「机器人」页面  
3. 找到关联该工作流的机器人
4. 点击进入机器人编辑页面
5. 查看浏览器地址栏，格式如：
   ```
   https://www.coze.cn/space/{space_id}/bot/{bot_id}
   ```
6. 复制 `{bot_id}` 部分的数字

**重要**：确保机器人已发布为API服务！

### 3. 配置更新

将获取到的正确ID更新到配置文件：`apps/nextjs/src/config/coze.ts`

```typescript
export const cozeConfig = {
  apiToken: 'pat_fKtY25pAt8bDeHh5q9iohIQXa1S6JXFOVLReM6ocOGy07KTQKanRbtlkSSX03i8k',
  workflowId: '你的实际工作流ID', // 替换这里
  apiBaseUrl: 'https://api.coze.cn',
  
  // Required for file upload API
  botId: '你的实际机器人ID', // 替换这里
  purpose: 'workflow',
  
  // Model mapping for workflow parameters
  modelMapping: {
    'general': 'normal',
    'flux': 'flux', 
    'midjourney': 'midjouney',
    'stable-diffusion': 'stableDiffusion'
  } as Record<string, string>
};
```

## 验证步骤

1. 确保工作流包含以下输入参数：
   - `image` (图片类型)
   - `model` (字符串类型，值为 normal/flux/midjourney/stableDiffusion)
   - `language` (字符串类型，值为 en/zh/ja/ko/es/fr/de)

2. 确保工作流已发布

3. 确保机器人已发布且启用了API服务

4. 检查浏览器控制台获取详细的调试信息

## 常见问题

### Q: 工作流ID看起来是正确的，但仍然报404错误
A: 请确认：
- 工作流确实已发布
- 工作流属于正确的空间
- API令牌有权限访问该工作流

### Q: 如何确认工作流已发布？
A: 在Coze平台中，已发布的工作流会显示"已发布"状态，且可以通过API调用。

### Q: 机器人必须关联工作流吗？
A: 是的，调用工作流API时需要指定bot_id，机器人应该关联了要使用的工作流。

### Q: 文件上传成功了，但工作流执行失败
A: 这通常表明工作流ID或bot_id不正确，或者工作流参数格式不匹配。

## 调试信息

在浏览器控制台中可以查看详细的API调用日志，包括：
- 上传的文件信息
- 工作流ID和机器人ID
- API请求参数
- 完整的错误响应