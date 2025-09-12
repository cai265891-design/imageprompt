"use client";

import React from "react";
import Link from "next/link";
import type { User } from "@saasfly/auth";
import { useSelectedLayoutSegment } from "next/navigation";

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
  const segment = useSelectedLayoutSegment();

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center border-border bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-background/0") : "border-b"
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={items} params={{ lang: `${lang}` }} marketing={marketing}>
          {children}
        </MainNav>

        <div className="flex items-center space-x-3">
          {items?.length ? (
            <nav className="hidden gap-6 md:flex">
              {items?.map((item, index) => {
                // 特殊处理品牌链接
                if (item.isBrand) {
                  return (
                    <Link
                      key={index}
                      href={item.disabled ? "#" : (item.href.startsWith("http") ? item.href : `/${lang}${item.href}`)}
                      className={cn(
                        "flex items-center text-lg font-bold transition-colors",
                        "text-purple-600 hover:text-purple-700",
                        "flex items-center gap-2",
                        item.disabled && "cursor-not-allowed opacity-80",
                      )}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                        <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" stroke="none" fill="rgba(127,0,255,0.12)" />
                        <path d="M7 14l3.5-4.5L13 14l3-4" stroke="none" fill="currentColor" opacity="0.95" />
                      </svg>
                      {item.title}
                    </Link>
                  );
                }
                
                return (
                  <Link
                    key={index}
                    href={item.disabled ? "#" : (item.href.startsWith("http") ? item.href : `/${lang}${item.href}`)}
                    className={cn(
                      "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                      item.href.startsWith(`/${segment}`)
                        ? "text-blue-500 font-semibold"
                        : "",
                      item.disabled && "cursor-not-allowed opacity-80",
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          ) : null}

          {rightElements}

          {config?.showGitHubStar !== false && (
            <div className="hidden md:flex lg:flex xl:flex">
              <GitHubStar />
            </div>
          )}
          
          {config?.showLocaleChange !== false && (
            <LocaleChange url={"/"} />
          )}
          
          {!user ? (
            config?.loginStyle === "imageprompt" ? (
              <Link href={`/${lang}/login`}>
                <span className="text-sm font-bold" style={{ color: 'var(--purple-1)' }}>
                  Login
                </span>
              </Link>
            ) : (
              <Link href={`/${lang}/login`}>
                <Button variant="outline" size="sm">
                  {typeof marketing.login === "string"
                    ? marketing.login
                    : "Default Login Text"}
                </Button>
              </Link>
            )
          ) : null}

          {user ? (
            <UserAccountNav
              user={user}
              params={{ lang: `${lang}` }}
              dict={dropdown}
            />
          ) : (
            <Button
              className="px-3"
              variant="default"
              size="sm"
              onClick={signInModal.onOpen}
            >
              {typeof marketing.signup === "string"
                ? marketing.signup
                : "Default Signup Text"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
