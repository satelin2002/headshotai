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
  CheckCircle2,
  XCircle,
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
import { ModelStatus } from "@prisma/client";

interface ModelCardProps {
  title: string;
  photoCount: number;
  thumbnail?: string;
  coverImage?: string;
  date: string;
  status: Lowercase<ModelStatus>;
  progress?: number;
  expiryDate?: string;
}

export function ModelCard({
  title,
  photoCount,
  thumbnail,
  coverImage,
  date,
  status = "ready",
  progress,
  expiryDate,
}: ModelCardProps) {
  const isProcessing = status === "processing";
  const isTraining = status === "training";
  const isFailed = status === "failed";
  const isReady = status === "ready";

  const getStatusDisplay = () => {
    switch (status) {
      case "processing":
        return {
          icon: <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />,
          text: "Processing Photos",
          subtext: "We'll notify you via email when processing is complete",
          color: "text-blue-400",
        };
      case "training":
        return {
          icon: <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />,
          text: "Training Your AI Model",
          subtext: "We'll notify you via email when training is complete",
          color: "text-violet-400",
        };
      case "failed":
        return {
          icon: <XCircle className="h-8 w-8 text-red-400" />,
          text: "Training Failed",
          subtext: "Please try again or contact support",
          color: "text-red-400",
        };
      case "ready":
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-emerald-400" />,
          text: "Ready to Use",
          subtext: "Start generating photos",
          color: "text-emerald-400",
        };
      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-gray-400" />,
          text: "Unknown Status",
          subtext: "Please refresh the page",
          color: "text-gray-400",
        };
    }
  };

  const getDaysRemaining = () => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const statusDisplay = getStatusDisplay();

  return (
    <Card className="group overflow-hidden bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-300 flex flex-col">
      <div className="aspect-[4/3] relative bg-gray-800 overflow-hidden">
        {coverImage || thumbnail ? (
          <div className="relative w-full h-full">
            <Image
              src={coverImage || thumbnail!}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            {(isProcessing || isTraining || isFailed) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-4 bg-gray-900/70">
                <div className="relative">
                  {statusDisplay.icon}
                  {(isProcessing || isTraining) && progress && (
                    <div
                      className="absolute inset-0 rounded-full border-2 border-current opacity-20"
                      style={{
                        clipPath: `circle(${progress}% at 50% 50%)`,
                      }}
                    />
                  )}
                </div>
                <div className="text-center space-y-1">
                  <p className={cn("text-sm font-medium", statusDisplay.color)}>
                    {statusDisplay.text}
                  </p>
                  <p className="text-xs text-gray-400">
                    {statusDisplay.subtext}
                  </p>
                </div>
              </div>
            )}
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
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {date}
              </p>
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isReady && "bg-emerald-400",
                  isProcessing && "bg-blue-400",
                  isTraining && "bg-violet-400",
                  isFailed && "bg-red-400"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isReady && "text-emerald-400",
                  isProcessing && "text-blue-400",
                  isTraining && "text-violet-400",
                  isFailed && "text-red-400"
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
          {!isProcessing && !isTraining && (
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
                {isReady && (
                  <>
                    <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-gray-800">
                      <Download className="mr-2 h-4 w-4" />
                      Download All Photos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                  </>
                )}
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
          )}
        </div>

        <div className="mt-4">
          {isReady ? (
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "w-full bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 transition-all duration-300"
              )}
            >
              Generate Photos
            </Button>
          ) : isFailed ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-red-950/30 hover:bg-red-950/50 text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-900/70 transition-all duration-300"
            >
              View Error Details
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
