"use client";

import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "~/lib/get-dictionary";
import { Button } from "@saasfly/ui/button";

import type { Locale } from "~/config/i18n-config";

export default function ImagePromptPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  // 客户端组件不能使用async，我们使用useEffect来获取字典
  // 为简单起见，暂时使用硬编码的文本
  
  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #fff;
          --muted: #6b7280;
          --text: #07102a;
          --purple-1: #7f00ff;
          --purple-2: #6a66c4;
          --card-bg: #ffffff;
          --glass: rgba(127,0,255,0.04);
          --radius: 12px;
        }
        
        /* Navigation styles from example.html */
        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--purple-1);
          font-weight: 700;
          font-size: 18px;
        }
        
        .brand svg {
          width: 30px;
          height: 30px;
        }
        
        .main-nav {
          display: flex;
          gap: 22px;
          align-items: center;
        }
        
        .main-nav a {
          color: var(--muted);
          font-weight: 600;
          font-size: 15px;
          padding: 8px 6px;
          position: relative;
          text-decoration: none;
        }
        
        .main-nav a.active {
          color: var(--purple-1);
        }
        
        .main-nav a.active::after {
          content: "";
          height: 3px;
          width: 28px;
          background: var(--purple-1);
          border-radius: 3px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -12px;
        }
        
        .nav-right {
          display: flex;
          gap: 12px;
          align-items: center;
          color: var(--purple-1);
          font-weight: 600;
        }
        
        /* Hero styles from example.html */
        .hero {
          width: 100%;
          background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(245,240,255,0.9) 35%, rgba(245,240,255,0.85) 55%, rgba(245,240,255,0.9) 75%);
          padding: 56px 20px 64px;
          border-radius: 14px;
          margin-top: 8px;
          text-align: center;
        }
        
        .hero-inner {
          max-width: 980px;
          margin: 0 auto;
          padding-top: 8px;
        }
        
        .hero-title {
          font-size: 64px;
          line-height: 0.98;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        
        .hero-title .highlight {
          background: linear-gradient(90deg, var(--purple-1), var(--purple-2));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          padding-left: 6px;
          padding-right: 6px;
        }
        
        .hero-sub {
          color: var(--muted);
          font-size: 16px;
          margin-bottom: 22px;
        }
        
        .hero-cta {
          display: inline-flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          margin-bottom: 34px;
        }
        
        .btn {
          border-radius: 10px;
          padding: 10px 18px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          border: 0;
        }
        
        .btn-primary {
          background: linear-gradient(90deg, var(--purple-1), var(--purple-2));
          color: #fff;
          box-shadow: 0 8px 26px rgba(106,102,196,0.12);
        }
        
        .btn-outline {
          background: transparent;
          color: var(--purple-1);
          border: 2px solid rgba(127,0,255,0.12);
          padding: 9px 18px;
        }
        
        /* Card styles from example.html */
        .cards-row {
          display: flex;
          gap: 18px;
          justify-content: center;
          margin-top: 18px;
          flex-wrap: wrap;
        }
        
        .card {
          width: 240px;
          background: var(--card-bg);
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 10px 30px rgba(15,23,42,0.04);
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border: 1px solid rgba(15,23,42,0.03);
        }
        
        .card .icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, var(--purple-1), var(--purple-2));
          color: #fff;
          font-weight: 700;
          box-shadow: 0 8px 18px rgba(127,0,255,0.12);
        }
        
        .card h4 {
          font-size: 15px;
          margin-top: 6px;
          color: var(--text);
          font-weight: 700;
        }
        
        .card p {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.45;
          margin-top: 6px;
        }
        
        /* Responsive styles */
        @media (max-width: 1100px) {
          .hero-title { font-size: 48px; }
          .card { width: 210px; }
        }
        
        @media (max-width: 720px) {
          .site-header { padding: 14px; }
          .main-nav { display: none; }
          .hero-title { font-size: 34px; }
          .cards-row { justify-content: center; gap: 12px; }
          .card { width: 90%; max-width: 420px; }
        }
      `}</style>

      {/* 导航条 - Replicated from example.html */}
      <header className="site-header" role="banner">
        <div className="brand">
          {/* simple logo svg similar to site */}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" stroke="none" fill="rgba(127,0,255,0.12)"></rect>
            <path d="M7 14l3.5-4.5L13 14l3-4" stroke="none" fill="var(--purple-1)" opacity="0.95"></path>
          </svg>
          ImagePrompt.org
        </div>

        <nav className="main-nav" role="navigation" aria-label="Main">
          <Link href="/" className="active">Home</Link>
          <Link href="/inspiration">Inspiration</Link>
          <Link href="/tutorials">Tutorials</Link>
          <Link href="/tools">Tools ▾</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>

        <div className="nav-right" aria-hidden="true">
          {/* small icons */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{opacity: 0.9}}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" /></svg>
          <Link href="/auth/login" style={{fontSize: '14px', color: 'var(--purple-1)', fontWeight: '700'}}>Login</Link>
        </div>
      </header>

      {/* Hero 区 - Replicated from example.html */}
      <section className="hero" role="region" aria-label="Hero">
        <div className="hero-inner">
          <h1 className="hero-title">Create Better AI Art<br />with <span className="highlight">Image Prompt</span></h1>
          <div className="hero-sub">Inspire ideas, Enhance image prompt, Create masterpieces</div>
          <div className="hero-cta">
            <Link href="/ai-image-generator" className="btn btn-primary">Try it now !</Link>
            <Link href="/tutorials" className="btn btn-outline">Tutorials</Link>
          </div>

          {/* cards displayed below hero title */}
          <div className="cards-row" aria-hidden="false">
            <div className="card" role="article" aria-label="Image to Prompt">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  {/* small image icon */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7a2 2 0 0 1 2-2h12" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>Image to Prompt</h4>
                  <p>Convert Image to Prompt to generate your own image</p>
                </div>
              </div>
            </div>

            <div className="card" role="article" aria-label="Magic Enhance">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>Magic Enhance</h4>
                  <p>Transform simple text into detailed, descriptive image prompt</p>
                </div>
              </div>
            </div>

            <div className="card" role="article" aria-label="AI Describe Image">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6"/></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>AI Describe Image</h4>
                  <p>Let AI help you understand and analyze any image in detail</p>
                </div>
              </div>
            </div>

            <div className="card" role="article" aria-label="AI Image Generator">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4z" stroke="#fff" strokeWidth="1.6" /></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>AI Image Generator</h4>
                  <p>Transform your image prompt into stunning visuals with AI-powered generation</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 工具区域 - 使用示例.html的样式 */}
      <section className="w-full bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[48px] text-center text-[#020817] mb-6 font-bold" style={{fontFamily: 'DM Sans, sans-serif'}}>AI Powered Image Prompt Tools</h2>
          <p className="text-center text-[16px] text-[#6b7280] mb-12 max-w-3xl mx-auto" style={{fontFamily: 'DM Sans, sans-serif'}}>
            A complete suite of AI tools covering every aspect of your image creation journey
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card" role="article">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7a2 2 0 0 1 2-2h12" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>Image to Prompt</h4>
                  <p>Transform your image into detailed image prompt with Image to Prompt, enhancing your creative process and optimizing AI-driven design efficiency.</p>
                  <Link href="/image-to-prompt" className="btn btn-primary" style={{marginTop: '12px', fontSize: '13px', padding: '8px 14px'}}>
                    Generate Prompt
                  </Link>
                </div>
              </div>
            </div>

            <div className="card" role="article">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>Image Prompt Generator</h4>
                  <p>Enhance your AI image generation with our Image Prompt Generator. Turn your idea into detailed, AI-optimized prompts, whether you're fluent in English or not.</p>
                  <Link href="/image-prompt-generator" className="btn btn-primary" style={{marginTop: '12px', fontSize: '13px', padding: '8px 14px'}}>
                    Generate Prompt
                  </Link>
                </div>
              </div>
            </div>

            <div className="card" role="article">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>AI Image Generator</h4>
                  <p>Use Image Prompt to effortlessly generate stunning images, enhancing creativity and streamlining your design process with AI-powered precision.</p>
                  <Link href="/ai-image-generator" className="btn btn-primary" style={{marginTop: '12px', fontSize: '13px', padding: '8px 14px'}}>
                    Generate Image Now!
                  </Link>
                </div>
              </div>
            </div>

            <div className="card" role="article">
              <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#fff" strokeWidth="1.6"/></svg>
                </div>
                <div style={{flex: 1}}>
                  <h4>AI Describe Image</h4>
                  <p>Let AI help you understand any image - get detailed descriptions, recognize objects, or ask your own questions</p>
                  <Link href="/describe-image" className="btn btn-primary" style={{marginTop: '12px', fontSize: '13px', padding: '8px 14px'}}>
                    Generate Description
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration 区 - 简化设计，保持一致性 */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-[48px] text-[#020817] mb-6 font-bold" style={{fontFamily: 'DM Sans, sans-serif'}}>Inspiration from Image Prompt</h2>
          <p className="text-center text-[16px] text-[#6b7280] mb-12 max-w-3xl mx-auto" style={{fontFamily: 'DM Sans, sans-serif'}}>Explore a world of visual inspiration with our AI-generated images</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[ 
              { title: "3D Animation", icon: "🎲" },
              { title: "Bauhaus", icon: "🏛️" },
              { title: "Doodle Art", icon: "✏️" },
              { title: "Photography", icon: "📸" }
            ].map((item, index) => (
              <div key={index} className="card" role="article">
                <div className="icon" aria-hidden="true" style={{marginBottom: '12px'}}>{item.icon}</div>
                <h4>{item.title}</h4>
              </div>
            ))}
          </div>
          
          <Link href="/inspiration" className="btn btn-primary">
            Explore More
          </Link>
        </div>
      </section>

      {/* FAQ 区 - 简化设计 */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[48px] text-center text-[#020817] mb-6 font-bold" style={{fontFamily: 'DM Sans, sans-serif'}}>Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                title: "What is an Image Prompt?",
                content: "An Image Prompt is a set of instructions or words given to an AI to create a picture. It tells the AI what kind of image you want, like describing a scene or object. By using Image Prompt, you can help the AI make images that match your ideas or needs."
              },
              {
                title: "What is the role of image prompt in AI image generation?",
                content: "Image prompt plays a crucial role in AI image generation by guiding the AI model to create specific images. They serve as instructions that define the content, style, and details of the desired image."
              },
              {
                title: "How do I create an effective image prompt?",
                content: "To create an effective image prompt, be specific about what you want, include details about style, colors, lighting, and composition. Use descriptive adjectives and avoid ambiguous terms."
              },
              {
                title: "Can I use Image Prompt for commercial projects?",
                content: "Yes, you can use Image Prompt for commercial projects. Our generated prompts are royalty-free and can be used for both personal and commercial purposes."
              }
            ].map((faq, index) => (
              <div key={index} className="card">
                <h4 style={{marginBottom: '12px'}}>{faq.title}</h4>
                <p>{faq.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - 简化设计 */}
      <footer className="w-full border-t border-[#e2e8f0] bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {[
              "Tools", "Image to Prompt", "Batch Image to Prompt", "AI Describe Image",
              "Image Prompt Generator", "AI Image Generator", "About Us",
              "Contact Us", "API", "Pricing", "Privacy Policy", "Terms & Conditions"
            ].map((link, index) => (
              <Link key={index} href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-[14px] text-[#4a5568] hover:text-[#7f00ff] transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div className="text-center mb-6">
            <select defaultValue="en" className="px-3 py-2 border border-[#cbd5e0] rounded-md bg-white text-sm">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">简体中文</option>
              <option value="zh-TW">繁體中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <p className="text-center text-[14px] text-[#718096]">© 2025 EchoFlow, LLC. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}