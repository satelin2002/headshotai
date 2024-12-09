"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { use } from "react";

export default function SummaryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params) as { slug: string };
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      // Call your API to start generation
      const response = await fetch(
        `/api/galleries/${resolvedParams.slug}/generate`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to start generation");

      // Show success message
      toast.success(
        "Your headshots are being generated! We'll notify you when they're ready.",
        {
          duration: 8000,
        }
      );

      // Redirect to gallery page
      router.push("/app");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to start generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/app/gallery/${resolvedParams.slug}/styles`}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Back to Styles</span>
        </Link>
      </div>

      {/* Step Indicator */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 rounded-full pl-2 pr-3 py-1">
            <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="text-blue-400 text-sm font-medium">
              Final Step
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Review & Generate
          </h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6">
        {/* Collection Info */}
        <Card className="p-6 border-gray-800 bg-gray-900/50">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-white">
                Collection Details
              </h2>
              <p className="text-sm text-gray-400">
                Review your collection information
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Photos</p>
                <p className="text-white font-medium">50 photos</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Gender</p>
                <p className="text-white font-medium capitalize">Woman</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Hair Color</p>
                <p className="text-white font-medium capitalize">Brown</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Eye Color</p>
                <p className="text-white font-medium capitalize">Blue</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Selected Styles */}
        <Card className="p-6 border-gray-800 bg-gray-900/50">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-white">
                Selected Styles
              </h2>
              <p className="text-sm text-gray-400">
                Your chosen styles for headshot generation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Style Preview Cards */}
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="relative aspect-[3/4] w-24 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                    <Image
                      src="/examples/example.png"
                      alt="Style preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      Professional Office
                    </h3>
                    <p className="text-sm text-gray-400">Corporate setting</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Generation Info */}
        <Card className="p-6 border-gray-800 bg-gray-900/50">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-white">
                Generation Process
              </h2>
              <p className="text-sm text-gray-400">What happens next?</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-400">1</span>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-medium">Processing Time</p>
                  <p className="text-sm text-gray-400">
                    Generating 50 professional headshots takes approximately 1-2
                    hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-400">2</span>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-medium">Notification</p>
                  <p className="text-sm text-gray-400">
                    You'll receive an email notification when your headshots are
                    ready
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-400">3</span>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-medium">Access & Download</p>
                  <p className="text-sm text-gray-400">
                    View and download your headshots from your gallery dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className={cn(
              "bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 min-w-[250px]",
              !isGenerating &&
                "hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90"
            )}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting Generation...
              </div>
            ) : (
              "Generate Headshots"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
