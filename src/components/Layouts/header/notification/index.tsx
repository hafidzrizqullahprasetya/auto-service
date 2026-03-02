"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { BellIcon } from "./icons";
import { Icons } from "@/components/Icons";

// ─── Data notifikasi bengkel ────────────────────────────────────────────────
type NotifType = "stock" | "service" | "payment" | "reminder";

const NOTIF_ICON: Record<NotifType, React.ElementType> = {
  stock: Icons.Inventory,
  service: Icons.Repair,
  payment: Icons.Cash,
  reminder: Icons.Notification,
};

const NOTIF_COLOR: Record<NotifType, string> = {
  stock: "bg-red-50 text-red-500",
  service: "bg-gray-100 text-dark",
  payment: "bg-gray-100 text-dark",
  reminder: "bg-gray-100 text-dark",
};

interface Notif {
  id: number;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFS: Notif[] = [
  {
    id: 1,
    type: "stock",
    title: "Stok Menipis!",
    desc: "Oli Mesin SAE 10W-40 tersisa 3 botol (min. 5)",
    time: "5 menit lalu",
    isRead: false,
  },
  {
    id: 2,
    type: "stock",
    title: "Stok Menipis!",
    desc: "Filter Udara Honda tersisa 2 pcs (min. 10)",
    time: "12 menit lalu",
    isRead: false,
  },
  {
    id: 3,
    type: "service",
    title: "Servis Selesai",
    desc: "B 1234 XYZ – Honda Jazz milik Budi Santoso",
    time: "30 menit lalu",
    isRead: false,
  },
  {
    id: 4,
    type: "payment",
    title: "Pembayaran Diterima",
    desc: "Invoice #INV-2025-042 – Rp 450.000 (Transfer)",
    time: "1 jam lalu",
    isRead: false,
  },
  {
    id: 5,
    type: "reminder",
    title: "Reminder Servis",
    desc: "Siti Rahayu – Toyota Avanza jatuh tempo hari ini",
    time: "2 jam lalu",
    isRead: true,
  },
];

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(MOCK_NOTIFS);
  const isMobile = useIsMobile();

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger
        className="relative grid size-10 place-items-center rounded-lg bg-gray-1 text-dark-5 outline-none transition-all duration-200 hover:bg-dark hover:text-white dark:bg-dark-2 dark:text-dark-4 dark:hover:bg-white dark:hover:text-dark"
        aria-label="Lihat Notifikasi"
      >
        <Icons.Notification size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-md border-2 border-white bg-dark px-1 text-[10px] font-black leading-none text-white dark:border-dark dark:bg-white dark:text-dark">
            {unreadCount}
          </span>
        )}
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "end"}
        className="border border-stroke bg-white shadow-lg min-[350px]:min-w-[22rem]"
      >
        {/* Header dropdown */}
        <div className="flex items-center justify-between border-b border-stroke px-4 py-3">
          <div>
            <span className="text-base font-bold text-dark">Notifikasi</span>
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-dark px-2 py-0.5 text-[10px] font-bold text-white">
                {unreadCount} baru
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-dark-5 underline hover:text-dark transition-colors"
            >
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* List notif */}
        <ul className="max-h-[20rem] divide-y divide-stroke overflow-y-auto">
          {notifs.map((notif) => {
            const Icon = NOTIF_ICON[notif.type];
            return (
              <li key={notif.id}>
                <button
                  onClick={() => {
                    setNotifs((prev) =>
                      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
                    );
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-1",
                    !notif.isRead && "bg-gray-50"
                  )}
                >
                  {/* Icon tipe */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      NOTIF_COLOR[notif.type]
                    )}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Konten */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-dark leading-snug">{notif.title}</p>
                    <p className="mt-0.5 truncate text-xs text-dark-5">{notif.desc}</p>
                    <p className="mt-1 text-[10px] text-dark-5">{notif.time}</p>
                  </div>

                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-dark" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="border-t border-stroke p-2">
          <Link
            href="/bengkel/reminder"
            onClick={() => setIsOpen(false)}
            className="block w-full rounded-lg py-2 text-center text-sm font-medium text-dark transition-colors hover:bg-gray-1"
          >
            Lihat semua notifikasi →
          </Link>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
