import { Icons } from "@/components/icons";

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
        title: "Kasir & Transaksi",
        icon: Icons.Kasir,
        url: "/bengkel/kasir",
        items: [],
      },
    ],
  },
  {
    label: "INVENTORI & STOK",
    items: [
      {
        title: "Katalog Sparepart",
        icon: Icons.Inventory,
        items: [
          { title: "Daftar Item", url: "/bengkel/inventori", icon: Icons.Boxes },
          { title: "Stok Masuk / Keluar", url: "/bengkel/inventori/stok", icon: Icons.StockInOut },
          { title: "Stok Opname", url: "/bengkel/inventori/opname", icon: Icons.StockOpname },
        ],
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
        title: "Laporan",
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
