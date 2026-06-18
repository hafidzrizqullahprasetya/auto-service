"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";

interface LogoProps {
  onClick?: () => void;
}

function splitWorkshopName(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) {
    return { line1: name, line2: "" };
  }
  if (words.length === 2) {
    return { line1: words[0], line2: words[1] };
  }
  const line1 = words.slice(0, 2).join(" ");
  const line2 = words.slice(2).join(" ");
  return { line1, line2 };
}

export function Logo({ onClick }: LogoProps) {
  const [mounted, setMounted] = useState(false);
  const { data: settings } = useSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-32" />;

  const rawName = settings?.name || "Auto Service Premium Garage";
  const { line1, line2 } = splitWorkshopName(rawName);
  const words1 = line1.split(" ");

  return (
    <Link href="/" onClick={onClick} className="group flex items-center gap-3">
      <div className="relative flex items-center justify-center rounded-xl bg-dark p-2 shadow-lg transition-all duration-300 group-hover:scale-110 dark:bg-white/10 dark:backdrop-blur-md">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Main Car/Garage Silhouette */}
          <path
            d="M3 9L12 3L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
            className="dark:stroke-white"
          />
          {/* Accent Line - Safety Orange */}
          <path
            d="M7 14H17"
            stroke="#F87117"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M9 18H15"
            stroke="#F87117"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-70"
          />
        </svg>
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-secondary/20 opacity-0 blur-lg transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="flex items-center text-2xl font-black tracking-tighter text-dark dark:text-white uppercase">
          {words1[0]}
          {words1[1] && <span className="ml-0.5 italic text-secondary">{words1[1]}</span>}
        </span>
        {line2 && (
          <div className="flex items-center gap-1.5">
            <span className="h-[1px] w-3 bg-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-dark-5 dark:text-dark-6">
              {line2}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
