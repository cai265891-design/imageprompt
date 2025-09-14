// @ts-check
import "./src/env.mjs";
import "@saasfly/auth/env.mjs";

// import { withNextDevtools } from "@next-devtools/core/plugin";
// import "@saasfly/api/env"
import withMDX from "@next/mdx";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@saasfly/api",
    "@saasfly/auth",
    "@saasfly/db",
    "@saasfly/common",
    "@saasfly/ui",
    "@saasfly/stripe",
  ],
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    mdxRs: true,
    // serverActions: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "avatars.githubusercontent.com",
      "www.twillot.com",
      "cdnv2.ruguoapp.com",
      "www.setupyourpay.com",
    ],
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  // 开发工具配置 - 启用源码映射和开发工具
  productionBrowserSourceMaps: process.env.NODE_ENV === "development",
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
  // Webpack 配置来增强开发体验
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 启用更好的源码映射
      config.devtool = "eval-source-map";

      // 添加 React Developer Tools 支持
      config.resolve.alias = {
        ...config.resolve.alias,
        "react-dom$": "react-dom/profiling",
        "scheduler/tracing": "scheduler/tracing-profiling",
      };
    }

    return config;
  },
};

export default withMDX()(config);
