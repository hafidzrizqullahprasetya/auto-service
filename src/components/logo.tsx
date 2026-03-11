"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-32" />; 

  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-3 group">
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
        <div className="absolute inset-0 rounded-xl bg-secondary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-2xl font-black tracking-tighter text-dark dark:text-white flex items-center">
          AUTO<span className="text-secondary italic ml-0.5">SERVICE</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-[1px] w-3 bg-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-dark-5 dark:text-dark-6">
            Premium Garage
          </span>
        </div>
      </div>
    </Link>
  );
}
