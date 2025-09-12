# 开发工具使用说明

本项目的开发工具可以帮助你在浏览器中点击页面元素直接跳转到对应的源码位置。

## 功能特性

1. **源码位置显示** - 在开发模式下显示组件的源码文件和行号
2. **点击跳转** - 点击元素可直接在 VSCode 中打开对应源码
3. **快捷键支持** - Alt + Shift + S 快速打开选中元素的源码
4. **右键菜单** - Alt + 右键点击直接打开源码

## 使用方法

### 1. 基础用法

使用 `DevTools` 组件包装你的组件：

```tsx
import { DevTools } from "@saasfly/ui";

export default function MyComponent() {
  return (
    <DevTools filePath="components/MyComponent.tsx" lineNumber={5}>
      <div>你的组件内容</div>
    </DevTools>
  );
}
```

### 2. 使用高阶组件

使用 `withDevTools` 包装现有组件：

```tsx
import { withDevTools } from "@saasfly/ui";

function MyComponent() {
  return <div>组件内容</div>;
}

export default withDevTools(MyComponent, "components/MyComponent.tsx", 1);
```

### 3. 自动注入（推荐）

在 `next.config.mjs` 中已配置自动源码映射，大部分情况下无需手动添加 DevTools 组件。

## 快捷键

- **Alt + Shift + S**: 打开当前选中元素的源码
- **Alt + 右键点击**: 直接打开点击元素的源码

## VSCode 配置

确保你的 VSCode 支持 `vscode://` 协议：

1. 安装 VSCode
2. 在终端运行: `code --install-extension ms-vscode.vscode-url-handler`
3. 测试是否生效: 在浏览器访问 `vscode://file/你的项目路径/test.txt`

## 故障排除

### 无法跳转到源码

1. 确保你在开发模式下运行 (`bun run dev`)
2. 检查浏览器控制台是否有错误信息
3. 确保 VSCode 已安装并支持 vscode:// 协议
4. 尝试手动访问 vscode://file/项目路径/文件路径:行号

### 源码位置不准确

1. 重新启动开发服务器
2. 清除浏览器缓存
3. 检查是否正确配置了 sourcemap

## 原理

1. **源码映射**: 通过 webpack 的 `eval-source-map` 配置生成详细的源码映射
2. **元素标记**: 在编译时自动为 JSX 元素添加 `data-source-file` 和 `data-source-line` 属性
3. **事件处理**: 在客户端监听点击和键盘事件，解析源码位置并打开编辑器

## 扩展

你可以根据需要扩展开发工具的功能：

1. 添加对其他编辑器的支持（WebStorm、Sublime Text 等）
2. 添加更多的快捷键和交互方式
3. 集成 React Developer Tools 提供更丰富的调试信息