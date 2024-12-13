"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface ModelData {
  title: string;
  fullName: string;
  age: number;
  gender: string;
  ethnicity: string;
  eyeColor: string;
  hairColor: string;
  photoCount: number;
  photos?: { url: string }[];
}

export default function ModelReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params) as { slug: string };
  const router = useRouter();
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetch(`/api/models/${resolvedParams.slug}`);
        if (!response.ok) throw new Error("Failed to fetch model data");
        const data = await response.json();
        setModelData(data);
      } catch (error) {
        console.error("Error fetching model data:", error);
        toast.error("Failed to load model details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelData();
  }, [resolvedParams.slug]);

  const handleContinue = () => {
    router.push(`/app/model/${resolvedParams.slug}/styles`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="text-gray-400">Loading model details...</span>
        </div>
      </div>
    );
  }

  if (!modelData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Model not found</div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/app/create"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Back to Create</span>
        </Link>
      </div>

      {/* Step Indicator */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 rounded-full pl-2 pr-3 py-1">
            <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-blue-400 text-sm font-medium">Review</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Review Your Details
          </h1>
        </div>
      </div>

      {/* Model Details */}
      <Card className="p-6 border-gray-800 bg-gray-900/50">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-white">Model Details</h2>
            <p className="text-sm text-gray-400">
              Review your information before proceeding
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="text-white font-medium capitalize">
                {modelData.fullName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Age</p>
              <p className="text-white font-medium">{modelData.age}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Gender</p>
              <p className="text-white font-medium capitalize">
                {modelData.gender}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Ethnicity</p>
              <p className="text-white font-medium capitalize">
                {modelData.ethnicity.toLowerCase().replace("_", " ")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Eye Color</p>
              <p className="text-white font-medium capitalize">
                {modelData.eyeColor}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Hair Color</p>
              <p className="text-white font-medium capitalize">
                {modelData.hairColor}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Training Photos */}
      <Card className="p-6 border-gray-800 bg-gray-900/50">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-white">Training Photos</h2>
            <p className="text-sm text-gray-400">
              {modelData.photoCount} photos uploaded successfully
            </p>
            <p className="text-xs text-gray-500">
              All {modelData.photoCount} photos will be used to train your
              custom AI model
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {modelData.photos
              ? modelData.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] relative rounded-lg overflow-hidden"
                  >
                    <Image
                      src={photo.url}
                      alt={`Training photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              : Array.from({ length: modelData.photoCount }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-gray-800/50 rounded-lg overflow-hidden"
                  />
                ))}
          </div>
        </div>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          size="lg"
          className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 min-w-[200px] hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90"
        >
          Continue to Style Selection
        </Button>
      </div>
    </div>
  );
}
