import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义公开路由（无需登录即可访问）
const isPublicRoute = createRouteMatcher([
  "/",
  "/zh(.*)",
  "/en(.*)",
  "/ja(.*)",
  "/ko(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/trpc(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // 如果不是公开路由，则保护该路由
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};