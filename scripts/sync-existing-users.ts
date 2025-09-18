#!/usr/bin/env bun

/**
 * 同步已存在的 Clerk 用户到数据库
 * 使用方法: bun run scripts/sync-existing-users.ts
 */

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@saasfly/db";

async function syncExistingUsers() {
  console.log("🔄 开始同步 Clerk 用户到数据库...");

  try {
    // 获取所有 Clerk 用户
    const users = await clerkClient.users.getUserList({
      limit: 100, // 可以根据需要调整
    });

    console.log(`📊 找到 ${users.length} 个用户`);

    let syncedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      const email = user.emailAddresses?.[0]?.emailAddress;
      const name = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user.username || "";

      try {
        // 检查用户是否已存在于数据库
        const existingUser = await db
          .selectFrom("User")
          .select("id")
          .where("id", "=", user.id)
          .executeTakeFirst();

        if (existingUser) {
          console.log(`⏭️  跳过已存在用户: ${email}`);
          skippedCount++;
          continue;
        }

        // 创建新用户记录
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

        // 同时创建 Customer 记录
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
        }

        console.log(`✅ 同步成功: ${email}`);
        syncedCount++;
      } catch (error) {
        console.error(`❌ 同步失败 ${email}:`, error);
        errorCount++;
      }
    }

    console.log("\n📈 同步完成!");
    console.log(`✅ 成功同步: ${syncedCount} 个用户`);
    console.log(`⏭️  已存在跳过: ${skippedCount} 个用户`);
    console.log(`❌ 同步失败: ${errorCount} 个用户`);
  } catch (error) {
    console.error("❌ 同步过程出错:", error);
    process.exit(1);
  }
}

// 运行同步
syncExistingUsers()
  .then(() => {
    console.log("✨ 同步脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ 脚本执行失败:", error);
    process.exit(1);
  });