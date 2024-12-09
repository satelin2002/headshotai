"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  params: { id: string };
}) {
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
      const response = await fetch(`/api/galleries/${params.id}/styles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styles: selectedStyles }),
      });

      if (!response.ok) throw new Error("Failed to update styles");

      router.push(`/app/gallery/${params.id}`);
    } catch (error) {
      console.error("Style selection error:", error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
          Select Styles
        </h1>
        <p className="text-gray-400">
          Choose 2 styles for your headshot collection. Each style will be used
          to generate unique professional headshots based on your photos. Select
          styles that best match your desired look and profession.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {STYLES.map((style) => (
          <Card
            key={style.id}
            className={`relative cursor-pointer overflow-hidden group transition-all duration-300 ${
              selectedStyles.includes(style.id)
                ? "ring-2 ring-blue-500 scale-[0.98]"
                : "hover:scale-[0.98]"
            }`}
            onClick={() => toggleStyle(style.id)}
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={style.image}
                alt={style.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-medium">{style.name}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={selectedStyles.length !== 2}
          className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90"
        >
          Continue with {selectedStyles.length}/2 styles
        </Button>
      </div>
    </div>
  );
}
