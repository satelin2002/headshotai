"use client";

// Import necessary dependencies
import React, { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Settings,
  Image as ImageIcon,
  Save,
  Sparkles,
  BookMarked,
  Loader2,
  Download,
  Maximize2,
  Copy,
  X,
  HelpCircle,
  ChevronDown,
  PlusCircle,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Main component for the generation page
export default function GeneratePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Resolve params and initialize hooks
  const resolvedParams = use(params) as { slug: string };
  const router = useRouter();

  // State management
  const [activeTab, setActiveTab] = useState("generated");
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Form state management
  const [formState, setFormState] = useState({
    photoCount: 1,
    orientation: "portrait",
    prompt: "",
    negativePrompt: "",
    creativity: 0.5,
    style: "",
    emotion: "",
    cameraPosition: "",
    place: "",
    seed: "",
    guidanceScale: 7.5,
    inferenceSteps: 30,
  });

  // Utility function to check if a value exists
  const hasValue = (value: any) => {
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number") return true;
    return false;
  };

  // Styling constants
  const activeInputClass = "border-blue-500/50 bg-gray-900/80";

  // Handle escape key to close selected image
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  // Fetch model data on component mount
  useEffect(() => {
    async function fetchModel() {
      try {
        const response = await fetch(`/api/models/${resolvedParams.slug}`);
        if (!response.ok) throw new Error("Failed to fetch model");
        const data = await response.json();
        setModel(data);
      } catch (error) {
        console.error("Error fetching model:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModel();
  }, [resolvedParams.slug]);

  // Loading state
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

  // Error state
  if (!model) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Model not found</div>
      </div>
    );
  }

  // Main render
  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar - Generation Controls */}
      <div className="w-[400px] border-r border-gray-800 bg-gray-900/50 flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-800 transition-all duration-200 ease-in-out">
        {/* Model Selector Dropdown */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
              Choose Model
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                  <p>Select the model you want to generate photos with</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={model.id}>
            <SelectTrigger className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-4 text-white hover:bg-gray-800/80 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-200">
              <SelectValue placeholder="Select a model" className="text-white">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden ring-1 ring-gray-800">
                    <img
                      src={model.coverImage}
                      alt={model.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-medium text-white">
                        {model.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {model.fullName}
                    </span>
                  </div>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-gray-950 border border-gray-800">
              <SelectItem
                value="create"
                className="py-3 px-4 text-white hover:text-gray-900 bg-gray-900  transition-colors cursor-pointer"
                onClick={() => router.push("/app/model/create")}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center transition-colors">
                    <div className="text-2xl font-thin">
                      <Plus className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-medium">
                        Create Custom Model
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Train your own AI model
                    </span>
                  </div>
                </div>
              </SelectItem>

              <SelectItem
                value={model.id}
                className="py-3 px-4 text-white hover:text-gray-900 bg-gray-900 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden ring-1 ring-gray-800">
                    <img
                      src={model.coverImage}
                      alt={model.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-medium">
                        {model.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {model.fullName}
                    </span>
                  </div>
                </div>
              </SelectItem>

              <SelectItem
                value="model2"
                className="py-3 px-4 text-white hover:text-gray-900 bg-gray-900 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden ring-1 ring-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
                      alt="Sarah Wilson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-medium">
                        Sarah Wilson
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Professional Model
                    </span>
                  </div>
                </div>
              </SelectItem>

              <SelectItem
                value="model3"
                className="py-3 px-4 text-white hover:text-gray-900 bg-gray-900 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden ring-1 ring-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800"
                      alt="Emma Davis"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-medium">Emma Davis</span>
                    </div>
                    <span className="text-sm text-gray-500">Fashion Model</span>
                  </div>
                </div>
              </SelectItem>

              <SelectItem
                value="model4"
                className="py-3 px-4 text-white hover:text-gray-900 bg-gray-900 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden ring-1 ring-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800"
                      alt="Sophia Chen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-medium">Sophia Chen</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Commercial Model
                    </span>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upgrade Prompt */}
        {/* <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-[10px] shadow-lg">
                    ✨
                  </div>
                </div>
                <h3 className="text-base font-medium text-red-400">
                  You're out of credits
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Upgrade to a higher plan and get more credits instantly.
                Immediately continue taking more photos after upgrading your
                plan, click the button below to go the billing portal.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                size="default"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base">Update Plan</span>
                </div>
              </Button>
            </div>
          </div>
        </div> */}

        {/* Scrollable Content */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-800">
          <div className="space-y-6">
            {/* Set Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Set Preferences
              </h3>

              {/* Amount of Photos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                      Amount of Photos
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                          <p>
                            Choose how many photos you want to generate in one
                            batch (1-4)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formState.photoCount}{" "}
                    {formState.photoCount === 1 ? "photo" : "photos"}
                  </span>
                </div>
                <Slider
                  value={[formState.photoCount]}
                  onValueChange={(value) =>
                    setFormState((prev) => ({ ...prev, photoCount: value[0] }))
                  }
                  max={4}
                  min={1}
                  step={1}
                  className="py-4 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:transition-transform [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:focus:scale-110 [&_[role=slider]]:active:scale-95 [&_[role=slider]]:focus:outline-none [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-blue-500 [&_[role=slider]]:focus:ring-offset-2 [&_[role=slider]]:focus:ring-offset-gray-900 [&_[role=track]]:h-2 [&_[role=track]]:bg-gray-700 [&_[role=track].bg-primary]:bg-gradient-to-r [&_[role=track].bg-primary]:from-blue-500 [&_[role=track].bg-primary]:to-violet-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 photo</span>
                  <span>4 photos</span>
                </div>
              </div>

              {/* Orientation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                    Orientation
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                        <p>Choose the aspect ratio for your generated photos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="default"
                    className={`relative h-auto flex flex-col items-center gap-2 py-4 px-2 bg-gray-900/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-200 ${
                      formState.orientation === "portrait"
                        ? "border-blue-500/50 bg-gray-800/80 ring-1 ring-blue-500/20 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        orientation: "portrait",
                      }))
                    }
                  >
                    <div className="w-5 h-8 rounded-sm border-2 border-current opacity-80" />
                    <span className="text-xs font-medium">Portrait</span>
                    <div className="absolute -top-1.5 -right-1.5">
                      <div className="bg-blue-500 text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium">
                        Best
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className={`h-auto flex flex-col items-center gap-2 py-4 px-2 bg-gray-900/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 hover:text-white transition-all duration-200 ${
                      formState.orientation === "landscape"
                        ? "border-blue-500/50 bg-gray-800/80 ring-1 ring-blue-500/20 text-white"
                        : "text-gray-400"
                    }`}
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        orientation: "landscape",
                      }))
                    }
                  >
                    <div className="w-8 h-5 rounded-sm border-2 border-current opacity-80" />
                    <span className="text-xs font-medium">Landscape</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className={`h-auto flex flex-col items-center gap-2 py-4 px-2 bg-gray-900/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 hover:text-white transition-all duration-200 ${
                      formState.orientation === "square"
                        ? "border-blue-500/50 bg-gray-800/80 ring-1 ring-blue-500/20 text-white"
                        : "text-gray-400"
                    }`}
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        orientation: "square",
                      }))
                    }
                  >
                    <div className="w-6 h-6 rounded-sm border-2 border-current opacity-80" />
                    <span className="text-xs font-medium">Square</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                  What do you want to create? (Prompt)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                      <p>Describe the photo you want to generate in detail</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <textarea
                placeholder="A model in a professional studio setting, wearing a casual outfit, natural pose, soft lighting"
                className="w-full min-h-[100px] bg-gray-900 border border-gray-700 hover:border-gray-500 focus:border-gray-400 text-white rounded-md px-3 py-2 placeholder:text-gray-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500">
                Make sure to write model above, or if you want to create a photo
                without your model, do not write it.
              </p>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                  Negative Prompt
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                      <p>
                        Describe what you don't want to see in the generated
                        photos
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <textarea
                placeholder="Unrealistic features, oversaturated colors, blurry, distorted proportions, bad lighting"
                className="w-full min-h-[80px] bg-gray-900 border border-gray-700 hover:border-gray-500 focus:border-gray-400 text-white rounded-md px-3 py-2 placeholder:text-gray-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Creativity vs Resemblance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                    Creativity vs. Resemblance
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                        <p>
                          Balance between creative freedom and staying close to
                          your model's appearance
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm text-gray-400">
                  {Math.round(formState.creativity * 100)}%
                </span>
              </div>
              <Slider
                value={[formState.creativity]}
                onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, creativity: value[0] }))
                }
                max={1}
                min={0}
                step={0.1}
                className="py-4 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:transition-transform [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:focus:scale-110 [&_[role=slider]]:active:scale-95 [&_[role=slider]]:focus:outline-none [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-blue-500 [&_[role=slider]]:focus:ring-offset-2 [&_[role=slider]]:focus:ring-offset-gray-900 [&_[role=track]]:h-2 [&_[role=track]]:bg-gray-700 [&_[role=track].bg-primary]:bg-gradient-to-r [&_[role=track].bg-primary]:from-blue-500 [&_[role=track].bg-primary]:to-violet-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>More Creative</span>
                <span>More Accurate</span>
              </div>
            </div>

            {/* Style & Setting Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                    Style/Film Type
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                        <p>
                          Choose a specific style or film look for your photos
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <select
                  value={formState.style}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, style: e.target.value }))
                  }
                  className={`w-full bg-gray-900 border border-gray-700 hover:border-gray-500 focus:border-gray-400 rounded-md px-3 py-2.5 my-1.5 text-white transition-colors ${
                    hasValue(formState.style) ? activeInputClass : ""
                  }`}
                >
                  <option value="" className="py-2">
                    Select style
                  </option>
                  <option value="cinematic" className="py-2">
                    🎬 Cinematic
                  </option>
                  <option value="portrait" className="py-2">
                    📸 Portrait
                  </option>
                  <option value="fashion" className="py-2">
                    👗 Fashion
                  </option>
                  <option value="film" className="py-2">
                    🎞️ Film
                  </option>
                  <option value="polaroid" className="py-2">
                    📷 Polaroid
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                    Emotion
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                        <p>Select the emotional expression for your model</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <select
                  value={formState.emotion}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      emotion: e.target.value,
                    }))
                  }
                  className={`w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2.5 my-1.5 text-white transition-colors ${
                    hasValue(formState.emotion) ? activeInputClass : ""
                  }`}
                >
                  <option value="" className="py-2">
                    Select emotion
                  </option>
                  <option value="happy" className="py-2">
                    😊 Happy
                  </option>
                  <option value="serious" className="py-2">
                    😐 Serious
                  </option>
                  <option value="confident" className="py-2">
                    💪 Confident
                  </option>
                  <option value="scared" className="py-2">
                    🫣 Scared
                  </option>
                  <option value="surprised" className="py-2">
                    😮 Surprised
                  </option>
                </select>
              </div>
            </div>

            {/* Camera & Place */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                    Camera Position
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                        <p>Choose the camera angle and perspective</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <select
                  value={formState.cameraPosition}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      cameraPosition: e.target.value,
                    }))
                  }
                  className={`w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2.5 my-1.5 text-white transition-colors ${
                    hasValue(formState.cameraPosition) ? activeInputClass : ""
                  }`}
                >
                  <option value="" className="py-2">
                    Select position
                  </option>
                  <option value="front" className="py-2">
                    👤 Front View
                  </option>
                  <option value="side" className="py-2">
                    👥 Side View
                  </option>
                  <option value="above" className="py-2">
                    ⬇️ From Above
                  </option>
                  <option value="below" className="py-2">
                    ⬆️ From Below
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                    Place
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                        <p>Select the location or environment for your photo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <select
                  value={formState.place}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, place: e.target.value }))
                  }
                  className={`w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2.5 my-1.5 text-white transition-colors ${
                    hasValue(formState.place) ? activeInputClass : ""
                  }`}
                >
                  <option value="" className="py-2">
                    Select place
                  </option>
                  <option value="studio" className="py-2">
                    ���� Studio
                  </option>
                  <option value="outdoor" className="py-2">
                    🌳 Outdoor
                  </option>
                  <option value="urban" className="py-2">
                    🏙️ Urban
                  </option>
                  <option value="nature" className="py-2">
                    🌿 Nature
                  </option>
                  <option value="beach" className="py-2">
                    🏖️ Beach
                  </option>
                  <option value="coffeeshop" className="py-2">
                    ☕ Coffee Shop
                  </option>
                  <option value="gym" className="py-2">
                    💪 Gym
                  </option>
                  <option value="university" className="py-2">
                    🎓 University
                  </option>
                  <option value="bar" className="py-2">
                    🍸 Bar
                  </option>
                  <option value="restaurant" className="py-2">
                    🍽️ Restaurant
                  </option>
                  <option value="library" className="py-2">
                    📚 Library
                  </option>
                  <option value="office" className="py-2">
                    💼 Office
                  </option>
                  <option value="rooftop" className="py-2">
                    🌆 Rooftop
                  </option>
                  <option value="park" className="py-2">
                    🌺 Park
                  </option>
                </select>
              </div>
            </div>

            {/* Seed Number */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
                  Seed Number
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="p-3 text-sm bg-gray-800 border border-gray-700">
                      <p>Use the same seed to reproduce similar results</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                placeholder="Leave empty for random"
                className={`bg-gray-900 border border-gray-700 hover:border-gray-500 focus:border-gray-400 text-white transition-colors ${
                  hasValue(formState.seed) ? activeInputClass : ""
                }`}
              />
              <p className="text-xs text-gray-500">
                Use the same seed to get similar results
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Generate Button */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <Button
            size="lg"
            className="relative w-full h-14 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(76,29,149,0.2)] hover:shadow-[0_0_25px_rgba(76,29,149,0.3)] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-violet-600/50 to-fuchsia-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-base">Generate Photos</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 pl-6 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-800">
        <Tabs defaultValue="generated" className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 flex-shrink-0 border-b border-gray-800 pr-6">
            <TabsList className="bg-transparent relative space-x-6 my-2">
              <TabsTrigger
                value="generated"
                className="relative px-4 py-2 text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 hover:text-gray-200 data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-400 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span>✨ Generated</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="relative px-4 py-2 text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 hover:text-gray-200 data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-400"
              >
                <div className="flex items-center gap-2">
                  <span>💾 Saved</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="examples"
                className="relative px-4 py-2 text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 hover:text-gray-200 data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-blue-400"
              >
                <div className="flex items-center gap-2">
                  <span>🎯 Examples</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="generated"
            className="mt-0 flex-1 overflow-y-auto pr-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Photo 1 */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60"
                  alt="Generated portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() =>
                          setSelectedImage(
                            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&auto=format&fit=crop&q=60"
                          )
                        }
                      >
                        <Maximize2 className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Download className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Copy className="h-7 w-7" />
                      </Button>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-black/50 text-sm text-white/90 border border-white/20 backdrop-blur-sm">
                      Click to copy prompt
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo 2 */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60"
                  alt="Generated portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() =>
                          setSelectedImage(
                            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&auto=format&fit=crop&q=60"
                          )
                        }
                      >
                        <Maximize2 className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Download className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Copy className="h-7 w-7" />
                      </Button>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-black/50 text-sm text-white/90 border border-white/20 backdrop-blur-sm">
                      Click to copy prompt
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo 3 */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60"
                  alt="Generated portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() =>
                          setSelectedImage(
                            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&auto=format&fit=crop&q=60"
                          )
                        }
                      >
                        <Maximize2 className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Download className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Copy className="h-7 w-7" />
                      </Button>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-black/50 text-sm text-white/90 border border-white/20 backdrop-blur-sm">
                      Click to copy prompt
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo 4 */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&auto=format&fit=crop&q=60"
                  alt="Generated portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() =>
                          setSelectedImage(
                            "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&auto=format&fit=crop&q=60"
                          )
                        }
                      >
                        <Maximize2 className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Download className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Copy className="h-7 w-7" />
                      </Button>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-black/50 text-sm text-white/90 border border-white/20 backdrop-blur-sm">
                      Click to copy prompt
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo 5 */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60"
                  alt="Generated portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() =>
                          setSelectedImage(
                            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1600&auto=format&fit=crop&q=60"
                          )
                        }
                      >
                        <Maximize2 className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Download className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Copy className="h-7 w-7" />
                      </Button>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-black/50 text-sm text-white/90 border border-white/20 backdrop-blur-sm">
                      Click to copy prompt
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo 6 */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"
                  alt="Generated portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() =>
                          setSelectedImage(
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&auto=format&fit=crop&q=60"
                          )
                        }
                      >
                        <Maximize2 className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Download className="h-7 w-7" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Copy className="h-7 w-7" />
                      </Button>
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-black/50 text-sm text-white/90 border border-white/20 backdrop-blur-sm">
                      Click to copy prompt
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="saved"
            className="mt-0 flex-1 overflow-y-auto pr-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Saved Photos */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60"
                  alt="Saved portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Save className="h-7 w-7" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example Photos */}
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60"
                  alt="Example portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Save className="h-7 w-7" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="examples"
            className="mt-0 flex-1 overflow-y-auto pr-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="group aspect-[3/4] relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60"
                  alt="Example portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
                      >
                        <Save className="h-7 w-7" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-50 duration-300">
            <img
              src={selectedImage}
              alt="Large preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
