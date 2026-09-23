"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

export function FadeUp({ children, className, delay = 0, as = "div" }: FadeUpProps) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </Component>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <FadeUp
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-muted">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm md:text-base text-muted leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      )}
    </FadeUp>
  );
}
