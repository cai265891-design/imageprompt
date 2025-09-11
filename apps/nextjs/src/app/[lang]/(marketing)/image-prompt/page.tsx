import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "~/lib/get-dictionary";

import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";

import type { Locale } from "~/config/i18n-config";

export default async function ImagePromptPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-transparent to-[rgba(var(--colors-primary-rgb),0.05)] py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-8 text-6xl font-bold tracking-tight text-[var(--colors-foreground)] md:text-7xl lg:text-7xl" style={{fontFamily: 'DM Sans, sans-serif', lineHeight: '1.1'}}>
              AI 图像提示词生成器
            </h1>
            <p className="mb-12 text-xl text-[var(--colors-muted-foreground)]" style={{fontSize: '18px', lineHeight: '1.6'}}>
              释放你的创造力，用AI生成令人惊叹的图像。我们的提示词生成器帮助你创建完美的提示词，让AI为你创造独特的艺术作品。
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/generate">
                <Button className="bg-[var(--colors-primary)] hover:bg-[var(--colors-primary)]/90 text-[var(--colors-primary-foreground)] px-8 py-4 text-base font-medium rounded transition-all duration-200 flex items-center gap-2" style={{borderRadius: '4px'}}>
                  开始生成
                  <Icons.Sparkles className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button variant="outline" className="px-8 py-4 text-base font-medium rounded border-[var(--colors-border)] text-[var(--colors-foreground)] hover:bg-[var(--colors-graybackground)] transition-all duration-200 flex items-center gap-2" style={{borderRadius: '4px'}}>
                  查看示例
                  <Icons.Image className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--colors-background)] py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-20">
            <h2 className="mb-4 text-4xl font-bold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
              强大的功能
            </h2>
            <p className="text-xl text-[var(--colors-muted-foreground)]" style={{fontSize: '18px'}}>
              让你的创意无限发挥
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 bg-[var(--colors-card)] border-[var(--colors-border)]" style={{borderRadius: '8px', backgroundColor: '#f8fafc'}}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{backgroundColor: 'rgba(var(--colors-primary-rgb), 0.1)'}}>
                <Icons.Sparkles className="h-5 w-5" style={{color: 'var(--colors-primary)'}} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
                智能提示词生成
              </h3>
              <p className="text-[var(--colors-muted-foreground)]" style={{fontSize: '16px', lineHeight: '1.5'}}>
                AI驱动的提示词生成器，帮助你创建完美的图像描述
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 bg-[var(--colors-card)] border-[var(--colors-border)]" style={{borderRadius: '8px', backgroundColor: '#f8fafc'}}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{backgroundColor: 'rgba(var(--colors-success-rgb), 0.1)'}}>
                <Icons.Palette className="h-5 w-5" style={{color: 'var(--colors-success)'}} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
                多种艺术风格
              </h3>
              <p className="text-[var(--colors-muted-foreground)]" style={{fontSize: '16px', lineHeight: '1.5'}}>
                支持写实、动漫、抽象、油画等多种艺术风格
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 bg-[var(--colors-card)] border-[var(--colors-border)]" style={{borderRadius: '8px', backgroundColor: '#f8fafc'}}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{backgroundColor: 'rgba(var(--colors-destructive-rgb), 0.1)'}}>
                <Icons.Lightning className="h-5 w-5" style={{color: 'var(--colors-destructive)'}} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
                快速生成
              </h3>
              <p className="text-[var(--colors-muted-foreground)]" style={{fontSize: '16px', lineHeight: '1.5'}}>
                几秒钟内生成高质量图像，支持批量处理
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 bg-[var(--colors-card)] border-[var(--colors-border)]" style={{borderRadius: '8px', backgroundColor: '#f8fafc'}}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{backgroundColor: 'rgba(var(--colors-secondary-foreground-rgb), 0.1)'}}>
                <Icons.Heart className="h-5 w-5" style={{color: 'var(--colors-secondary-foreground)'}} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
                社区分享
              </h3>
              <p className="text-[var(--colors-muted-foreground)]" style={{fontSize: '16px', lineHeight: '1.5'}}>
                与社区分享你的创作，获得灵感和反馈
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 bg-[var(--colors-card)] border-[var(--colors-border)]" style={{borderRadius: '8px', backgroundColor: '#f8fafc'}}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{backgroundColor: 'rgba(var(--colors-accent-foreground-rgb), 0.1)'}}>
                <Icons.Edit className="h-5 w-5" style={{color: 'var(--colors-accent-foreground)'}} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
                实时编辑
              </h3>
              <p className="text-[var(--colors-muted-foreground)]" style={{fontSize: '16px', lineHeight: '1.5'}}>
                实时预览和编辑提示词，即时看到效果
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 bg-[var(--colors-card)] border-[var(--colors-border)]" style={{borderRadius: '8px', backgroundColor: '#f8fafc'}}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg" style={{backgroundColor: 'rgba(var(--colors-muted-foreground-rgb), 0.1)'}}>
                <Icons.Download className="h-5 w-5" style={{color: 'var(--colors-muted-foreground)'}} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
                高清下载
              </h3>
              <p className="text-[var(--colors-muted-foreground)]" style={{fontSize: '16px', lineHeight: '1.5'}}>
                支持高清图像下载，适用于各种用途
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--colors-background)]">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-[var(--colors-foreground)]" style={{fontFamily: 'DM Sans, sans-serif'}}>
              准备好开始创作了吗？
            </h2>
            <p className="mb-8 text-xl text-[var(--colors-muted-foreground)]" style={{fontSize: '18px'}}>
              加入数万创作者的行列，用AI创造令人惊叹的艺术作品
            </p>
            <Link href="/generate">
              <Button className="bg-[var(--colors-primary)] hover:bg-[var(--colors-primary)]/90 text-[var(--colors-primary-foreground)] px-8 py-4 text-base font-medium rounded transition-all duration-200 flex items-center gap-2 mx-auto" style={{borderRadius: '4px'}}>
                免费开始创作
                <Icons.ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[var(--colors-background)] py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 text-center md:grid-cols-3">
            <div>
              <div className="mb-4 text-5xl font-bold" style={{color: 'var(--colors-primary)', fontFamily: 'DM Sans, sans-serif'}}>
                100K+
              </div>
              <div className="text-lg text-[var(--colors-muted-foreground)]" style={{fontSize: '18px'}}>
                生成的图像
              </div>
            </div>
            <div>
              <div className="mb-4 text-5xl font-bold" style={{color: 'var(--colors-success)', fontFamily: 'DM Sans, sans-serif'}}>
                50K+
              </div>
              <div className="text-lg text-[var(--colors-muted-foreground)]" style={{fontSize: '18px'}}>
                活跃用户
              </div>
            </div>
            <div>
              <div className="mb-4 text-5xl font-bold" style={{color: 'var(--colors-destructive)', fontFamily: 'DM Sans, sans-serif'}}>
                200+
              </div>
              <div className="text-lg text-[var(--colors-muted-foreground)]" style={{fontSize: '18px'}}>
                艺术风格
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}