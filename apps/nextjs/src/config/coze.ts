export const cozeConfig = {
  apiToken: 'pat_fKtY25pAt8bDeHh5q9iohIQXa1S6JXFOVLReM6ocOGy07KTQKanRbtlkSSX03i8k',
  workflowId: '7547603449249251363', // 正确的工作流ID
  appId: '7547566751303811111', // App ID
  apiBaseUrl: 'https://api.coze.cn',
  
  // Required for file upload API
  purpose: 'workflow',
  
  // Model mapping for workflow parameters - 映射到Curl中的promptType
  modelMapping: {
    'general': 'normal',
    'flux': 'flux', 
    'midjourney': 'midjourney',
    'stable-diffusion': 'stableDiffusion'
  } as Record<string, string>
};