import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@saasfly/db";

/**
 * API 端点：同步当前登录用户到数据库
 * 访问 /api/sync-current-user 来手动同步
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

    const email = user.emailAddresses?.[0]?.emailAddress;
    const name = user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.username || "";

    // 检查用户是否已存在
    const existingUser = await db
      .selectFrom("User")
      .select("id")
      .where("id", "=", user.id)
      .executeTakeFirst();

    let message = "";

    if (existingUser) {
      // 更新现有用户
      await db
        .updateTable("User")
        .set({
          email: email || null,
          name: name || null,
          image: user.imageUrl || null,
          emailVerified: new Date(),
        })
        .where("id", "=", user.id)
        .execute();

      message = "用户信息已更新";
    } else {
      // 创建新用户
      await db
        .insertInto("User")
        .values({
          id: user.id,
          email: email || null,
          name: name || null,
          image: user.imageUrl || null,
          emailVerified: new Date(),
        })
        .execute();

      message = "用户已同步到数据库";
    }

    // 检查并创建 Customer 记录
    const existingCustomer = await db
      .selectFrom("Customer")
      .select("id")
      .where("authUserId", "=", user.id)
      .executeTakeFirst();

    if (!existingCustomer) {
      await db
        .insertInto("Customer")
        .values({
          authUserId: user.id,
          name: name || null,
          plan: "FREE",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute();

      message += "，Customer 记录已创建";
    }

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