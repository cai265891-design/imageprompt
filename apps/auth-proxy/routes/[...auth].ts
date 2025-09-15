import { Auth } from "@auth/core";
import GitHub from "@auth/core/providers/github";
import { eventHandler, toWebRequest, getRouterParam, send } from "h3";

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

export default eventHandler(async (event) => {
  // 获取请求路径
  const pathname = getRouterParam(event, '_') || '';
  
  console.log(`[Auth Route] 收到请求: ${pathname}`);
  
  // 检查是否应该跳过认证
  if (shouldSkipAuth(pathname)) {
    console.log(`[Auth Route] 跳过静态资源: ${pathname}`);
    return send(event, 'Not Found', 404);
  }
  
  // 检查中间件标记
  if (event.context.skipAuth) {
    console.log(`[Auth Route] 根据中间件跳过: ${pathname}`);
    return send(event, 'Not Found', 404);
  }
  
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
    return send(event, 'Internal Server Error', 500);
  }
});
