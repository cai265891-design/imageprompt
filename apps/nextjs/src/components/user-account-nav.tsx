"use client";

import Link from "next/link";
import type { User } from "@saasfly/auth";
import { useClerk } from "@clerk/nextjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@saasfly/ui/dropdown-menu";

import { UserAvatar } from "~/components/user-avatar";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
  params: {
    lang: string;
  };
  dict: Record<string, string>;
}

export function UserAccountNav({
  user,
  params: { lang },
  dict,
}: UserAccountNavProps) {
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name ?? null, image: user.image ?? null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut(() => {
              window.location.href = `/${lang}`;
            }).catch((error) => {
              console.error("Error during sign out:", error);
            });
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
