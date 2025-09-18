import { currentUser } from "@clerk/nextjs/server";

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
