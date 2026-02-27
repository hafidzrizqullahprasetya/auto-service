import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning" | "info" | "primary" | "secondary";
  className?: string;
  outline?: boolean;
}

export function Badge({ 
  children, 
  variant = "primary", 
  className, 
  outline = false 
}: BadgeProps) {
  const variants = {
    success: outline 
      ? "border-green text-green bg-transparent" 
      : "bg-[#219653]/[0.1] text-[#219653]",
    danger: outline 
      ? "border-red text-red bg-transparent" 
      : "bg-[#D34053]/[0.1] text-[#D34053]",
    warning: outline 
      ? "border-[#FFA70B] text-[#FFA70B] bg-transparent" 
      : "bg-[#FFA70B]/[0.1] text-[#FFA70B]",
    info: outline 
      ? "border-blue text-blue bg-transparent" 
      : "bg-blue-light-5 text-blue",
    primary: outline 
      ? "border-primary text-primary bg-transparent" 
      : "bg-primary/10 text-primary",
    secondary: outline 
      ? "border-secondary text-secondary bg-transparent" 
      : "bg-secondary/10 text-secondary",
  };

  return (
    <span
      className={cn(
        "max-w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
        outline ? "border" : "",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
