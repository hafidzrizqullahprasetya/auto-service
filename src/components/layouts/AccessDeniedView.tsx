"use client";

import { Icons } from "@/components/Icons";
import Link from "next/link";

interface AccessDeniedViewProps {
  homeRoute: string;
}

export function AccessDeniedView({ homeRoute }: AccessDeniedViewProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-2xl border border-stroke bg-white p-8 text-center shadow-sm dark:border-dark-3 dark:bg-gray-dark">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red/10 text-red dark:bg-red/20">
        <Icons.Lock size={40} className="stroke-2" />
      </div>
      <h3 className="mb-2 text-2xl font-black text-dark dark:text-white sm:text-3xl">
        Akses Ditolak
      </h3>
      <p className="mx-auto mb-8 max-w-md text-sm font-medium text-dark-5 dark:text-dark-6 sm:text-base">
        Maaf, Anda tidak memiliki hak akses untuk membuka halaman ini. Silakan hubungi Administrator atau beralih ke halaman yang diizinkan.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={homeRoute}
          className="inline-flex items-center justify-center rounded-lg bg-dark px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-dark-2 dark:bg-white dark:text-dark dark:hover:bg-gray-2"
        >
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
