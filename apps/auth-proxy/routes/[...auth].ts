import { Auth } from "@auth/core";
import GitHub from "@auth/core/providers/github";
import { eventHandler, toWebRequest, getRouterParam, getRequestPath, getRequestURL } from "h3";

// 声明 Edge Runtime
export const runtime = "edge";
export const preferredRegion = ["iad1", "hnd1"];

/**
 * 检查是否应该跳过认证处理
 */
function shouldSkipAuth(pathname: string): boolean {
  if (!pathname) return false;
  
  // 静态资源模式
  const skipPatterns = [
    // 具体的静态文件
    /^\/favicon\.ico$/,
    /^\/favicon\.png$/,
    /^\/robots\.txt$/,
    /^\/sitemap\.xml$/,
    
    // 静态资源目录
    /^\/_next\//,
    /^\/static\//,
    /^\/images\//,
    /^\/fonts\//,
    /^\/logos\//,
    /^\/css\//,
    /^\/js\//,
    
    // 文件扩展名
    /\.(ico|png|jpg|jpeg|gif|svg|webp|bmp)$/i,
    /\.(css|scss|sass|less)$/i,
    /\.(js|jsx|ts|tsx|mjs|map)$/i,
    /\.(woff|woff2|ttf|otf|eot)$/i,
    /\.(txt|xml|json|webmanifest)$/i,
    /\.(mp3|mp4|ogg|wav|webm)$/i,
    /\.(pdf|doc|docx|xls|xlsx)$/i,
    /\.(zip|tar|gz|rar)$/i
  ];
  
  return skipPatterns.some(pattern => pattern.test(pathname));
}

/**
 * 检查是否是认证相关的请求
 * 只处理明确的NextAuth和OAuth认证路径
 */
function isAuthRequest(pathname: string): boolean {
  if (!pathname) return false;
  
  // 更精确的认证路由模式 - 只处理明确的认证相关路径
  const authPatterns = [
    // 标准 NextAuth 路由（严格匹配）
    /^\/api\/auth(\/.*)?$/,              // /api/auth/*
    /^\/_next\/auth(\/.*)?$/,            // /_next/auth/*
    
    // GitHub OAuth 相关（严格匹配）
    /^\/auth\/github(\/.*)?$/,           // /auth/github/*
    /^\/auth\/callback\/github(\/.*)?$/, // /auth/callback/github/*
    /^\/oauth\/github(\/.*)?$/,          // /oauth/github/*
    
    // NextAuth 标准动作（严格匹配）
    /^\/auth\/signin(\/?)?$/,            // /auth/signin 或 /auth/signin/
    /^\/auth\/signout(\/?)?$/,           // /auth/signout 或 /auth/signout/
    /^\/auth\/session(\/?)?$/,           // /auth/session 或 /auth/session/
    /^\/auth\/providers(\/?)?$/,         // /auth/providers 或 /auth/providers/
    
    // 通用认证路径（严格匹配）
    /^\/auth\/callback(\/.*)?$/,         // /auth/callback/*
    
    // 具体OAuth回调（严格匹配）
    /^\/api\/auth\/callback\/github(\/?)?$/,
    /^\/api\/auth\/signin\/github(\/?)?$/,
    /^\/api\/auth\/signout(\/?)?$/,
    /^\/api\/auth\/session(\/?)?$/,
    /^\/api\/auth\/providers(\/?)?$/
  ];
  
  // 额外检查：确保是认证相关，排除页面路由
  const isPageRoute = /\/(image-prompt|image-to-prompt|blog|docs|pricing|tutorials|dashboard|admin)/.test(pathname);
  const isMarketingPage = /^\/(zh|en|ko|ja)\/(image-prompt|image-to-prompt)/.test(pathname);
  
  if (isPageRoute || isMarketingPage) {
    console.log(`[Auth Route] 排除页面路由: ${pathname}`);
    return false;
  }
  
  return authPatterns.some(pattern => pattern.test(pathname));
}

export default eventHandler(async (event) => {
  // 获取请求路径 - 使用多种方法确保正确获取
  const pathname = getRouterParam(event, '_') || 
                   getRequestPath(event) || 
                   (event.node?.req?.url || '').split('?')[0] || 
                   '';
  
  console.log(`[Auth Route] 收到请求: "${pathname}"`);
  console.log(`[Auth Route] 完整URL: ${getRequestURL(event).href}`);
  
  // 首先检查是否是认证相关请求
  if (!isAuthRequest(pathname)) {
    console.log(`[Auth Route] 非认证请求，直接转发: ${pathname}`);
    // 非认证请求不应该到达这里，但如果到达了，返回404让Vercel路由到正确的地方
    return new Response('Not Found', { 
      status: 404,
      headers: { 
        'content-type': 'text/plain',
        'X-Auth-Proxy': 'non-auth-request'
      }
    });
  }
  
  // 检查是否应该跳过认证（静态资源）
  if (shouldSkipAuth(pathname)) {
    console.log(`[Auth Route] 跳过静态资源: ${pathname}`);
    // 对于静态资源，返回404让Vercel处理
    return new Response('Not Found', { 
      status: 404,
      headers: { 
        'content-type': 'text/plain',
        'X-Auth-Proxy': 'static-resource'
      }
    });
  }
  
  // 特别处理根路径
  if (pathname === '/' || pathname === '') {
    console.log(`[Auth Route] 跳过根路径: ${pathname}`);
    // 根路径返回404
    return new Response('Not Found', { 
      status: 404,
      headers: { 
        'content-type': 'text/plain',
        'X-Auth-Proxy': 'root-path'
      }
    });
  }
  
  // 检查中间件标记
  if (event.context.skipAuth) {
    console.log(`[Auth Route] 根据中间件跳过: ${pathname}`);
    return new Response('Not Found', { 
      status: 404,
      headers: { 
        'content-type': 'text/plain',
        'X-Auth-Proxy': 'middleware-skip'
      }
    });
  }
  
  console.log(`[Auth Route] 处理认证请求: ${pathname}`);
  
  try {
    // 处理认证请求
    return await Auth(toWebRequest(event), {
      secret: process.env.AUTH_SECRET,
      trustHost: !!process.env.VERCEL,
      redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
      providers: [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
      ],
    });
  } catch (error) {
    console.error(`[Auth Route] 认证处理错误: ${pathname}`, error);
    // 认证错误时返回401，让客户端知道需要认证
    return new Response('Authentication Required', { 
      status: 401,
      headers: { 
        'content-type': 'text/plain',
        'X-Auth-Proxy': 'auth-error'
      }
    });
  }
});
