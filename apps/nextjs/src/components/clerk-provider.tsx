"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProviderClient({ children }: ClerkProviderProps) {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  return (
    <ClerkProvider
      signInUrl={`/${lang}/sign-in`}
      signUpUrl={`/${lang}/sign-up`}
      afterSignInUrl={`/${lang}/image-prompt`}
      afterSignUpUrl={`/${lang}/image-prompt`}
    >
      {children}
    </ClerkProvider>
  );
}
