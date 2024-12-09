"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { use } from "react";

const STYLES = [
  {
    id: "grey",
    name: "Grey",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725592466/styles/grey-female_1.jpg",
  },
  {
    id: "black",
    name: "Black",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/black-female.jpg",
  },
  {
    id: "blue",
    name: "Blue",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/blue-female.jpg",
  },
  {
    id: "cafe",
    name: "Cafe",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/cafe-female.jpg",
  },
  {
    id: "office",
    name: "Office",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/office-female.jpg",
  },
  {
    id: "outdoor",
    name: "Outdoor",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/outdoor-female.jpg",
  },
  {
    id: "beach",
    name: "Beach",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/beach-female.jpg",
  },
  {
    id: "city-skyline",
    name: "City Skyline",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/city-female.jpg",
  },
  {
    id: "street",
    name: "Street",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/street-female.jpg",
  },
  {
    id: "library",
    name: "Library",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/library-female.jpg",
  },
  {
    id: "city-lights",
    name: "City Lights",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/city-light-female.jpg",
  },
  {
    id: "stadium",
    name: "Stadium",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/stadium-female.jpg",
  },
  {
    id: "mountains",
    name: "Mountains",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/mountain-female.jpg",
  },
  {
    id: "sunset",
    name: "Sunset",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/sunset-female.jpg",
  },
  {
    id: "yacht",
    name: "Yacht",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/yacht-female.jpg",
  },
  {
    id: "art-piece",
    name: "Art Piece",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/art-piece-female.jpg",
  },
  {
    id: "realtor",
    name: "Realtor",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/realtor-female.jpg",
  },
  {
    id: "clinic-coat",
    name: "Clinic Coat",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/clinic-coat-female.jpg",
  },
  {
    id: "clinic-scrubs",
    name: "Clinic Scrubs",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/clinic-scrubs-female.jpg",
  },
  {
    id: "outdoor-hospital-coat",
    name: "Outdoor Hospital Coat",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/outdoor-hospital-coat-female.jpg",
  },
  {
    id: "outdoor-hospital-scrubs",
    name: "Outdoor Hospital Scrubs",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589487/styles/outdoor-hospital-scrubs-female.jpg",
  },
] as const;

export default function StyleSelectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params) as { slug: string };
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const router = useRouter();

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((current) => {
      if (current.includes(styleId)) {
        return current.filter((id) => id !== styleId);
      }
      if (current.length < 2) {
        return [...current, styleId];
      }
      return current;
    });
  };

  const handleSubmit = async () => {
    if (selectedStyles.length !== 2) return;

    try {
      const response = await fetch(
        `/api/galleries/${resolvedParams.slug}/styles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ styles: selectedStyles }),
        }
      );

      if (!response.ok) throw new Error("Failed to update styles");

      router.push(`/app/gallery/${resolvedParams.slug}/summary`);
    } catch (error) {
      console.error("Style selection error:", error);
      toast.error("Failed to save styles. Please try again.");
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/app/create"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Start Over</span>
        </Link>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 rounded-full pl-2 pr-3 py-1">
            <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            {/*  */}
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Select Styles
          </h1>
        </div>
        <div className="flex items-center justify-between gap-8">
          <p className="text-gray-400">
            Choose 2 styles for your headshot collection. Each style will be
            used to generate unique professional headshots based on your photos.
            Select styles that best match your desired look and profession.
          </p>
          {selectedStyles.length === 2 && (
            <Button
              onClick={handleSubmit}
              size="lg"
              className={cn(
                "bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 min-w-[200px] animate-pulse px-12"
              )}
            >
              Continue with Selected Styles
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {STYLES.map((style) => (
          <Card
            key={style.id}
            className={cn(
              "relative cursor-pointer overflow-hidden group transition-all duration-300",
              selectedStyles.includes(style.id)
                ? "ring-4 ring-blue-500/50 scale-[0.98] after:absolute after:inset-0 after:bg-blue-500/10"
                : "hover:scale-[0.98] hover:ring-2 hover:ring-blue-500/20"
            )}
            onClick={() => toggleStyle(style.id)}
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={style.image}
                alt={style.name}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  selectedStyles.includes(style.id)
                    ? "brightness-110"
                    : "group-hover:brightness-110"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

              {/* Selection Indicator */}
              {selectedStyles.includes(style.id) && (
                <div className="absolute top-4 right-4 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {selectedStyles.indexOf(style.id) + 1}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium text-lg">{style.name}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
