import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, User } from "lucide-react";

export function IndividualHeadshotCard() {
  return (
    <Card className="p-4 md:p-6 lg:p-8 space-y-6 relative overflow-hidden bg-gray-900/50 border-gray-800">
      <div className="space-y-6">
        <div className="space-y-3">
          {/* Header with Popular badge */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Individual Headshots
            </h2>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 animate-in fade-in slide-in-from-top-4 duration-1000 fill-mode-forwards">
              Popular
            </div>
          </div>

          <p className="text-gray-400 text-sm md:text-base">
            The fastest way to get professional headshots you can use anywhere.
          </p>
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/50">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-gray-300">
                  <span className="font-medium text-white">
                    No studio visit required
                  </span>{" "}
                  - No need to commute to a studio
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-gray-300">
                  <span className="font-medium text-white">
                    Shoot from anywhere
                  </span>{" "}
                  - Get it done from home or office.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-gray-300">
                  <span className="font-medium text-white">Save money</span> -
                  8x cheaper than a physical photoshoot
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Button className="w-full h-11 md:h-12 font-semibold bg-gradient-to-r from-blue-400/90 via-violet-400/90 to-fuchsia-400/90 hover:from-blue-500/90 hover:via-violet-500/90 hover:to-fuchsia-500/90 text-white text-base transition-all duration-300">
          <User className="mr-2 h-10 w-10 border border-white rounded-full p-0.1" />
          Create your own headshot
        </Button>
      </div>
    </Card>
  );
}
