import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// 禁用静态优化
export const dynamic = "force-dynamic";

/**
 * 调试端点：检查数据库连接和用户数据
 * 访问 /api/debug/check-db 来检查问题
 */
export async function GET() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? "是" : "否",
    checks: {},
  };

  try {
    // 1. 检查环境变量
    debugInfo.checks.环境变量 = {
      POSTGRES_URL: process.env.POSTGRES_URL ? "✅ 已设置" : "❌ 未设置",
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "✅ 已设置" : "❌ 未设置",
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ? "✅ 已设置" : "❌ 未设置",
    };

    // 2. 检查 Clerk 用户
    const user = await currentUser();
    if (user) {
      debugInfo.checks.Clerk用户 = {
        状态: "✅ 已登录",
        ID: user.id,
        邮箱: user.emailAddresses?.[0]?.emailAddress,
        名字: user.firstName,
      };
    } else {
      debugInfo.checks.Clerk用户 = {
        状态: "❌ 未登录",
      };
    }

    // 3. 尝试连接数据库
    try {
      const { db } = await import("@saasfly/db");

      // 尝试简单查询
      const testQuery = await db
        .selectFrom("User")
        .select(["id"])
        .limit(1)
        .execute();

      debugInfo.checks.数据库连接 = {
        状态: "✅ 连接成功",
        测试查询: "成功",
      };

      // 如果有登录用户，检查是否在数据库中
      if (user) {
        const dbUser = await db
          .selectFrom("User")
          .select(["id", "email", "name"])
          .where("id", "=", user.id)
          .executeTakeFirst();

        if (dbUser) {
          debugInfo.checks.用户数据同步 = {
            状态: "✅ 用户已同步",
            数据: dbUser,
          };
        } else {
          debugInfo.checks.用户数据同步 = {
            状态: "❌ 用户未同步到数据库",
            建议: "访问 /api/sync-current-user 进行同步",
          };
        }

        // 检查 Customer 记录
        const customer = await db
          .selectFrom("Customer")
          .select(["id", "plan"])
          .where("authUserId", "=", user.id)
          .executeTakeFirst();

        debugInfo.checks.Customer记录 = customer
          ? { 状态: "✅ 存在", 计划: customer.plan }
          : { 状态: "❌ 不存在" };
      }

      // 统计数据
      const userCount = await db
        .selectFrom("User")
        .select(db.fn.count("id").as("count"))
        .executeTakeFirst();

      const customerCount = await db
        .selectFrom("Customer")
        .select(db.fn.count("id").as("count"))
        .executeTakeFirst();

      debugInfo.checks.数据统计 = {
        User表记录数: userCount?.count || 0,
        Customer表记录数: customerCount?.count || 0,
      };

    } catch (dbError: any) {
      debugInfo.checks.数据库连接 = {
        状态: "❌ 连接失败",
        错误: dbError.message,
        代码: dbError.code,
        提示: "请检查 POSTGRES_URL 环境变量",
      };
    }

    // 4. 检查 Webhook 配置
    debugInfo.checks.Webhook配置 = {
      Clerk_Webhook_URL: `/api/webhooks/clerk`,
      需要配置的事件: ["user.created", "user.updated", "user.deleted"],
      注意: "请在 Clerk Dashboard 中配置 Webhook",
    };

  } catch (error: any) {
    debugInfo.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  // 5. 提供解决方案
  debugInfo.解决方案 = [];

  if (!process.env.POSTGRES_URL) {
    debugInfo.解决方案.push({
      问题: "数据库未配置",
      解决: "在 Vercel 环境变量中设置 POSTGRES_URL",
    });
  }

  if (debugInfo.checks.Clerk用户?.状态 === "✅ 已登录" &&
      debugInfo.checks.用户数据同步?.状态 === "❌ 用户未同步到数据库") {
    debugInfo.解决方案.push({
      问题: "用户未同步",
      解决: "访问 /api/sync-current-user 手动同步",
    });
  }

  if (!process.env.CLERK_WEBHOOK_SECRET) {
    debugInfo.解决方案.push({
      问题: "Webhook 未配置",
      解决: "1. 在 Clerk Dashboard 配置 Webhook\n2. 添加 CLERK_WEBHOOK_SECRET 到环境变量",
    });
  }

  return NextResponse.json(debugInfo, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}