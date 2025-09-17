"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@saasfly/ui/accordion";
import { Card } from "@saasfly/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    id: "1",
    question: "What is an AI image prompt?",
    answer: "An AI image prompt is a text description that tells an AI model what kind of image to generate. It includes details about the subject, style, composition, lighting, and other artistic elements. A good prompt is specific, descriptive, and uses terminology that the AI model understands to produce the desired visual output."
  },
  {
    id: "2",
    question: "How do I write effective prompts for AI image generation?",
    answer: "Effective prompts should be specific and detailed. Start with the main subject, then add style descriptions (e.g., 'oil painting', 'photorealistic'), composition details (e.g., 'close-up', 'wide angle'), lighting (e.g., 'golden hour', 'dramatic shadows'), and mood or atmosphere. Include negative prompts to exclude unwanted elements. Use commas to separate different aspects and prioritize important elements by mentioning them first."
  },
  {
    id: "3",
    question: "What's the difference between MidJourney, DALL-E, and Stable Diffusion prompts?",
    answer: "Each AI model has its own strengths and prompt syntax. MidJourney excels at artistic and stylized images, responding well to style references and parameters like --ar for aspect ratio. DALL-E 3 understands natural language better and handles complex scenes well. Stable Diffusion offers more control with weights and negative prompts, and supports various models and LoRAs for specific styles. Our tools help optimize prompts for each platform's unique characteristics."
  },
  {
    id: "4",
    question: "Can I use the same prompt across different AI platforms?",
    answer: "While basic prompts can work across platforms, each AI model interprets prompts differently. What works perfectly in MidJourney might produce different results in Stable Diffusion. Our Universal Prompt Optimizer tool helps convert and adapt prompts between platforms, adjusting syntax, parameters, and keywords to maintain consistency in your creative vision across different AI models."
  },
  {
    id: "5",
    question: "What are negative prompts and when should I use them?",
    answer: "Negative prompts tell the AI what NOT to include in the generated image. They're particularly useful in Stable Diffusion and some other models. Common negative prompts include 'blurry', 'low quality', 'extra limbs', or specific unwanted elements. Use them when you consistently get unwanted features in your generations or want to refine the output quality."
  },
  {
    id: "6",
    question: "How do style references and artist styles work in prompts?",
    answer: "Style references help AI models understand the artistic direction you want. You can reference art movements ('impressionist', 'art nouveau'), specific artists ('in the style of Van Gogh'), or technical styles ('watercolor', 'digital art', '3D render'). Be aware that some platforms have restrictions on using contemporary artist names. Our Style Transfer tool helps you describe styles effectively without potential issues."
  },
  {
    id: "7",
    question: "What are prompt weights and how do I use them?",
    answer: "Prompt weights allow you to emphasize or de-emphasize certain elements in your prompt. In Stable Diffusion, you can use parentheses (word) to increase weight or [word] to decrease it. Numbers can specify exact weights like (word:1.5). MidJourney uses :: to separate and weight concepts. Weights help you fine-tune the balance of elements in your generated images."
  },
  {
    id: "8",
    question: "Is there a character limit for AI image prompts?",
    answer: "Yes, different platforms have different limits. MidJourney supports up to about 6000 characters, DALL-E 3 handles around 4000 characters, and Stable Diffusion typically works with 75-77 tokens (roughly 250-400 characters, depending on the interface). Our tools help you optimize prompts to fit within these limits while maintaining effectiveness."
  }
];

export function PromptFAQ() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about AI image prompts and how to use our tools effectively
          </p>
        </div>

        <Card className="p-2">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left hover:no-underline px-4">
                  <span className="font-medium pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

      </div>
    </section>
  );
}