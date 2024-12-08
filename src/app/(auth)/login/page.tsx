import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  TypographyH3,
  TypographyMuted,
  TypographyLarge,
  TypographySmall,
} from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LoginPage() {
  const features = [
    {
      text: "Money back ",
      highlight: "guaranteed",
    },
    {
      text: "Headshots ready in ",
      highlight: "minutes",
    },
    {
      text: "We respect your ",
      highlight: "privacy",
    },
    {
      text: "No ",
      highlight: "physical photoshoot",
      text2: " required",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950">
      <div className="absolute inset-0 -z-10 bg-gray-950">
        <div className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-purple-950/50 to-blue-900/30 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-3 mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Image
            src="/logo.svg"
            alt="HeadshotsByAI Logo"
            width={32}
            height={32}
            className="shrink-0"
          />
          <TypographyLarge className="font-semibold tracking-tight text-white text-2xl">
            Headshots.AI
          </TypographyLarge>
        </div>
        <TypographyMuted className="text-center text-lg text-gray-400 relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-gray-700 after:to-transparent">
          Professional business headshots, without physical photo shoot.
        </TypographyMuted>
      </div>

      <Card className="w-full max-w-md relative bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6 space-y-2">
          <div className="space-y-4 mb-4">
            <TypographyH3 className="text-center tracking-tight text-white">
              Welcome back
            </TypographyH3>
            <TypographyMuted className="text-center text-gray-400">
              Create an account or log in with an existing one to continue.
            </TypographyMuted>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 font-semibold bg-white hover:bg-gray-100 text-gray-900 transition-all border-gray-200"
            asChild
          >
            <Link href="/api/auth/google">
              <FcGoogle className="mr-2 h-8 w-8" />
              Sign in with Google
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 font-semibold bg-[#0077B5] hover:bg-[#006399] hover:text-white transition-all text-white border-[#0077B5]"
            asChild
          >
            <Link href="/api/auth/linkedin">
              <FaLinkedin className="mr-2 h-8 w-8 text-white " />
              Sign in with LinkedIn
            </Link>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">OR</span>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
            />
            <Button
              variant="outline"
              className="w-full h-12 font-semibold bg-gray-900 hover:bg-gray-800 hover:text-white text-gray-300 border-gray-700 transition-all"
              asChild
            >
              <Link href="/login/email">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Continue with Email
              </Link>
            </Button>
          </div>

          <div className="space-y-6 pt-2">
            <div className="border border-gray-800 rounded-lg p-4 space-y-3 bg-gray-900/50">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 font-medium flex-shrink-0" />
                  <TypographyMuted className="text-gray-400">
                    {feature.text}
                    <span className="text-white font-medium">
                      {feature.highlight}
                    </span>
                    {feature.text2}
                  </TypographyMuted>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-gradient-to-br from-blue-400/20 via-violet-400/20 to-fuchsia-400/20 px-4 py-3 text-center border border-blue-300/20 backdrop-blur-sm">
              <TypographyLarge className="text-2xl bg-gradient-to-r from-blue-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent font-bold tracking-tight">
                613,030 Headshots
              </TypographyLarge>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TypographyMuted className="bg-gradient-to-r from-blue-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                  created for happy customers
                </TypographyMuted>
                <div className="flex -space-x-2">
                  <Avatar
                    key="1"
                    className="h-6 w-6 border-2 border-blue-400/30"
                  >
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User 1"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-300 to-violet-300 text-xs text-gray-800">
                      U1
                    </AvatarFallback>
                  </Avatar>
                  <Avatar
                    key="2"
                    className="h-6 w-6 border-2 border-violet-400/30"
                  >
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User 2"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-violet-300 to-fuchsia-300 text-xs text-gray-800">
                      U2
                    </AvatarFallback>
                  </Avatar>
                  <Avatar
                    key="3"
                    className="h-6 w-6 border-2 border-fuchsia-400/30"
                  >
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User 3"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-fuchsia-300 to-blue-300 text-xs text-gray-800">
                      U3
                    </AvatarFallback>
                  </Avatar>
                  <Avatar
                    key="4"
                    className="h-6 w-6 border-2 border-blue-400/30"
                  >
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User 4"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-300 to-violet-300 text-xs text-gray-800">
                      U4
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
