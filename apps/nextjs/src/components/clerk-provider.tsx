"use client";

import { ClerkProvider } from "@clerk/nextjs";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProviderClient({ children }: ClerkProviderProps) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
