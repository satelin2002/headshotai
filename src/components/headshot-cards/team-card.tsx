import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Users } from "lucide-react";

export function TeamHeadshotCard() {
  return (
    <Card className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-900/50 border-gray-800">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Team Headshots
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Save hundreds of dollars on corporate headshots without ever having
            to leave the office.
          </p>
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/50">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-gray-300">
                  <span className="font-medium text-white">
                    Team management
                  </span>{" "}
                  - easily invite your team members
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-gray-300">
                  <span className="font-medium text-white">Cost effective</span>{" "}
                  - save up to 10X the cost
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-gray-300">
                  <span className="font-medium text-white">
                    Simple coordination
                  </span>{" "}
                  - coordinate from one simple app
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-11 md:h-12 font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 text-white hover:text-white border-gray-700 text-base transition-all duration-300"
        >
          <Users className="mr-2 h-10 w-10 border border-white rounded-full p-0" />
          Create a new team
        </Button>
      </div>
    </Card>
  );
}
