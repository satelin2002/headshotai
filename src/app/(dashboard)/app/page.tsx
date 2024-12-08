import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";
import { GalleryCard } from "@/components/gallery-card";
import { PhotoStylesGrid } from "@/components/photo-styles-grid";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Add some mock data
const mockGalleries = [
  {
    id: "1",
    title: "Professional LinkedIn Photos",
    photoCount: 15,
    thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    date: "March 15, 2024",
    status: "ready" as const,
    expiryDate: "2025-04-14",
  },
  {
    id: "2",
    title: "Corporate Team Headshots",
    photoCount: 24,
    date: "March 14, 2024",
    status: "processing" as const,
    progress: 65,
    expiryDate: "2024-04-13",
  },
  {
    id: "3",
    title: "Creative Portfolio Shots",
    photoCount: 12,
    thumbnail: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40",
    date: "March 10, 2024",
    status: "ready" as const,
    expiryDate: "2024-03-18",
  },
  {
    id: "4",
    title: "Executive Portraits",
    photoCount: 18,
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    date: "March 5, 2024",
    status: "ready" as const,
    expiryDate: "2024-04-14",
  },
];

export default function AppPage() {
  const galleries = mockGalleries; // Replace the empty array with mock data

  const handleRename = (galleryId: string, newTitle: string) => {
    // Update gallery title in your backend
    // For now, just show a toast
    toast.success(`Gallery renamed to "${newTitle}"`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-950">
      <div className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-10">
        {/* Background gradient effect */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-purple-950/50 to-blue-900/30 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="max-w-screen-2xl mx-auto space-y-12 md:space-y-8">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Your Headshot Galleries
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Create and manage multiple headshot collections
              </p>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white font-medium relative group overflow-hidden shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              asChild
            >
              <Link href="/app/create">
                <div className="relative flex items-center">
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="relative">New Headshot Collection</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-violet-400/10 to-fuchsia-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
          </div>

          {/* Gallery Grid or Empty State */}
          {galleries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <GalleryCard
                  key={gallery.id}
                  title={gallery.title}
                  photoCount={gallery.photoCount}
                  thumbnail={gallery.thumbnail}
                  date={gallery.date}
                  status={gallery.status}
                  progress={gallery.progress}
                  expiryDate={gallery.expiryDate}
                  onRename={(newTitle) => handleRename(gallery.id, newTitle)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 border border-dashed border-gray-800 rounded-xl bg-gray-900/50">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-3 bg-gray-800/50 rounded-full relative group">
                  <Plus className="h-6 w-6 text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                  {/* Animated ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-gray-700/50 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Create your headshot gallery
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    Start by creating a new headshot gallery. Each gallery can
                    contain multiple professional headshots with different
                    styles.
                  </p>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white font-medium relative group overflow-hidden"
                  asChild
                >
                  <Link href="/app/create">
                    <div className="relative flex items-center">
                      <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                      Create your Headshot Collection
                    </div>
                  </Link>
                </Button>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl pt-8">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-white font-medium">
                        No studio required
                      </p>
                      <p className="text-sm text-gray-400">
                        Get it done from home or office
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-white font-medium">
                        Professional quality
                      </p>
                      <p className="text-sm text-gray-400">
                        AI-powered photo enhancement
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                    <div>
                      <p className="text-white font-medium">Save money</p>
                      <p className="text-sm text-gray-400">
                        8x cheaper than a photoshoot
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Only show example styles when there are no galleries */}
          {galleries.length === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Example Styles
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Preview our collection of professional headshot styles. Each
                  style is designed to match different professional contexts and
                  preferences.
                </p>
              </div>

              <div className="border rounded-xl p-6 md:p-8 bg-gray-900/50 border-gray-800">
                <PhotoStylesGrid />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
