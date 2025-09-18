import type { User } from "@clerk/nextjs/server";

// 缓存已同步的用户ID，避免重复同步
// 使用 Map 而不是 Set 来记录同步时间
const syncCache = new Map<string, number>();
const SYNC_CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

/**
 * 同步 Clerk 用户到数据库
 * 这个函数会在用户登录时自动调用，确保数据库中有用户记录
 * 包含缓存机制，避免频繁的数据库操作
 */
export async function syncUserToDatabase(user: User) {
  try {
    // 检查缓存，如果最近已经同步过，则跳过
    const lastSyncTime = syncCache.get(user.id);
    if (lastSyncTime && Date.now() - lastSyncTime < SYNC_CACHE_TTL) {
      return { success: true, userId: user.id, cached: true };
    }

    // 动态导入数据库，避免构建时错误
    const { db } = await import("@saasfly/db");

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
      // 更新现有用户（可能信息有变化）
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

      console.log(`[Sync] Updated user: ${email}`);
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

      console.log(`[Sync] Created new user: ${email}`);
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

      console.log(`[Sync] Created customer record for user: ${email}`);
    }

    // 更新缓存
    syncCache.set(user.id, Date.now());

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("[Sync] Failed to sync user to database:", error);
    // 不抛出错误，避免影响用户体验
    // 但记录错误以便调试
    return { success: false, error };
  }
}