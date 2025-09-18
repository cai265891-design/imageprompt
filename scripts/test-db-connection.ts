#!/usr/bin/env bun

/**
 * 测试数据库连接和查询
 * 使用方法: bun run scripts/test-db-connection.ts
 */

import { db } from "@saasfly/db";

async function testDatabaseConnection() {
  console.log("🔍 测试数据库连接...\n");

  try {
    // 1. 测试基本连接
    console.log("1️⃣ 测试基本查询...");
    const testQuery = await db
      .selectFrom("User")
      .select(["id"])
      .limit(1)
      .execute();
    console.log("✅ 数据库连接成功！\n");

    // 2. 统计 User 表记录
    console.log("2️⃣ 查询 User 表...");
    const users = await db
      .selectFrom("User")
      .selectAll()
      .execute();

    console.log(`📊 User 表有 ${users.length} 条记录`);

    if (users.length > 0) {
      console.log("最近的用户记录：");
      users.slice(0, 3).forEach(user => {
        console.log(`  - ID: ${user.id}`);
        console.log(`    邮箱: ${user.email}`);
        console.log(`    名字: ${user.name}`);
        console.log(`    创建时间: ${user.emailVerified}`);
        console.log("");
      });
    } else {
      console.log("⚠️  User 表为空！");
    }

    // 3. 统计 Customer 表记录
    console.log("\n3️⃣ 查询 Customer 表...");
    const customers = await db
      .selectFrom("Customer")
      .selectAll()
      .execute();

    console.log(`📊 Customer 表有 ${customers.length} 条记录`);

    if (customers.length > 0) {
      console.log("最近的客户记录：");
      customers.slice(0, 3).forEach(customer => {
        console.log(`  - ID: ${customer.id}`);
        console.log(`    用户ID: ${customer.authUserId}`);
        console.log(`    计划: ${customer.plan}`);
        console.log(`    创建时间: ${customer.createdAt}`);
        console.log("");
      });
    } else {
      console.log("⚠️  Customer 表为空！");
    }

    // 4. 检查表结构
    console.log("\n4️⃣ 检查表结构...");
    const tableCheck = await db
      .selectFrom("information_schema.tables")
      .select(["table_name"])
      .where("table_schema", "=", "public")
      .execute();

    console.log("📋 数据库中的表：");
    tableCheck.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

  } catch (error: any) {
    console.error("\n❌ 数据库连接失败！");
    console.error("错误信息：", error.message);
    console.error("错误代码：", error.code);

    if (error.code === 'missing_connection_string') {
      console.error("\n💡 解决方案：");
      console.error("1. 确保 .env.local 文件存在");
      console.error("2. 确保 POSTGRES_URL 环境变量已设置");
      console.error("3. 运行: source .env.local 或重启终端");
    }

    process.exit(1);
  }

  console.log("\n✨ 测试完成！");
}

// 运行测试
testDatabaseConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("未知错误：", error);
    process.exit(1);
  });