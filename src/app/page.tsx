import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm supports-[backdrop-filter]:bg-gray-900/50">
        <div className="container max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="HeadshotPro Logo"
              width={28}
              height={28}
              className="shrink-0"
            />
            <span className="font-semibold text-white">HeadshotPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Train Your Personal AI Model
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
                  Create stunning professional headshots with our AI model.
                  Upload your photos, select your styles, and get amazing
                  results in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white"
                  >
                    Create Your Model
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/examples">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800/80"
                  >
                    View Examples
                  </Button>
                </Link>
              </div>

              {/* Features List */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-white font-medium">Custom AI Model</h3>
                  <p className="text-sm text-gray-400">
                    Train a model on your photos for personalized results
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-medium">Multiple Styles</h3>
                  <p className="text-sm text-gray-400">
                    Generate photos in various professional styles
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-medium">Fast Training</h3>
                  <p className="text-sm text-gray-400">
                    Get your model trained and ready in 1-2 hours
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-medium">Custom Prompts</h3>
                  <p className="text-sm text-gray-400">
                    Generate new photos with your own prompts
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative aspect-square lg:aspect-[4/3] rounded-xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <Image
                src="/hero.png"
                alt="AI Generated Headshots Examples"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-gray-900/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-sm text-gray-400">
                  Example outputs from our AI model
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 text-center">
            © 2024 HeadshotPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
