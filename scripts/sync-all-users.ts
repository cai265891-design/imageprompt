#!/usr/bin/env bun

/**
 * 初始用户同步脚本
 * 用于将所有现有的 Clerk 用户同步到 Neon 数据库
 *
 * 使用方法：
 * 1. 确保设置了 CLERK_SECRET_KEY 环境变量
 * 2. 确保设置了 POSTGRES_URL 环境变量
 * 3. 运行: bun run scripts/sync-all-users.ts
 */

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@saasfly/db";

async function syncAllUsers() {
  console.log("🚀 开始同步所有 Clerk 用户到数据库...");

  try {
    // 获取所有 Clerk 用户
    const users = await clerkClient.users.getUserList({
      limit: 100, // 可以根据需要调整
    });

    console.log(`📊 找到 ${users.totalCount} 个用户`);

    let syncedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;

    for (const user of users.data) {
      try {
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

          updatedCount++;
          console.log(`✅ 更新用户: ${email || user.id}`);
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

          syncedCount++;
          console.log(`✅ 同步用户: ${email || user.id}`);
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

          console.log(`✅ 创建 Customer 记录: ${email || user.id}`);
        }
      } catch (error) {
        failedCount++;
        console.error(`❌ 同步用户失败 ${user.id}:`, error);
      }
    }

    console.log("\n📊 同步完成:");
    console.log(`  ✅ 新同步: ${syncedCount} 个用户`);
    console.log(`  ✅ 已更新: ${updatedCount} 个用户`);
    console.log(`  ❌ 失败: ${failedCount} 个用户`);

    // 如果有更多用户，提示需要处理分页
    if (users.totalCount > 100) {
      console.log(`\n⚠️ 注意: 总共有 ${users.totalCount} 个用户，但只同步了前 100 个。`);
      console.log("如果需要同步所有用户，请修改脚本以处理分页。");
    }

  } catch (error) {
    console.error("❌ 同步失败:", error);
    process.exit(1);
  }
}

// 运行同步
syncAllUsers()
  .then(() => {
    console.log("\n✅ 同步脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 同步脚本执行失败:", error);
    process.exit(1);
  });