"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { DevTools } from "@saasfly/ui";
import type { Locale } from "~/config/i18n-config";

export default function ImagePromptPage() {
  const params = useParams();
  const lang = params?.lang as Locale;
  // 客户端组件不能使用async，我们使用useEffect来获取字典
  // 为简单起见，暂时使用硬编码的文本

  return (
    <DevTools
      filePath="apps/nextjs/src/app/[lang]/(marketing)/image-prompt/page.tsx"
      lineNumber={15}
    >
      <style jsx global>{`
        :root {
          --bg: #fff;
          --muted: #6b7280;
          --text: #07102a;
          --purple-1: #7f00ff;
          --purple-2: #6a66c4;
          --card-bg: #ffffff;
          --glass: rgba(127, 0, 255, 0.04);
          --radius: 12px;
        }

        /* Hero styles from example.html */
        .hero {
          width: 100%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 1) 0%,
            rgba(245, 240, 255, 0.9) 35%,
            rgba(245, 240, 255, 0.85) 55%,
            rgba(245, 240, 255, 0.9) 75%
          );
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
          box-shadow: 0 8px 26px rgba(106, 102, 196, 0.12);
        }

        .btn-outline {
          background: transparent;
          color: var(--purple-1);
          border: 2px solid rgba(127, 0, 255, 0.12);
          padding: 9px 18px;
        }

        /* Card styles from example.html */
        .cards-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
          margin-top: 18px;
          padding: 10px 0;
        }

        .card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border: 1px solid rgba(0, 0, 1, 0.03);
        }

        .card .icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: var(--purple-1);
          font-weight: 700;
          border: 2px solid rgba(127, 0, 255, 0.12);
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
          .hero-title {
            font-size: 48px;
          }
          .card {
            width: 210px;
          }
        }

        @media (max-width: 720px) {
          .site-header {
            padding: 14px;
          }
          .main-nav {
            display: none;
          }
          .hero-title {
            font-size: 34px;
          }
          .cards-row {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
          }
        }
      `}</style>

      {/* Hero 区 - Replicated from example.html */}
      <section className="hero" role="region" aria-label="Hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            Create Better AI Art
            <br />
            with <span className="highlight">Image Prompt</span>
          </h1>
          <div className="hero-sub">
            Inspire ideas, Enhance image prompt, Create masterpieces
          </div>
          <div className="hero-cta">
            <Link href="/zh/image-to-prompt" className="btn btn-primary">
              Try it now !
            </Link>
            <Link href="/zh/tutorials" className="btn btn-outline">
              Tutorials
            </Link>
          </div>

          {/* cards displayed below hero title */}
          <div className="cards-row" aria-hidden="false">
            <div className="card" role="article" aria-label="Image to Prompt">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  {/* Image to Prompt 图标 - 上传/转换 */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <polyline
                      points="7,10 12,15 17,10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="12"
                      y1="15"
                      x2="12"
                      y2="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Image to Prompt</h4>
                  <p>Convert Image to Prompt to generate your own image</p>
                </div>
              </div>
            </div>

            <div className="card" role="article" aria-label="Magic Enhance">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  {/* Magic Enhance 图标 - 魔法星星 */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L9 8l-6 1 4 4-1 6 6-3 6 3-1-6 4-4-6-1z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="rgba(127,0,255,0.1)"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Magic Enhance</h4>
                  <p>
                    Transform simple text into detailed, descriptive image
                    prompt
                  </p>
                </div>
              </div>
            </div>

            <div className="card" role="article" aria-label="AI Describe Image">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  {/* AI Describe Image 图标 - 眼睛/观察 */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M12 1v4m0 14v4m11-7h-4m-14 0H1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.3"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>AI Describe Image</h4>
                  <p>
                    Let AI help you understand and analyze any image in detail
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 工具区域 - 使用示例.html的样式 */}
      <section className="w-full bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2
            className="text-[48px] text-center text-[#020817] mb-6 font-bold"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            AI Powered Image Prompt Tools
          </h2>
          <p
            className="text-center text-[16px] text-[#6b7280] mb-12 max-w-3xl mx-auto"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            A complete suite of AI tools covering every aspect of your image
            creation journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card" role="article">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <polyline
                      points="7,10 12,15 17,10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="12"
                      y1="15"
                      x2="12"
                      y2="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Image to Prompt</h4>
                  <p>
                    Transform your image into detailed image prompt with Image
                    to Prompt, enhancing your creative process and optimizing
                    AI-driven design efficiency.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" role="article">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L9 8l-6 1 4 4-1 6 6-3 6 3-1-6 4-4-6-1z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="rgba(127,0,255,0.1)"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Image Prompt Generator</h4>
                  <p>
                    Enhance your AI image generation with our Image Prompt
                    Generator. Turn your idea into detailed, AI-optimized
                    prompts, whether you're fluent in English or not.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" role="article">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>AI Image Generator</h4>
                  <p>
                    Use Image Prompt to effortlessly generate stunning images,
                    enhancing creativity and streamlining your design process
                    with AI-powered precision.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" role="article">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M12 1v4m0 14v4m11-7h-4m-14 0H1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.3"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>AI Describe Image</h4>
                  <p>
                    Let AI help you understand any image - get detailed
                    descriptions, recognize objects, or ask your own questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration 区 - 简化设计，保持一致性 */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2
            className="text-[48px] text-[#020817] mb-6 font-bold"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Inspiration from Image Prompt
          </h2>
          <p
            className="text-center text-[16px] text-[#6b7280] mb-12 max-w-3xl mx-auto"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Explore a world of visual inspiration with our AI-generated images
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: "3D Animation", icon: "🎲" },
              { title: "Bauhaus", icon: "🏛️" },
              { title: "Doodle Art", icon: "✏️" },
              { title: "Photography", icon: "📸" },
            ].map((item, index) => (
              <div key={index} className="card" role="article">
                <div
                  className="icon"
                  aria-hidden="true"
                  style={{ marginBottom: "12px" }}
                >
                  {item.icon}
                </div>
                <h4>{item.title}</h4>
              </div>
            ))}
          </div>

          <Link href="/zh/image-to-prompt" className="btn btn-primary">
            Explore More
          </Link>
        </div>
      </section>

      {/* FAQ 区 - 简化设计 */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2
            className="text-[48px] text-center text-[#020817] mb-6 font-bold"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Frequently Asked Questions
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                title: "What is an Image Prompt?",
                content:
                  "An Image Prompt is a set of instructions or words given to an AI to create a picture. It tells the AI what kind of image you want, like describing a scene or object. By using Image Prompt, you can help the AI make images that match your ideas or needs.",
              },
              {
                title:
                  "What is the role of image prompt in AI image generation?",
                content:
                  "Image prompt plays a crucial role in AI image generation by guiding the AI model to create specific images. They serve as instructions that define the content, style, and details of the desired image.",
              },
              {
                title: "How do I create an effective image prompt?",
                content:
                  "To create an effective image prompt, be specific about what you want, include details about style, colors, lighting, and composition. Use descriptive adjectives and avoid ambiguous terms.",
              },
              {
                title: "Can I use Image Prompt for commercial projects?",
                content:
                  "Yes, you can use Image Prompt for commercial projects. Our generated prompts are royalty-free and can be used for both personal and commercial purposes.",
              },
            ].map((faq, index) => (
              <div key={index} className="card">
                <h4 style={{ marginBottom: "12px" }}>{faq.title}</h4>
                <p>{faq.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DevTools>
  );
}
