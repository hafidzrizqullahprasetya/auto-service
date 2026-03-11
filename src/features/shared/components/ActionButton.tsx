import { cn } from "@/lib/utils";
import React from "react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "edit" | "delete" | "view" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function ActionButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  className,
  children,
  loading,
  ...props
}: ActionButtonProps) {
  // Monochrome + accent — primary sekarang hitam bukan ungu
  const variants: Record<string, string> = {
    primary:  "bg-dark text-white hover:bg-dark/80",
    secondary: "bg-gray-100 text-dark hover:bg-gray-200",
    danger:   "bg-red-50 text-red hover:bg-red hover:text-white dark:bg-red/10 dark:hover:bg-red",
    ghost:    "text-dark-5 hover:bg-gray-1 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white",
    outline:  "border border-stroke text-dark-5 hover:border-dark hover:text-dark dark:border-dark-3 dark:hover:border-white dark:hover:text-white",
    edit:     "bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-600 dark:bg-orange-500/10 dark:hover:bg-orange-500/20",
    delete:   "bg-red/10 text-red hover:bg-red/20 hover:text-red-600 dark:bg-red/10 dark:hover:bg-red/20",
    view:     "bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20",
    success:  "bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 dark:bg-green-500/10 dark:hover:bg-green-500/20",
  };

  const sizes: Record<string, string> = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "p-2.5 text-base",
  };

  const hasLabel = !!label || !!children;
  const tooltip = props.title;

  return (
    <div className="relative flex items-center justify-center">
      <button
        className={cn(
          "peer flex items-center justify-center gap-2 rounded-lg disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          hasLabel && "px-3 py-1.5 font-semibold",
          className
        )}
        disabled={props.disabled || loading}
        {...props}
        title="" // Clear native title to avoid double tooltips
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {label || children}
          </span>
        ) : (
          <>
            {icon}
            {label || children}
          </>
        )}
      </button>

      {/* Custom Tooltip */}
      {tooltip && (
        <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-dark px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-all peer-hover:opacity-100 dark:bg-dark-2 z-[9999]">
          <div className="relative">
            {tooltip}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-dark dark:border-t-dark-2" />
          </div>
        </div>
      )}
    </div>
  );
}
