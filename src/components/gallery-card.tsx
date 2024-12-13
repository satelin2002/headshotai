import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Image as ImageIcon,
  Loader2,
  Clock,
  Download,
  Share2,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GalleryCardProps {
  title: string;
  photoCount: number;
  thumbnail?: string;
  date: string;
  status?: "processing" | "ready" | "failed";
  progress?: number;
  expiryDate?: string;
}

export function GalleryCard({
  title,
  photoCount,
  thumbnail,
  date,
  status = "ready",
  progress,
  expiryDate,
}: GalleryCardProps) {
  const isProcessing = status === "processing";

  const getDaysRemaining = () => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group overflow-hidden bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-300 flex flex-col">
      <div className="aspect-[4/3] relative bg-gray-800 overflow-hidden">
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
              {progress && (
                <div
                  className="absolute inset-0 rounded-full border-2 border-blue-400/20"
                  style={{
                    clipPath: `circle(${progress}% at 50% 50%)`,
                  }}
                />
              )}
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-gray-200">
                Generating {title}
              </p>
              <p className="text-xs text-gray-400">
                We'll notify you via email when they're ready
              </p>
            </div>
          </div>
        ) : thumbnail ? (
          <div className="relative w-full h-full">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-600 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-auto">
          <div className="space-y-1">
            <h3 className="font-medium text-white group-hover:text-blue-200 transition-colors duration-300 line-clamp-1">
              {title}
            </h3>
            <div>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {isProcessing ? (
                  <span className="text-blue-400">{date}</span>
                ) : (
                  `${date}`
                )}
              </p>
            </div>
          </div>
          {!isProcessing ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-58 bg-gray-900 border-gray-800"
              >
                <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-gray-800">
                  <Download className="mr-2 h-4 w-4" />
                  Download All Saved Photos
                </DropdownMenuItem>

                <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-gray-800">
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-gray-800">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-950/50">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Model
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {/* {daysRemaining && daysRemaining <= 3 && !isProcessing && (
          <p className="text-xs text-red-400 mt-2">
            Download soon to avoid losing your photos
          </p>
        )} */}

        <div className="mt-4">
          {isProcessing ? null : (
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "w-full bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 transition-all duration-300"
              )}
            >
              Generate Photos from Model
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
