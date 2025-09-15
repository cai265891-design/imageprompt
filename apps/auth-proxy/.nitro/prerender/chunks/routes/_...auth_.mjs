import { Auth } from 'file:///Users/caihongjia/saasfly/node_modules/@auth/core/index.js';
import GitHub from 'file:///Users/caihongjia/saasfly/node_modules/@auth/core/providers/github.js';
import { eventHandler, getRouterParam, send, toWebRequest } from 'file:///Users/caihongjia/saasfly/node_modules/h3/dist/index.mjs';

const runtime = "edge";
const preferredRegion = ["iad1", "hnd1"];
function shouldSkipAuth(pathname) {
  if (!pathname)
    return false;
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
  return skipPatterns.some((pattern) => pattern.test(pathname));
}
const ____auth_ = eventHandler(async (event) => {
  const pathname = getRouterParam(event, "_") || "";
  console.log(`[Auth Route] \u6536\u5230\u8BF7\u6C42: ${pathname}`);
  if (shouldSkipAuth(pathname)) {
    console.log(`[Auth Route] \u8DF3\u8FC7\u9759\u6001\u8D44\u6E90: ${pathname}`);
    return send(event, "Not Found", 404);
  }
  if (event.context.skipAuth) {
    console.log(`[Auth Route] \u6839\u636E\u4E2D\u95F4\u4EF6\u8DF3\u8FC7: ${pathname}`);
    return send(event, "Not Found", 404);
  }
  try {
    return await Auth(toWebRequest(event), {
      secret: process.env.AUTH_SECRET,
      trustHost: !!process.env.VERCEL,
      redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
      providers: [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET
        })
      ]
    });
  } catch (error) {
    console.error(`[Auth Route] \u8BA4\u8BC1\u5904\u7406\u9519\u8BEF: ${pathname}`, error);
    return send(event, "Internal Server Error", 500);
  }
});

export { ____auth_ as default, preferredRegion, runtime };
//# sourceMappingURL=_...auth_.mjs.map
