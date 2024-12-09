"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LightboxProps {
  children: React.ReactNode;
  image: string;
  className?: string;
  title?: string;
}

export function Lightbox({
  children,
  image,
  className,
  title = "Image Preview", // Default title for accessibility
}: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={className} onClick={() => setIsOpen(true)}>
        {children}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl p-0 bg-transparent border-none [&>button]:text-white [&>button]:hover:text-white/80">
          <VisuallyHidden asChild>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
          <div className="relative aspect-[6/4]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
