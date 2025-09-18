import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { syncUserToDatabase } from "@saasfly/auth/src/sync-user";

// 禁用静态优化，避免构建时需要数据库连接
export const dynamic = "force-dynamic";

/**
 * API 端点：同步当前登录用户到数据库
 * 访问 /api/sync-current-user 来手动同步
 *
 * 注意：通常不需要手动调用此端点，因为 getCurrentUser 会自动同步
 */
export async function GET() {
  try {
    // 获取当前登录的 Clerk 用户
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    // 使用统一的同步函数
    const result = await syncUserToDatabase(user);

    const email = user.emailAddresses?.[0]?.emailAddress;
    const name = user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.username || "";

    if (!result.success) {
      return NextResponse.json(
        { error: "同步失败", details: result.error },
        { status: 500 }
      );
    }

    const message = result.cached
      ? "用户数据已在缓存中（最近已同步）"
      : "用户数据已同步到数据库";

    return NextResponse.json({
      success: true,
      message,
      user: {
        id: user.id,
        email,
        name,
      },
    });
  } catch (error) {
    console.error("同步用户失败:", error);
    return NextResponse.json(
      { error: "同步失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}