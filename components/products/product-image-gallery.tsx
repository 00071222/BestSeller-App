"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const mainImage = images[activeIndex] ?? "https://placehold.co/600x600?text=Sin+imagen";
  
  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden shadow-sm border border-border/50 transition-all">
        <Image
          src={mainImage}
          alt={`${alt} - Imagen principal`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                activeIndex === idx
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${alt} - miniatura ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
