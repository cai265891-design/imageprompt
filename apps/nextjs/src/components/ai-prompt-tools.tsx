"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { Button } from "@saasfly/ui/button";
import { Badge } from "@saasfly/ui/badge";
import { ArrowRight, Sparkles, Zap, Palette, Brain, Image, Wand2 } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    id: 1,
    title: "MidJourney Prompt Generator",
    description: "Create detailed and optimized prompts for MidJourney AI art generation with style parameters and artistic references.",
    icon: Wand2,
    tags: ["MidJourney", "Art", "Creative"],
    href: "/zh/image-to-prompt",
    color: "bg-purple-500",
  },
  {
    id: 2,
    title: "DALL-E 3 Prompt Builder",
    description: "Build precise prompts for DALL-E 3 with composition guidelines, lighting setups, and style modifiers.",
    icon: Image,
    tags: ["DALL-E", "OpenAI", "Realistic"],
    href: "/zh/image-to-prompt",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Stable Diffusion Prompt Helper",
    description: "Generate prompts optimized for Stable Diffusion with negative prompts, model-specific tokens, and LoRA suggestions.",
    icon: Brain,
    tags: ["Stable Diffusion", "Open Source", "Technical"],
    href: "/zh/image-to-prompt",
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "Flux AI Prompt Assistant",
    description: "Craft prompts specifically designed for Flux AI with advanced scene composition and photorealistic parameters.",
    icon: Zap,
    tags: ["Flux", "Photorealistic", "Advanced"],
    href: "/zh/image-to-prompt",
    color: "bg-orange-500",
  },
  {
    id: 5,
    title: "Universal Prompt Optimizer",
    description: "Convert and optimize your prompts to work across multiple AI image generation platforms seamlessly.",
    icon: Sparkles,
    tags: ["Universal", "Converter", "Multi-Platform"],
    href: "/zh/image-to-prompt",
    color: "bg-pink-500",
  },
  {
    id: 6,
    title: "Style Transfer Prompt Maker",
    description: "Create prompts that effectively transfer artistic styles from famous artists and art movements to your images.",
    icon: Palette,
    tags: ["Style", "Artistic", "Creative"],
    href: "/zh/image-to-prompt",
    color: "bg-indigo-500",
  },
];

export function AIPromptTools() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Powered Image Prompt Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Unlock your creativity with our suite of AI-powered prompt generation tools.
            Designed for artists, designers, and creators to craft perfect prompts for any AI image model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${tool.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <tool.icon className={`w-6 h-6 ${tool.color.replace('bg-', 'text-')}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={tool.href}>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Try Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? We're constantly adding new tools.
          </p>
          <Button size="lg" variant="outline">
            Request a Tool
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}