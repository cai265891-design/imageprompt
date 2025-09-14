import React from "react";
import { cn } from "./utils/cn";

interface DevToolsProps {
  children: React.ReactNode;
  filePath?: string;
  lineNumber?: number;
  className?: string;
}

/**
 * 开发工具组件 - 在开发模式下显示源码位置信息
 * 使用方式：
 * <DevTools filePath="components/MyComponent.tsx" lineNumber={123}>
 *   <div>你的组件内容</div>
 * </DevTools>
 */
export function DevTools({
  children,
  filePath,
  lineNumber,
  className,
}: DevToolsProps) {
  // 只在开发模式下显示
  if (process.env.NODE_ENV !== "development") {
    return <>{children}</>;
  }

  const handleClick = () => {
    if (filePath && lineNumber) {
      // 构建 vscode 链接格式
      const vscodeUrl = `vscode://file/${process.cwd()}/${filePath}:${lineNumber}`;

      // 尝试打开 VSCode
      try {
        window.open(vscodeUrl, "_blank");
      } catch (error) {
        console.log("请确保已安装 VSCode 并配置了 vscode:// 协议支持");
        console.log(`文件位置: ${filePath}:${lineNumber}`);
      }
    }
  };

  return (
    <div
      className={cn("relative group", className)}
      onClick={handleClick}
      style={{ cursor: filePath ? "pointer" : "default" }}
    >
      {children}
      {filePath && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
          {filePath.split("/").pop()}:{lineNumber}
          <div className="text-xs opacity-75">点击跳转到源码</div>
        </div>
      )}
    </div>
  );
}

/**
 * 简化的开发工具包装器
 * 自动获取调用位置信息
 */
export function withDevTools<P extends object>(
  Component: React.ComponentType<P>,
  filePath: string,
  lineNumber?: number,
) {
  return React.forwardRef<any, P>((props, ref) => {
    if (process.env.NODE_ENV !== "development") {
      return <Component {...props} ref={ref} />;
    }

    return (
      <DevTools filePath={filePath} lineNumber={lineNumber}>
        <Component {...props} ref={ref} />
      </DevTools>
    );
  });
}
