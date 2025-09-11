"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@saasfly/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@saasfly/ui/dropdown-menu";
import * as Icons from "@saasfly/ui/icons";

export default function ThemeToggle(props: {
  align?: "center" | "start" | "end";
  side?: "top" | "bottom";
}) {
  const { setTheme, theme } = useTheme();

  // 强制使用浅色主题，隐藏切换功能
  const triggerIcon = <Icons.Sun className="h-6 w-6" />;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 px-2 text-lg font-semibold md:text-base cursor-default"
      onClick={() => setTheme("light")}
    >
      {triggerIcon}
      <span>Light</span>
      <span className="sr-only">Current theme: Light</span>
    </Button>
  );
}
