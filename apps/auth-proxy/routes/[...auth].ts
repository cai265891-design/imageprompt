import { Auth } from "@auth/core";
import GitHub from "@auth/core/providers/github";
import { eventHandler, toWebRequest } from "h3";

// 声明 Edge Runtime
export const runtime = 'edge';
export const preferredRegion = ['iad1', 'hnd1'];

export default eventHandler(async (event) =>
  Auth(toWebRequest(event), {
    secret: process.env.AUTH_SECRET,
    trustHost: !!process.env.VERCEL,
    redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    providers: [
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
    ],
  }),
);
