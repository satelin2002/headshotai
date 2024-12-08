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
import { CloudUpload, Image as ImageIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface UploadedPhoto {
  id: string;
  url: string;
  file?: File;
}

export default function CreateCollectionPage() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);

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
      "image/heic": [".heic"],
    },
    maxSize: 120 * 1024 * 1024, // 120MB
    maxFiles: 20, // Allow some buffer over 10
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

  return (
    <div className="container max-w-7xl px-4 mx-auto py-8 space-y-8">
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
              <Label htmlFor="name" className="text-gray-200">
                Collection Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Professional Headshots 2024"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-200">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                className="bg-gray-900 border-gray-800 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-200">Gender</Label>
                <Select>
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
                <Label className="text-gray-200">Eye Color</Label>
                <Select>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue
                      placeholder="Select eye color"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem
                      value="brown"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Brown
                    </SelectItem>
                    <SelectItem
                      value="blue"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Blue
                    </SelectItem>
                    <SelectItem
                      value="green"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Green
                    </SelectItem>
                    <SelectItem
                      value="hazel"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Hazel
                    </SelectItem>
                    <SelectItem
                      value="amber"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Amber
                    </SelectItem>
                    <SelectItem
                      value="gray"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Gray
                    </SelectItem>
                    <SelectItem
                      value="violet"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Violet
                    </SelectItem>
                    <SelectItem
                      value="black"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Black
                    </SelectItem>
                    <SelectItem
                      value="red"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Red
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
                <Label className="text-gray-200">Hair Color</Label>
                <Select>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue
                      placeholder="Select hair color"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem
                      value="black"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Black
                    </SelectItem>
                    <SelectItem
                      value="brown"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Brown
                    </SelectItem>
                    <SelectItem
                      value="blonde"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Blonde
                    </SelectItem>
                    <SelectItem
                      value="red"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Red
                    </SelectItem>
                    <SelectItem
                      value="auburn"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Auburn
                    </SelectItem>
                    <SelectItem
                      value="gray"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Gray
                    </SelectItem>
                    <SelectItem
                      value="white"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      White
                    </SelectItem>
                    <SelectItem
                      value="blue"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Blue
                    </SelectItem>
                    <SelectItem
                      value="green"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Green
                    </SelectItem>
                    <SelectItem
                      value="pink"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Pink
                    </SelectItem>
                    <SelectItem
                      value="purple"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Purple
                    </SelectItem>
                    <SelectItem
                      value="silver"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Silver
                    </SelectItem>
                    <SelectItem
                      value="platinum-blonde"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Platinum Blonde
                    </SelectItem>
                    <SelectItem
                      value="teal"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Teal
                    </SelectItem>
                    <SelectItem
                      value="lavender"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Lavender
                    </SelectItem>
                    <SelectItem
                      value="orange"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Orange
                    </SelectItem>
                    <SelectItem
                      value="pastel"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Pastel
                    </SelectItem>
                    <SelectItem
                      value="neon"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Neon
                    </SelectItem>
                    <SelectItem
                      value="ombre"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Ombre
                    </SelectItem>
                    <SelectItem
                      value="multicolored"
                      className="text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                    >
                      Multicolored
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Upload Photos</Label>
              <p className="text-sm text-gray-400">
                Select{" "}
                <span className="font-semibold text-white bg-gradient-to-r from-blue-400/20 via-violet-400/20 to-fuchsia-400/20 px-2 py-0.5 rounded-md">
                  at least 10
                </span>{" "}
                of your best photos. Good photos will result in amazing
                headshots!
              </p>
            </div>

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
                    PNG, JPG, HEIC up to 120MB
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
            <Button
              className="w-full bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white font-medium h-11 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={photos.length < 10}
            >
              Create Collection
            </Button>
            {photos.length < 10 && (
              <p className="text-sm text-gray-400 text-center mt-2">
                Upload {10 - photos.length} more photos to continue
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
