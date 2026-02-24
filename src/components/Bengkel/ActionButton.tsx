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
  const variants = {
    primary: "bg-primary/10 text-primary hover:bg-primary hover:text-white",
    secondary: "bg-secondary/10 text-secondary hover:bg-secondary hover:text-white",
    danger: "bg-red/10 text-red hover:bg-red hover:text-white",
    ghost: "text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3",
    outline: "border border-stroke hover:border-primary hover:text-primary dark:border-dark-3",
  };

  const sizes = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "p-2.5 text-base",
  };

  const hasLabel = !!label || !!children;

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        hasLabel && "px-3 py-1.5 font-bold uppercase tracking-tight",
        className
      )}
      {...props}
    >
      {icon}
      {label || children}
    </button>
  );
}
