import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning" | "info" | "primary" | "secondary" | "neutral";
  className?: string;
  outline?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  className,
  outline = false,
}: BadgeProps) {
  const variants: Record<string, string> = {
    // Status semantik (pakai accent colors)
    success: outline
      ? "border border-green text-green bg-transparent"
      : "bg-green-100 text-green",
    danger: outline
      ? "border border-red text-red bg-transparent"
      : "bg-red-100 text-red",
    warning: outline
      ? "border border-yellow text-yellow bg-transparent"
      : "bg-yellow-100 text-yellow",
    info: outline
      ? "border border-blue text-blue bg-transparent"
      : "bg-blue-100 text-blue",
    // Non-semantik (monochrome)
    primary: outline
      ? "border border-dark text-dark bg-transparent"
      : "bg-gray-100 text-dark",
    secondary: outline
      ? "border border-dark-5 text-dark-5 bg-transparent"
      : "bg-gray-100 text-dark-5",
    neutral: outline
      ? "border border-gray-300 text-dark-5 bg-transparent"
      : "bg-gray-100 text-dark-5",
  };

  return (
    <span
      className={cn(
        "inline-flex max-w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        variants[variant] ?? variants.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
