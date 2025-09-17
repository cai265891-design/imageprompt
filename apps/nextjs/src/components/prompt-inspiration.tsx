"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { Badge } from "@saasfly/ui/badge";
import { Button } from "@saasfly/ui/button";
import Image from "next/image";
import { Heart, Bookmark, Share2, Eye } from "lucide-react";
import { useState } from "react";

const inspirations = [
  {
    id: 1,
    title: "Cyberpunk Cityscape",
    prompt: "Futuristic cyberpunk city at night, neon lights reflecting on wet streets, flying cars, holographic advertisements, ultra detailed, cinematic lighting, 8k resolution",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Sci-Fi",
    likes: 2341,
    views: 15420,
    model: "MidJourney V6",
  },
  {
    id: 2,
    title: "Fantasy Forest Realm",
    prompt: "Enchanted forest with glowing mushrooms, magical creatures, ancient trees with twisted roots, misty atmosphere, ethereal lighting, fantasy art style, highly detailed",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Fantasy",
    likes: 1892,
    views: 12300,
    model: "DALL-E 3",
  },
  {
    id: 3,
    title: "Portrait in Renaissance Style",
    prompt: "Portrait of a noble woman in Renaissance style, oil painting technique, Rembrandt lighting, intricate clothing details, classical composition, museum quality",
    image: "https://images.unsplash.com/photo-1572383672419-ab35444a6934?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Portrait",
    likes: 3102,
    views: 18900,
    model: "Stable Diffusion XL",
  },
  {
    id: 4,
    title: "Abstract Cosmic Journey",
    prompt: "Abstract representation of cosmic energy, swirling galaxies, vibrant nebula colors, fractal patterns, space dust particles, otherworldly atmosphere, digital art",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Abstract",
    likes: 1567,
    views: 9800,
    model: "Flux Pro",
  },
  {
    id: 5,
    title: "Japanese Garden Serenity",
    prompt: "Traditional Japanese zen garden, cherry blossoms in full bloom, koi pond with crystal clear water, wooden bridge, pagoda in background, golden hour lighting, photorealistic",
    image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Nature",
    likes: 2789,
    views: 16700,
    model: "MidJourney V6",
  },
  {
    id: 6,
    title: "Steampunk Inventor's Workshop",
    prompt: "Victorian era inventor's workshop, brass gears and clockwork mechanisms, steam pipes, leather bound books, warm candlelight, intricate mechanical devices, atmospheric",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Steampunk",
    likes: 2156,
    views: 13400,
    model: "DALL-E 3",
  },
  {
    id: 7,
    title: "Dragon's Mountain Lair",
    prompt: "Ancient dragon perched on mountain peak, scales shimmering in moonlight, treasure scattered around, misty valleys below, epic fantasy art, highly detailed scales and wings",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc31?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Fantasy",
    likes: 3456,
    views: 21000,
    model: "MidJourney V6",
  },
  {
    id: 8,
    title: "Underwater Atlantis City",
    prompt: "Lost city of Atlantis underwater, bioluminescent sea life, ancient architecture with coral growth, rays of sunlight penetrating water, mysterious atmosphere, photorealistic rendering",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Sci-Fi",
    likes: 2890,
    views: 17600,
    model: "Stable Diffusion XL",
  },
  {
    id: 9,
    title: "Northern Lights Over Mountains",
    prompt: "Aurora borealis dancing over snow-capped mountains, pristine wilderness, starry night sky, frozen lake reflection, vibrant green and purple lights, National Geographic style photography",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Nature",
    likes: 4123,
    views: 25800,
    model: "DALL-E 3",
  },
  {
    id: 10,
    title: "Geometric Digital Art",
    prompt: "Complex geometric patterns, sacred geometry, fractal designs, vibrant gradient colors, mathematical precision, modern digital art style, 3D rendered with glowing edges",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Abstract",
    likes: 1789,
    views: 11200,
    model: "Flux Pro",
  },
  {
    id: 11,
    title: "Medieval Knight Portrait",
    prompt: "Battle-worn knight in shining armor, dramatic lighting, weathered face with noble expression, castle battlements in background, oil painting style, hyper-realistic details",
    image: "https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Portrait",
    likes: 2567,
    views: 15900,
    model: "MidJourney V6",
  },
  {
    id: 12,
    title: "Clockwork Time Machine",
    prompt: "Intricate time machine with brass gears, copper pipes, Victorian engineering, steam punk aesthetic, glowing energy core, leather and wood details, industrial revolution era design",
    image: "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=400&h=300&fit=crop&auto=format&q=80",
    category: "Steampunk",
    likes: 3234,
    views: 19700,
    model: "Stable Diffusion XL",
  },
];

const categories = ["All", "Sci-Fi", "Fantasy", "Portrait", "Abstract", "Nature", "Steampunk"];

export function PromptInspiration() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const filteredInspirations = selectedCategory === "All"
    ? inspirations
    : inspirations.filter(item => item.category === selectedCategory);

  const handleLike = (id: number) => {
    setLikedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 px-4 bg-secondary/10">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Inspiration from Image Prompt
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our curated collection of successful prompts and their stunning results.
            Get inspired and learn from the community's best creations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInspirations.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button size="sm" variant="secondary" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.model}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={likedItems.includes(item.id) ? "text-red-500" : ""}
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart className={`w-4 h-4 ${likedItems.includes(item.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 text-sm mb-3">
                  {item.prompt}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {item.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views.toLocaleString()}
                    </span>
                  </div>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Copy Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">
            Load More Inspirations
          </Button>
        </div>
      </div>
    </section>
  );
}