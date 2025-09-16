import Link from "next/link";
import { Button } from "@saasfly/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">404</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          页面未找到 - Page Not Found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          抱歉，您请求的页面不存在。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">前往控制台</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}