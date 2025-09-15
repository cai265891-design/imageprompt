import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  srcDir: ".",
  preset: "vercel",
  
  // 运行时配置
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    authRedirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  
  // 路由规则 - 静态资源直接返回
  routeRules: {
    // 具体的静态文件
    '/favicon.ico': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: true 
    },
    '/favicon.png': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: true 
    },
    '/robots.txt': { 
      headers: { 'content-type': 'text/plain' },
      prerender: true 
    },
    '/sitemap.xml': { 
      headers: { 'content-type': 'application/xml' },
      prerender: true 
    },
    
    // 静态资源目录
    '/_next/**': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: false 
    },
    '/static/**': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: false 
    },
    '/images/**': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: false 
    },
    '/fonts/**': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: false 
    },
    '/logos/**': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: false 
    },
    '/css/**': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: false 
    },
    '/js/**': { 
      headers: { 'cache-control': 'public, max-age=31536000' },
      prerender: false 
    },
  },
  
  // 实验功能
  experimental: {
    wasm: true
  },
  
  // 压缩
  compressPublicAssets: true,
  
  // 日志配置
  logging: {
    level: 2 // 显示详细信息用于调试
  }
});
