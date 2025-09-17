"use client";

/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { useParams } from "next/navigation";

import type { Locale } from "~/config/i18n-config";
import { AIPromptTools } from "~/components/ai-prompt-tools";
import { PromptInspiration } from "~/components/prompt-inspiration";
import { PromptFAQ } from "~/components/prompt-faq";

export default function ImagePromptPage() {
  const params = useParams();
  const lang = params?.lang as Locale;
  
  return (
    <div>
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
      <section className="hero" aria-label="Hero">
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
              Try it now!
            </Link>
            <Link href="/zh/tutorials" className="btn btn-outline">
              Tutorials
            </Link>
          </div>

          {/* cards displayed below hero title */}
          <div className="cards-row" aria-hidden="false">
            <div className="card" aria-label="Image to Prompt">
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 8l-5-5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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

            <div className="card" aria-label="Magic Enhance">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  {/* Prompt Enhancer 图标 - 增强 */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Magic Enhance</h4>
                  <p>Enhance your prompts with AI-powered magic</p>
                </div>
              </div>
            </div>

            <div className="card" aria-label="Community Gallery">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon" aria-hidden="true">
                  {/* Community 图标 - 社区 */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21v-2a4 4 0 0 0-3-3.87"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.13a4 4 0 0 1 0 7.75"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Community Gallery</h4>
                  <p>Share and explore amazing AI creations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Powered Image Prompt Tools 部分 */}
      <AIPromptTools />

      {/* Inspiration from Image Prompt 部分 */}
      <PromptInspiration />

      {/* Frequently Asked Questions 部分 */}
      <PromptFAQ />
    </div>
  );
}