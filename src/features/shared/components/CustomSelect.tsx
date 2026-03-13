"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SelectOption {
  id: string | number;
  label: string;
  sublabel?: string;
}

export interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  loading?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({
  label,
  placeholder = "— Pilih —",
  options,
  value,
  onChange,
  loading = false,
  error,
  required = false,
  disabled = false,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (opt) => opt.id === value || String(opt.id) === String(value),
  );

  if (loading) {
    return (
      <div className={className}>
        {label && (
          <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
            {label}
            {required && <span className="ml-1 select-none text-red">*</span>}
          </label>
        )}
        <Skeleton className="mt-2.5 h-12 rounded-lg" />
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
          {label}
          {required && <span className="ml-1 select-none text-red">*</span>}
        </label>
      )}
      <div className="relative mt-2.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border-2 border-stroke bg-white px-4 py-3 text-left text-sm font-medium text-dark outline-none transition focus:border-dark disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white dark:disabled:bg-dark",
            error && "border-red-500 focus:border-red-500",
          )}
        >
          <span
            className={
              selectedOption ? "text-dark dark:text-white" : "text-dark-6"
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <Icons.ChevronDown
            size={18}
            className={cn(
              "text-dark-5 transition-transform dark:text-dark-6",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-start justify-between border-b border-stroke/30 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-gray-1 dark:border-dark-3/30 dark:hover:bg-dark-3"
                >
                  <div>
                    <p className="font-medium text-dark dark:text-white">
                      {option.label}
                    </p>
                    {option.sublabel && (
                      <p className="text-xs text-dark-5">{option.sublabel}</p>
                    )}
                  </div>
                  {value === option.id ||
                  String(value) === String(option.id) ? (
                    <Icons.Check size={18} className="text-secondary" />
                  ) : null}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-dark-5">
                Tidak ada data
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
