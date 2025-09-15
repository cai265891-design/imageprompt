import { Auth } from 'file:///Users/caihongjia/saasfly/node_modules/@auth/core/index.js';
import GitHub from 'file:///Users/caihongjia/saasfly/node_modules/@auth/core/providers/github.js';
import { eventHandler, getRouterParam, getRequestPath, getRequestURL, toWebRequest } from 'file:///Users/caihongjia/saasfly/node_modules/h3/dist/index.mjs';

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
  var _a, _b;
  const pathname = getRouterParam(event, "_") || getRequestPath(event) || (((_b = (_a = event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) || "").split("?")[0] || "";
  console.log(`[Auth Route] \u6536\u5230\u8BF7\u6C42: "${pathname}"`);
  console.log(`[Auth Route] \u5B8C\u6574URL: ${getRequestURL(event).href}`);
  if (shouldSkipAuth(pathname)) {
    console.log(`[Auth Route] \u8DF3\u8FC7\u9759\u6001\u8D44\u6E90: ${pathname}`);
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain" }
    });
  }
  if (pathname === "/" || pathname === "") {
    console.log(`[Auth Route] \u8DF3\u8FC7\u6839\u8DEF\u5F84: ${pathname}`);
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain" }
    });
  }
  if (event.context.skipAuth) {
    console.log(`[Auth Route] \u6839\u636E\u4E2D\u95F4\u4EF6\u8DF3\u8FC7: ${pathname}`);
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain" }
    });
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
    return new Response("Internal Server Error", {
      status: 500,
      headers: { "content-type": "text/plain" }
    });
  }
});

export { ____auth_ as default, preferredRegion, runtime };
//# sourceMappingURL=_...auth_.mjs.map
