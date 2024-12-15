"use client";

import { Button } from "@/components/ui/button";
import { TypographyLarge } from "@/components/ui/typography";
import { Globe, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "中文" },
] as const;

function LanguageDisplay({ value }: { value: string }) {
  const language = languages.find((lang) => lang.value === value);
  return (
    <span className="flex items-center gap-2">
      <span className="text-base font-medium">{value.toUpperCase()}</span>
      <span className="text-muted-foreground text-base">{language?.label}</span>
    </span>
  );
}

export function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm supports-[backdrop-filter]:bg-gray-900/50">
      <div className="flex h-16 items-center px-4 md:px-8">
        <div className="flex items-center gap-8 w-full">
          <Link href="/app" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="HeadshotPro Logo"
              width={28}
              height={28}
              className="shrink-0"
            />
            <TypographyLarge className="font-semibold hidden sm:block text-white text-base">
              HeadshotPro
            </TypographyLarge>
          </Link>

          <div className="flex items-center ml-auto gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-gray-300 hover:text-white hover:bg-gray-800/80 transition-colors text-base"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline font-medium text-base">
                Support
              </span>
            </Button>

            <div className="h-5 w-px bg-gray-800" />

            <Select defaultValue="en">
              <SelectTrigger className="w-[170px] h-9 bg-gray-900/90 border-gray-800 text-gray-300 hover:bg-gray-800/80 transition-colors text-base">
                <SelectValue
                  placeholder="Select language"
                  className="text-base"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                {languages.map((lang) => (
                  <SelectItem
                    key={lang.value}
                    value={lang.value}
                    className="text-gray-300 hover:text-white focus:text-white focus:bg-gray-800/80 transition-colors text-base"
                  >
                    <LanguageDisplay value={lang.value} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-5 w-px bg-gray-800" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                  redirect: true,
                  redirectTo: "/login",
                })
              }
              className="h-9 text-gray-300 hover:text-white hover:bg-gray-800/80 transition-colors text-base"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-medium text-base">
                Logout
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
