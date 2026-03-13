"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import type { AuthUser } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { Notify } from "@/utils/notify";

const ROLE_AVATARS: Record<string, string> = {
  owner: "/images/user/user-03.png",
  admin: "/images/user/user-03.png",
  kasir: "/images/user/user-03.png",
};

export function UserInfo() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (stored) {
      try {
        setAuthUser(JSON.parse(stored) as AuthUser);
      } catch {}
    }
  }, []);

  const displayName = authUser?.name ?? "Pengguna";
  const displayRole = authUser?.role ?? "";
  const displayImg = authUser
    ? (ROLE_AVATARS[authUser.username] ?? "/images/user/user-03.png")
    : "/images/user/user-03.png";

  const handleLogout = async () => {
    setIsOpen(false);

    const confirmed = await Notify.confirm(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin mengakhiri sesi ini?",
      "Ya, Keluar"
    );

    if (!confirmed) return;

    Notify.loading("Sedang keluar...");
    
    // Beri jeda sedikit agar loading notify terlihat
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      await authService.logout();
      // Tutup loading sebelum pindah halaman
      Notify.close();
      router.push("/auth/sign-in");
    } catch (err) {
      Notify.close();
      router.push("/auth/sign-in");
    }
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={displayImg}
            className="size-12"
            alt={`Avatar of ${displayName}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{displayName}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={displayImg}
            className="size-12"
            alt={`Avatar for ${displayName}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {displayName}
            </div>

            <div className="text-gray-6 leading-none">{displayRole}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">Lihat Profil</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Pengaturan Akun
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-red hover:bg-red-light-6 dark:hover:bg-red-light-6"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Keluar (Logout)</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
