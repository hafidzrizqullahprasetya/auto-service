import { Icons } from "@/components/Icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.Dashboard,
        url: "/",
        items: [],
      },
      {
        title: "Antrean Masuk",
        icon: Icons.Antrean,
        url: "/bengkel/antrean",
        items: [],
      },
      {
        title: "Kasir & POS",
        icon: Icons.Kasir,
        url: "/bengkel/kasir",
        items: [],
      },
    ],
  },
  {
    label: "DATA MASTER",
    items: [
      {
        title: "Pelanggan",
        icon: Icons.Pelanggan,
        url: "/bengkel/pelanggan",
        items: [],
      },
      {
        title: "Kendaraan",
        icon: Icons.KendaraanMobil,
        url: "/bengkel/kendaraan",
        items: [],
      },
      {
        title: "Inventori & Stok",
        icon: Icons.Inventory,
        url: "/bengkel/inventori",
        items: [],
      },
      {
        title: "Purchase Order",
        icon: Icons.Database,
        url: "/bengkel/purchase-order",
        items: [],
      },
      {
        title: "Karyawan",
        icon: Icons.Karyawan,
        url: "/bengkel/karyawan",
        items: [],
      },
    ],
  },
  {
    label: "REPORT & SETTINGS",
    items: [
      {
        title: "Laporan Keuangan",
        icon: Icons.Laporan,
        url: "/bengkel/laporan",
        items: [],
      },
      {
        title: "Reminder & Follow-up",
        icon: Icons.Notification,
        url: "/bengkel/reminder",
        items: [],
      },
      {
        title: "Pengaturan",
        icon: Icons.Settings,
        url: "/bengkel/pengaturan",
        items: [],
      },
    ],
  },
];
