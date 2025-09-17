import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      hasClerkKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasPostgresUrl: !!process.env.POSTGRES_URL
    }
  });
}
