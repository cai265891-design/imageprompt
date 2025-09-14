import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // NextAuth 配置（可选）
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    
    // Clerk 配置（必需）
    CLERK_SECRET_KEY: z.string().min(1),
    
    // Stripe 配置（可选）
    STRIPE_API_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    
    // Email 配置（可选）
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM: z.string().optional(),
    
    // Admin 配置（可选）
    ADMIN_EMAIL: z.string().optional(),
    IS_DEBUG: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    
    // Clerk 配置（必需）
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().optional(),
  },
  runtimeEnv: {
    // NextAuth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    
    // Clerk
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    
    // Stripe
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    
    // Email
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    
    // Admin
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    IS_DEBUG: process.env.IS_DEBUG,
    
    // General
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
