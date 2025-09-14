import { auth } from "@clerk/nextjs/server";

import { env } from "./env.mjs";

interface ClerkUser {
  id?: string;
  email?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

export async function getSessionUser() {
  const { sessionClaims } = await auth();
  const user = sessionClaims?.user as ClerkUser | undefined;
  
  if (env.ADMIN_EMAIL && user?.email) {
    const adminEmails = env.ADMIN_EMAIL.split(",");
    user.isAdmin = adminEmails.includes(user.email);
  }
  
  return user;
}
