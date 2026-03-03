"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { UserInfo } from "./user-info";

const getPageTitle = (pathname: string) => {
  const paths: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "Dashboard", subtitle: "Ringkasan aktivitas bengkel hari ini" },
    "/bengkel/antrean": { title: "Antrean", subtitle: "Manajemen antrean & status servis" },
    "/bengkel/inventori": { title: "Inventori", subtitle: "Manajemen stok sparepart" },
    "/bengkel/karyawan": { title: "Karyawan", subtitle: "Data mekanik & staff bengkel" },
    "/bengkel/kasir": { title: "Kasir", subtitle: "Point of sale & pembayaran" },
    "/bengkel/kendaraan": { title: "Kendaraan", subtitle: "Data kendaraan pelanggan" },
    "/bengkel/laporan": { title: "Laporan", subtitle: "Analitik & ringkasan bisnis" },
    "/bengkel/pelanggan": { title: "Pelanggan", subtitle: "Database pelanggan setia" },
    "/bengkel/pengaturan": { title: "Pengaturan", subtitle: "Konfigurasi sistem & profil bengkel" },
    "/bengkel/purchase-order": { title: "Purchase Order", subtitle: "Pemesanan & pembelian stok" },
    "/bengkel/reminder": { title: "Reminder", subtitle: "Pengingat jadwal servis pelanggan" },
  };

  const path = pathname.split("/").slice(0, 4).join("/");
  return paths[path] || { title: "Dashboard", subtitle: "Auto Service" };
};

export function Header() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebarContext();
  const { title, subtitle } = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-4 shadow-1 md:px-5 2xl:px-10">
      {/* Kiri: hamburger (mobile) + judul halaman */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="grid size-10 place-items-center rounded-lg border border-stroke text-dark transition-colors hover:bg-gray-2"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
        )}

        {isMobile && (
          <Link href={"/"} className="max-[430px]:hidden">
            <Image
              src={"/images/logo/logo-icon.svg"}
              width={28}
              height={28}
              alt=""
              role="presentation"
            />
          </Link>
        )}

        <div className="max-xl:hidden">
          <h1 className="mb-0.5 text-heading-5 font-bold text-dark">{title}</h1>
          <p className="text-sm font-medium text-dark-5">{subtitle}</p>
        </div>
      </div>

      {/* Kanan: Notifikasi + User */}
      <div className="flex items-center gap-3">
        <Notification />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
