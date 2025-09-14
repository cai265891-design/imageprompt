"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProviderClient({ children }: ClerkProviderProps) {
  const router = useRouter();

  return (
    <ClerkProvider
      routerPush={(to) => router.push(to)}
      routerReplace={(to) => router.replace(to)}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}
