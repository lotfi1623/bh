"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-white text-black hover:shadow-glow hover:bg-white/95 border border-transparent hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-transparent text-white border border-white/20 hover:border-white hover:shadow-glow-sm hover:scale-[1.02] active:scale-[0.98]",
  ghost: "bg-transparent text-white hover:bg-white/5",
  outline:
    "bg-transparent text-white border border-white/10 hover:border-white/40 hover:shadow-glow-sm hover:scale-[1.02] active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2 text-xs tracking-[0.2em]",
  md: "px-8 py-3.5 text-xs tracking-[0.25em]",
  lg: "px-10 py-4 text-sm tracking-[0.3em]",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  href,
  onClick,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-sans uppercase font-medium transition-all duration-300 ease-out disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
