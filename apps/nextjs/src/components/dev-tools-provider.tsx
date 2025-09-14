"use client";

import { useEffect } from "react";
import { initDevTools } from "~/lib/dev-tools-client";

/**
 * 开发工具提供者组件
 * 在开发模式下自动启用开发工具
 */
export function DevToolsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      initDevTools();
    }
  }, []);

  return <>{children}</>;
}
