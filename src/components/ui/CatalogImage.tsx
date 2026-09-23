"use client";

import Image from "next/image";
import { isCatalogImage } from "@/lib/api";
import { cn } from "@/lib/utils";

type CatalogImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

/** API-uploaded images use a plain img tag (works on any LAN IP without next/image config). */
export function CatalogImage({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
}: CatalogImageProps) {
  if (!src) {
    return (
      <div
        className={cn(fill && "absolute inset-0", "bg-white/5", className)}
        aria-hidden
      />
    );
  }

  if (isCatalogImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
