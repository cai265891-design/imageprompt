import React from 'react';

// ImagePrompt.org UI 复刻组件
const ImagePromptClone = () => {
  return (
    <div className="min-h-screen bg-white font-['DM_Sans',_sans-serif]">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h14V7l-7-5z"/>
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">ImagePrompt.org</span>
            </div>
            
            {/* 导航菜单 */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Inspiration</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Tutorials</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Tools</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Pricing</a>
            </div>
            
            {/* 右侧按钮 */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </button>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Login</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="relative bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* 主标题 */}
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create Better AI Art with Image Prompt
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Inspire ideas, Enhance image prompt, Create masterpieces
            </p>
            
            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors duration-200">
                Try it now !
              </button>
              <button className="text-gray-900 hover:text-gray-700 font-medium text-lg">
                Tutorials
              </button>
            </div>
            
            {/* 工具卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {/* Image to Prompt */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Image to Prompt</h3>
                <p className="text-gray-600 text-sm mb-4">Convert Image to Prompt to generate your own image</p>
              </div>
              
              {/* Magic Enhance */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Magic Enhance</h3>
                <p className="text-gray-600 text-sm mb-4">Transform simple text into detailed, descriptive image prompt</p>
              </div>
              
              {/* AI Describe Image */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Describe Image</h3>
                <p className="text-gray-600 text-sm mb-4">Let AI help you understand and analyze any image in detail</p>
              </div>
              
              {/* AI Image Generator */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Image Generator</h3>
                <p className="text-gray-600 text-sm mb-4">Transform your image prompt into stunning visuals with AI-powered generation</p>
              </div>
            </div>
            
            {/* 相关链接 */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">You may be interested in:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">What is an Image Prompt?</a>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">How to Write Effective Image Prompt?</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 工具区域 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Powered Image Prompt Tools</h2>
            <p className="text-xl text-gray-600">A complete suite of AI tools covering every aspect of your image creation journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 工具卡片 */}
            {[
              {
                title: "Image to Prompt",
                description: "Transform your image into detailed image prompt with Image to Prompt, enhancing your creative process and optimizing AI-driven design efficiency.",
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              },
              {
                title: "Image Prompt Generator",
                description: "Enhance your AI image generation with our Image Prompt Generator. Turn your idea into detailed, AI-optimized prompts, whether you're fluent in English or not.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              {
                title: "AI Image Generator",
                description: "Use Image Prompt to effortlessly generate stunning images, enhancing creativity and streamlining your design process with AI-powered precision.",
                icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              },
              {
                title: "AI Describe Image",
                description: "Let AI help you understand any image - get detailed descriptions, recognize objects, or ask your own questions",
                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              }
            ].map((tool, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    {tool.title === "AI Image Generator" ? "Generate Image Now!" : "Generate Prompt"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo 和版权 */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h14V7l-7-5z"/>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900">ImagePrompt.org</span>
              </div>
              <p className="text-gray-600 text-sm">© 2025 EchoFlow, LLC. All rights reserved.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* 工具链接 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Tools</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Image to Prompt</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Batch Image to Prompt</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">AI Describe Image</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Image Prompt Generator</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">AI Image Generator</a></li>
              </ul>
            </div>
            
            {/* 支持链接 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Affiliate Program</a></li>
              </ul>
            </div>
            
            {/* 法律链接 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms and conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Refund policy</a></li>
              </ul>
            </div>
          </div>
          
          {/* 语言选择器 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4">
              {['English', 'Español', 'Français', 'Deutsch', 'Português', '简体中文', '繁體中文', 'العربية', 'Русский', 'Italiano', '日本語', '한국어'].map((lang) => (
                <a key={lang} href="#" className="text-gray-600 hover:text-gray-900 text-sm">{lang}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImagePromptClone;

// Tailwind CSS 配置
export const imagePromptTheme = {
  // 颜色方案
  colors: {
    primary: '#7f00ff',      // 主紫色
    background: '#ffffff',   // 白色背景
    textPrimary: '#020817',  // 主文字颜色
    textSecondary: '#64748b', // 次要文字
    border: '#e2e8f0',       // 边框颜色
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    }
  },
  
  // 字体配置
  fontFamily: {
    sans: ['DM Sans', 'sans-serif'],
  },
  
  // 字体大小
  fontSize: {
    'hero': '72px',      // Hero 标题
    'section': '48px',   // 区域标题
    'body': '16px',      // 正文字体
    'button': '16px',    // 按钮字体
  },
  
  // 圆角配置
  borderRadius: {
    'button': '4px',     // 按钮圆角
    'card': '8px',       // 卡片圆角
  },
  
  // 阴影配置
  boxShadow: {
    'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }
};

// 响应式断点
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};