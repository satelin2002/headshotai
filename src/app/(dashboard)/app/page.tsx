"use client";

import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModelStatus } from "@prisma/client";
import { ModelCard } from "@/components/model-card";

// Add example models data
const publicModels = [
  {
    id: "white-women",
    title: "Professional White Woman",
    photoCount: 50,
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    date: "Featured Model",
    status: "ready" as const,
  },
  {
    id: "asian-women",
    title: "Professional Asian Woman",
    photoCount: 50,
    thumbnail: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a",
    date: "Featured Model",
    status: "ready" as const,
  },
  {
    id: "black-women",
    title: "Professional Black Woman",
    photoCount: 50,
    thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    date: "Featured Model",
    status: "ready" as const,
  },
  {
    id: "white-man",
    title: "Professional White Man",
    photoCount: 50,
    thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    date: "Featured Model",
    status: "ready" as const,
  },
  {
    id: "asian-man",
    title: "Professional Asian Man",
    photoCount: 50,
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    date: "Featured Model",
    status: "ready" as const,
  },
  {
    id: "black-man",
    title: "Professional Black Man",
    photoCount: 50,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    date: "Featured Model",
    status: "ready" as const,
  },
];

interface Model {
  id: string;
  title: string;
  photoCount: number;
  status: ModelStatus;
  progress?: number;
  createdAt: string;
  expiresAt: string;
  coverImage?: string;
  generatedPhotos: Array<{ url: string }>;
}

export default function AppPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/models");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load models");
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-950">
      <div className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-10">
        {/* Background gradient effect */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-purple-950/50 to-blue-900/30 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="max-w-screen-2xl mx-auto space-y-12 md:space-y-8">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Your Models
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Create and manage multiple AI models
              </p>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white font-medium relative group overflow-hidden shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              asChild
            >
              <Link href="/app/create">
                <div className="relative flex items-center">
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="relative">New AI Model</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-violet-400/10 to-fuchsia-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
          </div>

          {/* Your Models Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] bg-gray-900/50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-8">{error}</div>
          ) : models.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  title={model.title}
                  photoCount={model.photoCount}
                  thumbnail={model.generatedPhotos[0]?.url}
                  coverImage={model.coverImage}
                  date={new Date(model.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  status={model.status.toLowerCase() as any}
                  progress={model.progress}
                  expiryDate={model.expiresAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 border border-dashed border-gray-800 rounded-xl bg-gray-900/50">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-3 bg-gray-800/50 rounded-full relative group">
                  <Plus className="h-6 w-6 text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                  {/* Animated ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-gray-700/50 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Create your AI model
                  </h3>
                  <p className="text-gray-400 max-w-sm leading-relaxed">
                    Create your own AI model to generate stunning professional
                    portraits in any setting. Use custom prompts to bring your
                    unique vision to life.
                  </p>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white font-medium relative group overflow-hidden"
                  asChild
                >
                  <Link href="/app/create">
                    <div className="relative flex items-center">
                      <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                      Create your first AI Model
                    </div>
                  </Link>
                </Button>

                {/* Feature highlights */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl pt-8">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-white font-medium">AI Photographer</p>
                      <p className="text-sm text-gray-400">
                        Take photos from your laptop or phone
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-white font-medium">
                        100% AI Generated
                      </p>
                      <p className="text-sm text-gray-400">
                        Photos and videos in any pose or place
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-white font-medium">Try on clothes</p>
                      <p className="text-sm text-gray-400">
                        Virtual fitting for your Shopify store
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}

          {/* Public Example Models */}
          <div className="pt-12 border-t border-gray-800">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Public Models
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Try our pre-trained professional models
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {publicModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    title={model.title}
                    photoCount={model.photoCount}
                    thumbnail={model.thumbnail}
                    status={model.status}
                    date={model.date}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
