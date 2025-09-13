import { cozeConfig } from '../config/coze';

interface UploadFileResponse {
  code: number;
  msg: string;
  data: {
    id: string;
    file_name: string;
    bytes: number;
    created_at: number;
  };
}

interface WorkflowResponse {
  code: number;
  msg: string;
  data: string | object; // Can be either string or object depending on response
  debug_url?: string;
  execute_id?: string;
  usage?: any;
}

export class CozeAPI {
  private baseUrl = cozeConfig.apiBaseUrl;
  private token = cozeConfig.apiToken;

  /**
   * Upload file to Coze platform
   */
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', cozeConfig.purpose);

    try {
      const response = await fetch(`${this.baseUrl}/v1/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result: UploadFileResponse = await response.json();
      
      if (result.code !== 0) {
        throw new Error(`Upload failed: ${result.msg}`);
      }

      return result.data.id;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  /**
   * Generate image prompt from file - Updated to use direct file ID approach
   * Instead of generating signed URLs, use file ID directly in workflow parameters
   */
  async generateImagePrompt(
    file: File, 
    model: string, 
    language: string
  ): Promise<string> {
    try {
      console.log('=== Starting image prompt generation ===');
      console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
      console.log('Model:', model, 'Language:', language);
      console.log('Config - Workflow ID:', cozeConfig.workflowId, 'App ID:', cozeConfig.appId);
      
      // Step 1: Upload file to Coze
      console.log('Step 1: Uploading file to Coze...');
      const fileId = await this.uploadFile(file);
      console.log('File uploaded successfully, file ID:', fileId);
      
      // Step 2: Run workflow with file ID directly (no signed URL needed)
      console.log('Step 2: Running workflow with file ID...');
      const prompt = await this.runWorkflowWithFileId(fileId, model, language);
      console.log('Workflow completed successfully');
      
      return prompt;
    } catch (error) {
      console.error('Generate image prompt error:', error);
      
      // 提供更详细的错误信息
      if (error instanceof Error) {
        if (error.message.includes('Workflow not found')) {
          throw new Error(`工作流未找到。请确保：
1. 工作流ID正确：当前使用的是 ${cozeConfig.workflowId}
2. 工作流已发布
3. App ID正确：当前使用的是 ${cozeConfig.appId}
4. 查看配置指南：/COZE_API_SETUP.md

原始错误：${error.message}`);
        } else if (error.message.includes('App not found')) {
          throw new Error(`应用未找到。请确保：
1. App ID正确：当前使用的是 ${cozeConfig.appId}
2. 应用已发布
3. 查看配置指南：/COZE_API_SETUP.md

原始错误：${error.message}`);
        }
      }
      
      throw error;
    }
  }

  /**
   * Run workflow with file ID directly - Alternative approach using file_id
   * This avoids the need for signed URLs
   * Tries multiple parameter formats to find the correct one
   */
  async runWorkflowWithFileId(
    fileId: string, 
    model: string, 
    language: string
  ): Promise<string> {
    // Try different parameter formats to find the correct one
    const formats = [
      {
        name: 'Format 1: Direct file_id',
        params: {
          file_id: fileId,
          promptType: model,
          userQuery: this.getUserQuery(language)
        }
      },
      {
        name: 'Format 2: JSON wrapped file_id as img',
        params: {
          img: JSON.stringify({ file_id: fileId }),
          promptType: model,
          userQuery: this.getUserQuery(language)
        }
      },
      {
        name: 'Format 3: Simple image object',
        params: {
          image: { file_id: fileId },
          model: model,
          language: language,
          userQuery: this.getUserQuery(language)
        }
      }
    ];

    for (const format of formats) {
      try {
        console.log(`Trying ${format.name}...`);
        const result = await this.tryWorkflowWithParams(format.params, model, language);
        console.log(`Success with ${format.name}!`);
        return result;
      } catch (error) {
        console.log(`Failed with ${format.name}:`, error instanceof Error ? error.message : error);
        if (format === formats[formats.length - 1]) {
          throw error; // If all formats failed, throw the last error
        }
      }
    }

    throw new Error('All parameter formats failed');
  }

  private getUserQuery(language: string): string {
    const userQueryMap = {
      'en': 'Please describe this image',
      'zh': '请描述一下这张图片',
      'ja': 'この画像を説明してください',
      'ko': '이 이미지를 설명해 주세요',
      'es': 'Por favor describe esta imagen',
      'fr': 'Veuillez décrire cette image',
      'de': 'Bitte beschreibe dieses Bild'
    };
    return userQueryMap[language as keyof typeof userQueryMap] || userQueryMap['en'];
  }

  private async tryWorkflowWithParams(parameters: any, model: string, language: string): Promise<string> {
    const requestParams = {
      workflow_id: cozeConfig.workflowId,
      app_id: cozeConfig.appId,
      parameters: JSON.stringify(parameters)
    };

    console.log('=== Workflow Request Debug Info ===');
    console.log('Parameters:', parameters);
    console.log('Request body:', JSON.stringify(requestParams, null, 2));
    console.log('=====================================');

    const response = await fetch(`${this.baseUrl}/v1/workflow/stream_run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestParams),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Workflow execution failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Get the raw response text first (for SSE format)
    const responseText = await response.text();
    console.log('Raw workflow response:', responseText);
    
    // Parse Server-Sent Events (SSE) format
    const lines = responseText.trim().split('\n');
    const events: Array<{id?: string, event?: string, data?: any}> = [];
    let currentEvent: {id?: string, event?: string, data?: any} = {};
    
    for (const line of lines) {
      if (line.startsWith('id: ')) {
        if (Object.keys(currentEvent).length > 0) {
          events.push(currentEvent);
        }
        currentEvent = { id: line.substring(4) };
      } else if (line.startsWith('event: ')) {
        currentEvent.event = line.substring(7);
      } else if (line.startsWith('data: ')) {
        const dataContent = line.substring(6);
        try {
          currentEvent.data = JSON.parse(dataContent);
        } catch (e) {
          currentEvent.data = dataContent;
        }
      }
    }
    
    if (Object.keys(currentEvent).length > 0) {
      events.push(currentEvent);
    }
    
    console.log('Parsed SSE events:', events);
    
    // Look for events with data
    const dataEvents = events.filter(e => e.data);
    
    if (dataEvents.length === 0) {
      throw new Error(`No data found in SSE response: ${responseText}`);
    }
    
    // Check for error events first
    const errorEvent = events.find(e => e.event === 'Error');
    if (errorEvent && errorEvent.data) {
      const errorData = typeof errorEvent.data === 'string' ? JSON.parse(errorEvent.data) : errorEvent.data;
      throw new Error(`Workflow execution failed: ${errorData.error_message || 'Unknown error'}`);
    }
    
    // Look for Message event (contains the actual result)
    const messageEvent = events.find(e => e.event === 'Message');
    if (messageEvent && messageEvent.data) {
      const messageData = messageEvent.data;
      console.log('Message event data:', messageData);
      
      // Check if content field exists and contains JSON string
      if (messageData.content) {
        try {
          const contentData = JSON.parse(messageData.content);
          console.log('Parsed content data:', contentData);
          
          if (contentData.output) {
            return contentData.output;
          }
        } catch (e) {
          console.log('Failed to parse content as JSON, using as-is:', messageData.content);
          return messageData.content;
        }
      }
      
      // Fallback: return the entire message data
      return JSON.stringify(messageData);
    }
    
    // Use the last event with data as fallback
    const lastDataEvent = dataEvents[dataEvents.length - 1];
    if (lastDataEvent) {
      const responseData = lastDataEvent.data;
      
      // Handle different data formats
      if (typeof responseData === 'string') {
        try {
          const parsed = JSON.parse(responseData);
          console.log('Parsed string data as JSON:', parsed);
          return parsed.output || parsed.result || parsed.prompt || parsed.text || JSON.stringify(parsed);
        } catch (e) {
          console.log('Result data is plain string, returning as-is:', responseData);
          return responseData;
        }
      } else if (typeof responseData === 'object' && responseData !== null) {
        console.log('Result data is object:', responseData);
        return responseData.output || responseData.result || responseData.prompt || responseData.text || JSON.stringify(responseData);
      } else if (responseData !== undefined) {
        console.log('Result data is of type:', typeof responseData, responseData);
        return String(responseData);
      } else {
        throw new Error(`No valid data found in response: ${responseText}`);
      }
    } else {
      throw new Error(`No data events found in response: ${responseText}`);
    }
  }
}

export const cozeAPI = new CozeAPI();