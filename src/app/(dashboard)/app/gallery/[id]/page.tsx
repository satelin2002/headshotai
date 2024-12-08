"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DownloadCloud,
  Flag,
  MoreVertical,
  Package,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// Mock data - replace with real data
const mockPhotos = Array.from({ length: 50 }, (_, i) => ({
  id: `photo-${i + 1}`,
  url: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
  formats: ["jpg", "png", "webp"],
}));

export default function GalleryPage({ params }: { params: { id: string } }) {
  const handleDownloadAll = () => {
    toast.info("Preparing ZIP file for download...");
    // Implement ZIP download logic
  };

  const handleReportPhoto = (photoId: string) => {
    toast.success("Photo reported. We'll review it shortly.");
  };

  const handleDownloadFormat = (photoId: string, format: string) => {
    toast.info(`Downloading photo in ${format.toUpperCase()} format...`);
    // Implement single photo download logic
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Professional LinkedIn Photos
          </h1>
          <p className="text-gray-400">50 photos • Created March 15, 2024</p>
        </div>

        <Button
          size="lg"
          onClick={handleDownloadAll}
          className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90"
        >
          <Package className="mr-2 h-5 w-5" />
          Download All Photos
        </Button>
      </div>

      {/* Expiry Alert */}
      <Alert className="bg-amber-950/50 border-amber-900/50 text-amber-300">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This gallery will be automatically deleted after 30 days (April 14,
          2024). Please download your photos before then.
        </AlertDescription>
      </Alert>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mockPhotos.map((photo) => (
          <Card
            key={photo.id}
            className="group relative aspect-[3/4] overflow-hidden bg-gray-900/50 border-gray-800"
          >
            <Image
              src={photo.url}
              alt="Headshot"
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-gray-900/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
                {/* Download Options */}
                <div className="flex gap-2">
                  {photo.formats.map((format) => (
                    <Button
                      key={format}
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFormat(photo.id, format)}
                      className="flex-1 bg-gray-900/50 hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white backdrop-blur-sm"
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-gray-900/50 hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white backdrop-blur-sm"
                  >
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReportPhoto(photo.id)}
                    className="bg-gray-900/50 hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white backdrop-blur-sm"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
