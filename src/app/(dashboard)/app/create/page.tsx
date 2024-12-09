"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CloudUpload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FileError, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Lightbox } from "@/components/ui/lightbox";
import { Info } from "lucide-react";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import JSZip from "jszip";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface UploadedPhoto {
  id: string;
  url: string;
  file?: File;
}

const examplePhotos = ["/examples/example.png"];

const HAIR_COLORS = [
  "black",
  "brown",
  "blonde",
  "red",
  "auburn",
  "gray",
  "white",
  "blue",
  "green",
  "pink",
  "purple",
  "silver",
  "platinum-blonde",
  "teal",
  "lavender",
  "orange",
  "pastel",
  "neon",
  "ombre",
  "multicolored",
] as const;

const EYE_COLORS = [
  "brown",
  "blue",
  "green",
  "hazel",
  "amber",
  "gray",
  "violet",
  "black",
  "red",
  "other",
] as const;

export default function CreateCollectionPage() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");

  // Stop animation after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialAnimation(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
  };

  // Add a function to check for duplicates
  const isDuplicatePhoto = (file: File, existingPhotos: UploadedPhoto[]) => {
    return existingPhotos.some((photo) => {
      if (!photo.file) return false;
      return (
        photo.file.name === file.name &&
        photo.file.size === file.size &&
        photo.file.lastModified === file.lastModified
      );
    });
  };

  // Update the onDrop callback
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter out duplicates and create new photos
      const newPhotos = acceptedFiles.reduce<UploadedPhoto[]>((acc, file) => {
        if (isDuplicatePhoto(file, photos)) {
          toast.error(`"${file.name}" has already been added`);
          return acc;
        }

        acc.push({
          id: Math.random().toString(36).substring(7),
          url: URL.createObjectURL(file),
          file,
        });
        return acc;
      }, []);

      if (newPhotos.length > 0) {
        setPhotos((current) => [...current, ...newPhotos]);
      }
    },
    [photos]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 120 * 1024 * 1024, // 120MB
    maxFiles: 20,
  });

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        if (photo.url.startsWith("blob:")) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, [photos]);

  const createZipFile = async (photos: UploadedPhoto[]) => {
    const zip = new JSZip();

    for (const photo of photos) {
      if (photo.file) {
        zip.file(photo.file.name, photo.file);
      }
    }

    return await zip.generateAsync({ type: "blob" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length < 10) return;

    try {
      // Check for existing collection first
      const checkResponse = await fetch("/api/collections/check-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      const { exists } = await checkResponse.json();

      if (exists) {
        toast.warning(
          "A collection with this name already exists. Creating a new one will replace the existing collection.",
          {
            action: {
              label: "Continue anyway",
              onClick: () => createCollection(),
            },
          }
        );
        return;
      }

      await createCollection();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create collection. Please try again.");
    }
  };

  const createCollection = async () => {
    try {
      setIsSubmitting(true);

      // Move existing collection creation code here
      const zipFile = await createZipFile(photos);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("fullName", fullName);
      formData.append("gender", gender);
      formData.append("eyeColor", eyeColor);
      formData.append("hairColor", hairColor);
      formData.append("photoCount", photos.length.toString());
      formData.append("zipFile", zipFile, "photos.zip");

      // Submit to API
      const response = await fetch("/api/collections", {
        method: "POST",
        body: formData,
      });

      if (response.status === 401) {
        signIn(undefined, { callbackUrl: window.location.href });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create collection");
      }

      toast.success("Collection created successfully!");
      router.push(`/app/gallery/${data.id}/styles`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl px-4 mx-auto py-8 space-y-8">
      {/* Back to Gallery Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/app"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Back to Gallery</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
          Create New Collection
        </h1>
        <p className="text-gray-400">
          Fill in the details below to create your headshot collection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <Card className="p-6 border-gray-800 bg-gray-900/50 space-y-8 h-fit">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-gray-200 flex items-center gap-1"
              >
                Collection Name
                <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Professional Headshots 2024"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-gray-200 flex items-center gap-1"
              >
                Full Name
                <span className="text-red-400">*</span>
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-200">
                  Gender
                  <span className="text-red-400">*</span>
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue
                      placeholder="Select gender"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem
                      value="man"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Man
                    </SelectItem>
                    <SelectItem
                      value="woman"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Woman
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">
                  Eye Color
                  <span className="text-red-400">*</span>
                </Label>
                <Select value={eyeColor} onValueChange={setEyeColor}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue
                      placeholder="Select eye color"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {EYE_COLORS.map((color) => (
                      <SelectItem
                        key={color}
                        value={color}
                        className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">
                  Hair Color
                  <span className="text-red-400">*</span>
                </Label>
                <Select value={hairColor} onValueChange={setHairColor}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue
                      placeholder="Select hair color"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {HAIR_COLORS.map((color) => (
                      <SelectItem
                        key={color}
                        value={color}
                        className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                      >
                        {color.charAt(0).toUpperCase() +
                          color.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-200">
                Upload Photos
                <span className="text-red-400">*</span>
              </Label>
              <p className="text-sm text-gray-400">
                Select{" "}
                <span className="font-semibold text-white bg-gradient-to-r from-blue-400/20 via-violet-400/20 to-fuchsia-400/20 px-2 py-0.5 rounded-md">
                  at least 10 photos (required)
                </span>{" "}
                of your best photos. Good photos will result in amazing
                headshots!
              </p>
            </div>

            {/* Guidelines Card */}
            <Card className="p-6 border-gray-800 bg-gray-900/50">
              <div className="space-y-6">
                {/* Technical Requirements & Photo Tips - Collapsible */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-3 text-sm text-gray-400 hover:text-white w-full group">
                    <div className="p-2 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 rounded-lg group-hover:from-blue-500/20 group-hover:via-violet-500/20 group-hover:to-fuchsia-500/20 transition-all duration-300">
                      <Info className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between flex-1 py-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Photo Guidelines</span>
                        <span className="text-xs text-blue-400/70">
                          Click to expand
                        </span>
                      </div>
                      <div className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                        Important
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 pl-10 space-y-6">
                    {/* Technical Requirements */}
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">
                        Technical Requirements
                        <span className="ml-2 text-xs text-blue-400/80 font-normal">
                          For best quality results
                        </span>
                      </h3>
                      <ul className="text-sm text-gray-400 space-y-2.5 list-none">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-blue-400">1</span>
                          </div>
                          <span>
                            Use high-resolution photos (1024x1024 or higher
                            recommended)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-blue-400">2</span>
                          </div>
                          <span>Supported formats: WebP, JPG, or PNG</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-blue-400">3</span>
                          </div>
                          <span>
                            Upload at least 10 different photos for best results
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Photo Tips */}
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">
                        Photo Tips
                        <span className="ml-2 text-xs text-emerald-400/80 font-normal">
                          For natural variety
                        </span>
                      </h3>
                      <ul className="text-sm text-gray-400 space-y-2.5 list-none">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-emerald-400">✓</span>
                          </div>
                          <span>
                            Include different facial expressions and head angles
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-emerald-400">✓</span>
                          </div>
                          <span>Vary your clothing styles and colors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-emerald-400">
                              ���
                            </span>
                          </div>
                          <span>
                            Mix different lighting conditions and backgrounds
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Example Photos - Always Visible */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white flex items-center">
                    Example Photos
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      Click to enlarge
                    </span>
                  </h3>
                  <div className="w-full">
                    <Lightbox
                      className="aspect-[8/3] relative cursor-zoom-in group rounded-lg overflow-hidden"
                      image={examplePhotos[0]}
                    >
                      <Image
                        src={examplePhotos[0]}
                        alt="Example training photo set showing variety in poses and settings"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Lightbox>
                  </div>
                </div>
              </div>
            </Card>

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed border-gray-800 rounded-xl p-8 bg-gray-900/30 group hover:border-gray-700 hover:bg-gray-900/40 transition-all duration-300 cursor-pointer",
                isDragActive && "border-primary bg-primary/5"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-full group-hover:scale-110 group-hover:bg-gray-800/70 transition-all duration-300">
                  <CloudUpload
                    className="h-8 w-8 text-gray-400 group-hover:text-gray-300 transition-colors duration-300 [animation:initial-pulse_1s_ease-in-out_2] group-hover:animate-none"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="space-y-2 relative">
                  <p className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                    {isDragActive
                      ? "Drop your photos here"
                      : "Drag photos here or click to browse"}
                  </p>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                    PNG, JPG, or WebP up to 120MB
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                    Upload can take up to 60 seconds
                  </p>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-blue-500/5 group-hover:via-violet-500/5 group-hover:to-fuchsia-500/5 transition-all duration-500 rounded-lg blur-xl" />
                </div>
                <Button
                  variant="outline"
                  className="bg-gray-900 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 group-hover:border-gray-600 transition-all duration-300"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Select Photos
                </Button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white font-medium h-11"
                disabled={
                  isSubmitting ||
                  photos.length < 10 ||
                  !title.trim() ||
                  !fullName.trim() ||
                  !gender ||
                  !eyeColor ||
                  !hairColor
                }
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Collection...
                  </div>
                ) : (
                  "Create Collection"
                )}
              </Button>
            </form>
            {photos.length < 10 && (
              <p className="text-sm text-gray-400 text-center mt-2">
                Upload {10 - photos.length} more photos to continue
              </p>
            )}
            {photos.length >= 10 &&
              (!title.trim() ||
                !fullName.trim() ||
                !gender ||
                !eyeColor ||
                !hairColor) && (
                <p className="text-sm text-red-400 text-center mt-2">
                  Please fill in all required fields marked with *
                </p>
              )}
          </div>
        </Card>

        {/* Right Column - Photo Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Photo Preview</h2>
            <p className="text-sm text-gray-400">
              {photos.length} photos selected
            </p>
          </div>

          <Card className="border-gray-800 bg-gray-900/50 p-4">
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group aspect-[3/4] rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-gray-900/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    {/* Remove button with enhanced styling */}
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-900 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Optional: Add file name on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white truncate opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="truncate text-xs">{photo.file?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg">
                <div className="text-center space-y-2">
                  <ImageIcon className="h-8 w-8 text-gray-600 mx-auto" />
                  <p className="text-gray-400">No photos uploaded yet</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
