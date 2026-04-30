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
        url: "/antrean",
        items: [],
      },
      {
        title: "Kasir & Transaksi",
        icon: Icons.Kasir,
        url: "/kasir",
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
          { title: "Daftar Item", url: "/inventori", icon: Icons.Boxes },
          { title: "Kategori & Satuan", url: "/inventori/kategori", icon: Icons.Tag },
          { title: "Stok Masuk / Keluar", url: "/inventori/stok", icon: Icons.StockInOut },
          { title: "Stok Opname", url: "/inventori/opname", icon: Icons.StockOpname },
        ],
      },
      {
        title: "Katalog Jasa & Paket",
        icon: Icons.Repair,
        url: "/katalog-jasa",
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
        url: "/pelanggan",
        items: [],
      },
      {
        title: "Kendaraan",
        icon: Icons.KendaraanMobil,
        url: "/kendaraan",
        items: [],
      },
      {
        title: "Karyawan",
        icon: Icons.Karyawan,
        url: "/karyawan",
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
        url: "/laporan",
        items: [],
      },
      {
        title: "Reminder & Follow-up",
        icon: Icons.Notification,
        url: "/reminder",
        items: [],
      },
      {
        title: "Pengaturan",
        icon: Icons.Settings,
        url: "/pengaturan",
        items: [],
      },
    ],
  },
];
