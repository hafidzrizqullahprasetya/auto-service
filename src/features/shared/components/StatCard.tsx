import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format-number";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  bg?: string;
  isMoney?: boolean;
  suffix?: string;
  growth?: {
    value: number;
    isUp: boolean;
  };
  variant?: "horizontal" | "vertical"; 
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color = "text-primary",
  bg = "bg-primary/10",
  isMoney = false,
  suffix,
  growth,
  variant = "horizontal",
  className,
}: StatCardProps) {
  const displayValue = isMoney ? formatCurrency(Number(value)) : value;

  if (variant === "vertical") {
    return (
      <div className={cn(
        "rounded-[10px] border border-stroke bg-white p-4 shadow-1 transition-all hover:shadow-md dark:border-dark-3 dark:bg-gray-dark md:p-6",
        className
      )}>
        <div className="flex items-center justify-between">
          <div className={cn("flex h-11.5 w-11.5 items-center justify-center rounded-full text-primary", bg, color)}>
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold tracking-tight text-dark dark:text-white">
              {displayValue} {suffix && <span className="text-xs font-medium text-dark-5">{suffix}</span>}
            </h4>
            <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
              {label}
            </span>
          </div>

          {growth && (
            <span className={cn("flex items-center gap-1 text-sm font-medium", growth.isUp ? 'text-green' : 'text-red')}>
              {growth.value}%
              <svg
                className={cn("fill-current", !growth.isUp && "rotate-180")}
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.35716 2.47738L0.508974 6.22914C0.223089 6.5068 0.223089 6.9569 0.508974 7.23456C0.794859 7.51222 1.25731 7.51222 1.54319 7.23456L5 3.87738L8.45681 7.23456C8.74269 7.51222 9.20514 7.51222 9.49103 7.23456C9.77691 6.9569 9.77691 6.5068 9.49103 6.22914L5.64284 2.47738C5.35695 2.19972 4.8945 2.19972 4.60862 2.47738H4.35716Z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (Icon Left)
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-stroke bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-dark-3 dark:bg-gray-dark",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110", bg, color)}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-dark-5 dark:text-dark-6 line-clamp-1">
            {label}
          </p>
          <h4 className="text-xl font-black text-dark dark:text-white">
            {displayValue} {suffix && <span className="text-xs font-medium text-dark-5">{suffix}</span>}
          </h4>
        </div>
      </div>
      {/* Decorative background icon */}
      <div className={cn("absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.03] transition-transform group-hover:scale-125", color)}>
        {icon}
      </div>
    </div>
  );
}
