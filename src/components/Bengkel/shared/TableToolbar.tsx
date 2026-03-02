import React from "react";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/components/Bengkel/shared";

interface TableToolbarProps {
  title: string;
  description?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  filterActions?: React.ReactNode;
}

export function TableToolbar({
  title,
  description,
  onSearch,
  searchPlaceholder = "Cari data...",
  primaryAction,
  filterActions,
}: TableToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 className="text-xl font-bold text-dark dark:text-white">
          {title}
        </h4>
        {description && (
          <p className="mt-1 text-sm font-medium text-dark-5 dark:text-dark-6">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {onSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="rounded-md border border-stroke px-10 py-2 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 w-full sm:w-[250px]"
            />
            <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5" />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {filterActions}
          
          <ActionButton variant="outline" icon={<Icons.Database size={16} />} title="Filter & Urutkan" />

          {primaryAction && (
            <ActionButton 
              variant="primary" 
              label={primaryAction.label} 
              onClick={primaryAction.onClick}
              icon={primaryAction.icon}
              className="px-5 py-2" 
            />
          )}
        </div>
      </div>
    </div>
  );
}
