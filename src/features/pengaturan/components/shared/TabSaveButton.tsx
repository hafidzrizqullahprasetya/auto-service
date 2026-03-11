"use client";

import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

interface TabSaveButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  label: string;
  type?: "button" | "submit";
  className?: string;
}

export function TabSaveButton({
  onClick,
  loading = false,
  disabled = false,
  label,
  type = "submit",
  className,
}: TabSaveButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group relative flex w-full items-center justify-center gap-2 rounded-lg bg-dark px-10 py-3 text-sm font-bold text-white transition-all hover:bg-opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-dark sm:w-auto",
        className
      )}
    >
      {loading ? (
        <>
          <Icons.RefreshCcw className="h-4 w-4 animate-spin text-current" />
          <span>Menyimpan...</span>
        </>
      ) : (
        <>
          <Icons.Check className="h-4 w-4 text-current transition-transform group-hover:scale-110" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
