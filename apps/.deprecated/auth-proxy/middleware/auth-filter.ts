import { defineEventHandler, getRequestURL, getRouterParam } from 'h3';

/**
 * 静态资源过滤中间件
 * 防止NextAuth处理静态资源请求
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname;
  
  // 定义需要跳过的静态资源模式
  const staticResourcePatterns = [
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
  
  // 检查是否是静态资源
  const isStaticResource = staticResourcePatterns.some(pattern => 
    pattern.test(pathname)
  );
  
  if (isStaticResource) {
    // 标记此请求不需要认证处理
    event.context.skipAuth = true;
    console.log(`[Auth Filter] 跳过静态资源: ${pathname}`);
  }
  
  // 继续处理链
});