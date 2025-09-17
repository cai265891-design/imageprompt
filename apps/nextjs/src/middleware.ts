import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { i18n } from "~/config/i18n-config";

const isPublicRoute = createRouteMatcher([
  "/",
  "/en",
  "/zh",
  "/ko",
  "/ja",
  "/(en|zh|ko|ja)/sign-in(.*)",
  "/(en|zh|ko|ja)/sign-up(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk",
  "/(en|zh|ko|ja)/image-prompt",
  "/image-prompt",
  "/(en|zh|ko|ja)/image-to-prompt",
  "/image-to-prompt",
  "/(en|zh|ko|ja)/tutorials",
  "/tutorials",
  "/(en|zh|ko|ja)/pricing",
  "/pricing",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 排除静态资源和特殊文件
  if (
    pathname === "/favicon.ico" ||
    pathname === "/favicon.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/logos/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.endsWith(".xml") ||
    pathname.endsWith(".txt") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".webmanifest") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg")
  ) {
    return NextResponse.next();
  }

  // 处理多语言路由重定向
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (
    pathnameIsMissingLocale &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    const locale = i18n.defaultLocale;
    // 构建重定向 URL
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
      request.url,
    );

    // 检查重定向后的路径是否是公开路由
    const redirectedRequest = new Request(redirectUrl, request);
    if (isPublicRoute(redirectedRequest)) {
      // 如果是公开路由，直接重定向，不需要认证
      return NextResponse.redirect(redirectUrl);
    }

    // 否则重定向并继续认证流程
    return NextResponse.redirect(redirectUrl);
  }

  // 检查是否需要认证
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 优化匹配器配置，避免404错误
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|ttf|woff|woff2|css|js|xml|txt|json|webmanifest)).*)",
  ],
};
