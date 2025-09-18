"use client";

import React from "react";
import Link from "next/link";
import type { User } from "@saasfly/auth";
import { usePathname } from "next/navigation";

import { cn } from "@saasfly/ui";
import { Button } from "@saasfly/ui/button";

import { MainNav } from "./main-nav";
import { LocaleChange } from "~/components/locale-change";
import { GitHubStar } from "~/components/github-star";
import { useSigninModal } from "~/hooks/use-signin-modal";
import { UserAccountNav } from "./user-account-nav";

import useScroll from "~/hooks/use-scroll";
import type { MainNavItem } from "~/types";

interface NavBarProps {
  user: Pick<User, "name" | "image" | "email"> | undefined;
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
  params: {
    lang: string;
  };
  marketing: Record<string, string | object>;
  dropdown: Record<string, string>;
  config?: {
    showGitHubStar?: boolean;
    showLocaleChange?: boolean;
    loginStyle?: "default" | "imageprompt";
  };
}

export function NavBar({
  user,
  items,
  children,
  rightElements,
  scroll = false,
  params: { lang },
  marketing,
  dropdown,
  config,
}: NavBarProps) {
  const scrolled = useScroll(50);
  const signInModal = useSigninModal();
  const pathname = usePathname();

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center border-border bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-background/0") : "border-b"
      }`}
    >
      <div className="container flex h-14 items-center justify-between py-3">
        {/* 左侧区域 - Home 和 Tools 导航，与 H1 对齐 */}
        <div className="flex items-center gap-40">
          <MainNav
            items={items}
            params={{ lang: `${lang}` }}
            marketing={marketing}
          >
            {children}
          </MainNav>

          {items?.length ? (
            <nav className="hidden gap-12 md:flex">
              {items?.map((item, index) => {
                // 判断是否为当前路径
                const isActive = pathname === item.href ||
                  // 对于 home，当路径是 /zh/image-prompt 或 / 时也算选中
                  (item.title.toLowerCase() === "home" && pathname === "/zh/image-prompt") ||
                  // 对于 tools，当路径是 /zh/image-to-prompt 时算选中
                  (item.title.toLowerCase() === "tools" && pathname === "/zh/image-to-prompt");

                return (
                  <Link
                    key={index}
                    href={
                      item.disabled
                        ? "#"
                        : item.href.startsWith("http")
                          ? item.href
                          : item.href
                    }
                    className={cn(
                      "text-base font-medium transition-colors relative",
                      isActive
                        ? "text-[#7f00ff] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#7f00ff]"
                        : "text-gray-600 hover:text-[#7f00ff]",
                      item.disabled && "cursor-not-allowed opacity-80",
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>

        {/* 右侧区域 - 用户操作 */}
        <div className="flex items-center space-x-3">
          {rightElements}

          {config?.showGitHubStar !== false && (
            <div className="hidden md:flex lg:flex xl:flex">
              <GitHubStar />
            </div>
          )}

          {config?.showLocaleChange !== false && <LocaleChange url={"/"} />}

          {user ? (
            <UserAccountNav
              user={user}
              params={{ lang: `${lang}` }}
              dict={dropdown}
            />
          ) : (
            <Link href={`/${lang}/sign-in`}>
              <Button
                variant="default"
                size="sm"
                className="bg-[#7f00ff] hover:bg-[#7f00ff]/90 text-white"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
