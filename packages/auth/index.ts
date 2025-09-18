import { currentUser } from "@clerk/nextjs/server";
import { syncUserToDatabase } from "./src/sync-user";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Clerk auth functions
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    // 自动同步用户到数据库
    // 这确保每个登录的用户都会在数据库中有记录
    await syncUserToDatabase(user);

    return {
      id: user.id,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || null,
      email: user.emailAddresses?.[0]?.emailAddress || null,
      image: user.imageUrl || null,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const authOptions = {};
