import { cn } from "@/lib/utils";
import React from "react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function ActionButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  className,
  children,
  ...props
}: ActionButtonProps) {
  // Monochrome + accent — primary sekarang hitam bukan ungu
  const variants: Record<string, string> = {
    primary:  "bg-dark text-white hover:bg-dark/80",
    secondary: "bg-gray-100 text-dark hover:bg-gray-200",
    danger:   "bg-red-50 text-red hover:bg-red hover:text-white",
    ghost:    "text-dark-5 hover:bg-gray-1 hover:text-dark",
    outline:  "border border-stroke text-dark-5 hover:border-dark hover:text-dark",
  };

  const sizes: Record<string, string> = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "p-2.5 text-base",
  };

  const hasLabel = !!label || !!children;

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        hasLabel && "px-3 py-1.5 font-semibold",
        className
      )}
      {...props}
    >
      {icon}
      {label || children}
    </button>
  );
}
