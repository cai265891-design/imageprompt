import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { i18n } from "~/config/i18n-config";

const isPublicRoute = createRouteMatcher([
  "/",
  "/:lang/sign-in(.*)",
  "/:lang/sign-up(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk",
  "/:lang/image-prompt",
  "/image-prompt",
  "/:lang/image-to-prompt",
  "/image-to-prompt",
  "/:lang/tutorials",
  "/tutorials",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 排除静态资源和特殊文件
  if (
    pathname === "/favicon.ico" ||
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
    pathname.endsWith(".webmanifest")
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
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

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
