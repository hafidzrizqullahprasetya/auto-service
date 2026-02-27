"use client";

import { Icons } from "@/components/icons";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  footer?: ReactNode;
  hideFooter?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

export function BaseModal({
  title,
  description,
  icon,
  children,
  onClose,
  maxWidth = "2xl",
  footer,
  hideFooter = false,
}: BaseModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={cn(
          "relative w-full max-h-[95vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-dark border border-stroke dark:border-dark-3 flex flex-col animate-slide-up",
          maxWidthClasses[maxWidth]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke p-5 dark:border-dark-3 bg-gray-50 dark:bg-dark-2">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-dark dark:text-white">
                {title}
              </h3>
              {description && (
                <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-dark-5 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors active:scale-90"
          >
            <Icons.Plus size={24} className="rotate-45" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && (footer || children) && (
          <div className="border-t border-stroke p-5 dark:border-dark-3 bg-gray-50 dark:bg-dark-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
