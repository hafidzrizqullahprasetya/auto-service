"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SocialAccounts } from "./_components/social-accounts";
import type { AuthUser } from "@/hooks/useAuth";

// ── Persona data untuk setiap user ────────────────────────────────────────────
const PERSONAS: Record<
  string,
  {
    name: string;
    role: string;
    jobTitle: string;
    bio: string;
    image: string;
    cover: string;
    stats: { layanan: string; rating: string };
  }
> = {
  owner: {
    name: "Suryo Atmojo",
    role: "Owner",
    jobTitle: "Pemilik Bengkel",
    bio: "Pemilik AutoService Premium Garage selama 12 tahun. Berpengalaman dalam manajemen bisnis otomotif, pengembangan layanan pelanggan premium, dan pengelolaan SDM mekanik berpengalaman.",
    image: "/images/user/user-01.png",
    cover: "/images/cover/cover-01.png",
    stats: { layanan: "12 Th", rating: "5.0/5.0" },
  },
  admin: {
    name: "Larasati",
    role: "Admin",
    jobTitle: "Administrator & Operasional",
    bio: "Bertanggung jawab atas operasional harian bengkel, manajemen karyawan, koordinasi antrean servis, dan pengelolaan inventori sparepart secara akurat dan efisien.",
    image: "/images/user/user-02.png",
    cover: "/images/cover/cover-01.png",
    stats: { layanan: "3.4K+", rating: "4.8/5.0" },
  },
  kasir: {
    name: "Budi Setiadi",
    role: "Kasir",
    jobTitle: "Kasir & Transaksi",
    bio: "Mengelola transaksi pembayaran harian, pembuatan invoice, dan rekap keuangan sederhana. Memastikan setiap transaksi tercatat dengan tepat di AutoService Premium Garage.",
    image: "/images/user/user-03.png",
    cover: "/images/cover/cover-01.png",
    stats: { layanan: "2.1K+", rating: "4.7/5.0" },
  },
};

const ROLE_BADGE: Record<string, string> = {
  Owner: "bg-dark text-white",
  Admin: "bg-blue-100 text-blue-700",
  Kasir: "bg-amber-100 text-amber-700",
};

export default function Page() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {}
    }
  }, []);

  const persona = user ? (PERSONAS[user.username] ?? PERSONAS.owner) : null;
  if (!persona) return null;

  return (
    <div className="mx-auto w-full max-w-[970px] pb-10">
      <Breadcrumb pageName="Profil Pengguna" />

      <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-none dark:border-dark-3 dark:bg-gray-dark">
        {/* Cover */}
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={persona.cover}
            alt="cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          {/* Avatar */}
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="drop-shadow-2 relative">
              <Image
                src={persona.image}
                width={160}
                height={160}
                className="overflow-hidden rounded-full"
                alt={persona.name}
              />
            </div>
          </div>

          <div className="mt-4">
            {/* Name + role badge */}
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-2xl font-bold text-dark dark:text-white">
                {persona.name}
              </h3>
              <span
                className={`rounded-md px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${ROLE_BADGE[persona.role] ?? "bg-gray-100 text-dark"}`}
              >
                {persona.role}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-dark-5">
              {persona.jobTitle}
            </p>

            {/* Stats */}
            <div className="mx-auto mb-6 mt-6 grid max-w-[450px] grid-cols-3 rounded-lg border border-stroke bg-white py-3 shadow-none dark:border-dark-3 dark:bg-gray-dark">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3">
                <span className="text-[11px] font-medium text-dark-5">
                  Username
                </span>
                <span className="text-sm font-bold text-dark dark:text-white">
                  {user?.username}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3">
                <span className="text-[11px] font-medium text-dark-5">
                  Layanan
                </span>
                <span className="text-sm font-bold text-dark dark:text-white">
                  {persona.stats.layanan}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4">
                <span className="text-[11px] font-medium text-dark-5">
                  Rating
                </span>
                <span className="text-sm font-bold text-dark dark:text-white">
                  {persona.stats.rating}
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="mx-auto max-w-[720px] border-t border-stroke pt-6 dark:border-dark-3">
              <h4 className="text-sm font-bold text-dark dark:text-white">
                Biografi Singkat
              </h4>
              <p className="mt-4 text-sm font-medium leading-relaxed text-dark-5">
                {persona.bio}
              </p>
            </div>

            <SocialAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}
