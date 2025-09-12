/**
 * Babel 插件 - 自动注入源码位置信息
 * 用于开发模式下在组件上添加 filePath 和 lineNumber 属性
 */

module.exports = function babelPluginSourceLocation() {
  return {
    name: 'source-location',
    visitor: {
      JSXOpeningElement(path, state) {
        const node = path.node;
        const filename = state.filename || '';
        const location = node.loc;
        
        // 只在开发环境下生效
        if (process.env.NODE_ENV !== 'development') {
          return;
        }
        
        // 跳过已经有的 DevTools 组件
        if (node.name.name === 'DevTools') {
          return;
        }
        
        // 获取相对于项目根目录的路径
        const projectRoot = process.cwd();
        const relativePath = filename.replace(projectRoot + '/', '');
        
        if (location) {
          // 添加 data 属性来存储源码位置
          const filePathAttr = {
            type: 'JSXAttribute',
            name: { type: 'JSXIdentifier', name: 'data-source-file' },
            value: {
              type: 'Literal',
              value: relativePath
            }
          };
          
          const lineNumberAttr = {
            type: 'JSXAttribute',
            name: { type: 'JSXIdentifier', name: 'data-source-line' },
            value: {
              type: 'Literal',
              value: location.start.line
            }
          };
          
          // 检查是否已经有这些属性
          const hasFilePath = node.attributes.some(attr => 
            attr.name && attr.name.name === 'data-source-file'
          );
          const hasLineNumber = node.attributes.some(attr => 
            attr.name && attr.name.name === 'data-source-line'
          );
          
          if (!hasFilePath) {
            node.attributes.push(filePathAttr);
          }
          if (!hasLineNumber) {
            node.attributes.push(lineNumberAttr);
          }
        }
      }
    }
  };
};