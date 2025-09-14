import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  srcDir: ".",
  preset: "vercel",
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    authRedirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
});
