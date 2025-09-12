/**
 * 开发工具客户端脚本 - 在浏览器中处理源码跳转
 * 需要在开发模式下加载到页面中
 * 
 * 使用方式：
 * 1. 确保元素有 data-source-file 和 data-source-line 属性
 * 2. 按 Alt + Shift + S 打开选中元素的源码
 * 3. 或 Alt + 右键点击直接打开
 */

interface SourceLocation {
  file: string;
  line: number;
  column?: number;
}

/**
 * 解析源码位置信息
 */
function parseSourceLocation(element: Element): SourceLocation | null {
  const file = element.getAttribute('data-source-file');
  const line = element.getAttribute('data-source-line');
  
  if (file && line) {
    return {
      file,
      line: parseInt(line, 10),
    };
  }
  
  return null;
}

/**
 * 构建 VSCode URL
 */
function buildVSCodeUrl(location: SourceLocation): string {
  // 在浏览器环境中，我们需要构建相对于项目根目录的路径
  // 假设项目在 /Users/caihongjia/saasfly 目录下
  const projectRoot = '/Users/caihongjia/saasfly';
  return `vscode://file${projectRoot}/${location.file}:${location.line}`;
}

/**
 * 构建 WebStorm URL
 */
function buildWebStormUrl(location: SourceLocation): string {
  return `webstorm://open?file=${location.file}&line=${location.line}`;
}

/**
 * 打开源码文件
 */
function openSourceFile(location: SourceLocation, editor: 'vscode' | 'webstorm' = 'vscode') {
  let url: string;
  
  switch (editor) {
    case 'webstorm':
      url = buildWebStormUrl(location);
      break;
    case 'vscode':
    default:
      url = buildVSCodeUrl(location);
      break;
  }
  
  try {
    window.open(url, '_blank');
  } catch (error) {
    console.warn('无法打开编辑器，请确保已安装相应的编辑器并配置了协议支持');
    console.log(`源码位置: ${location.file}:${location.line}`);
  }
}

/**
 * 初始化开发工具
 */
export function initDevTools() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  console.log('🛠️  开发工具已启动');
  console.log('快捷键: Alt + Shift + S 打开选中元素的源码');
  console.log('右键菜单: Alt + 右键点击 直接打开源码');
  console.log('点击带有源码位置的元素可直接跳转');
  
  // 添加键盘快捷键支持
  document.addEventListener('keydown', (event) => {
    // Alt + Shift + S 打开源码
    if (event.altKey && event.shiftKey && event.key === 'S') {
      event.preventDefault();
      
      // 获取当前选中的元素
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const element = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE 
          ? range.commonAncestorContainer as Element
          : range.commonAncestorContainer.parentElement;
          
        if (element) {
          const location = parseSourceLocation(element);
          if (location) {
            openSourceFile(location);
          }
        }
      }
    }
  });
  
  // 添加右键菜单支持
  document.addEventListener('contextmenu', (event) => {
    const target = event.target as Element;
    const location = parseSourceLocation(target);
    
    if (location) {
      // 可以在这里添加自定义右键菜单
      console.log('源码位置:', `${location.file}:${location.line}`);
      
      // 按住 Alt 键点击右键可以直接打开
      if (event.altKey) {
        event.preventDefault();
        openSourceFile(location);
      }
    }
  });
  
  // 添加点击事件支持 - 改进版
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    
    // 检查点击的元素或其父元素是否有源码位置信息
    let elementWithSource: Element | null = target;
    while (elementWithSource) {
      const location = parseSourceLocation(elementWithSource);
      if (location) {
        // 按住 Alt 键点击可直接打开
        if (event.altKey) {
          event.preventDefault();
          openSourceFile(location);
          break;
        }
      }
      elementWithSource = elementWithSource.parentElement;
    }
    
    // 如果点击的是开发工具指示器
    if (target.classList.contains('dev-tools-indicator')) {
      const location = parseSourceLocation(target);
      if (location) {
        openSourceFile(location);
      }
    }
  });
  
  // 添加鼠标悬停效果
  document.addEventListener('mouseover', (event) => {
    const target = event.target as Element;
    
    // 检查元素是否有源码位置信息
    let elementWithSource: Element | null = target;
    while (elementWithSource) {
      const location = parseSourceLocation(elementWithSource);
      if (location) {
        // 添加视觉提示
        elementWithSource.style.outline = '2px solid #3b82f6';
        elementWithSource.style.outlineOffset = '2px';
        elementWithSource.title = `按住 Alt 点击跳转到源码: ${location.file}:${location.line}`;
        
        // 鼠标离开时移除效果
        const leaveHandler = () => {
          elementWithSource!.style.outline = '';
          elementWithSource!.style.outlineOffset = '';
          elementWithSource!.removeEventListener('mouseleave', leaveHandler);
        };
        elementWithSource.addEventListener('mouseleave', leaveHandler);
        break;
      }
      elementWithSource = elementWithSource.parentElement;
    }
  });
}

/**
 * 为元素添加源码位置指示器
 */
export function addSourceIndicator(element: Element, location: SourceLocation) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  const indicator = document.createElement('div');
  indicator.className = 'dev-tools-indicator';
  indicator.style.cssText = `
    position: absolute;
    top: -5px;
    right: -5px;
    width: 10px;
    height: 10px;
    background-color: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
    opacity: 0.7;
    transition: opacity 0.2s;
  `;
  indicator.setAttribute('data-source-file', location.file);
  indicator.setAttribute('data-source-line', location.line.toString());
  indicator.title = `${location.file}:${location.line}`;
  
  indicator.addEventListener('mouseenter', () => {
    indicator.style.opacity = '1';
  });
  
  indicator.addEventListener('mouseleave', () => {
    indicator.style.opacity = '0.7';
  });
  
  element.style.position = 'relative';
  element.appendChild(indicator);
}

// 自动初始化（如果运行在浏览器中）
if (typeof window !== 'undefined') {
  initDevTools();
}