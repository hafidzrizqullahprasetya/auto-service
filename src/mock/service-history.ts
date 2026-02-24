export interface ServiceRecord {
  id: string;
  noPolisi: string;
  tanggal: string;
  odometer: number;
  layanan: string;
  teknisi: string;
  items: { nama: string; qty: number; harga: number }[];
  totalBiaya: number;
  catatan?: string;
  garansiHingga?: string; // ISO date
  status: "Selesai" | "Garansi Klaim";
}

export const MOCK_SERVICE_HISTORY: ServiceRecord[] = [
  {
    id: "srv-001",
    noPolisi: "B 1234 ABC",
    tanggal: "2024-05-24",
    odometer: 85000,
    layanan: "Ganti Oli & Filter",
    teknisi: "Rizky",
    items: [
      { nama: "Oli Shell Helix HX7 1L", qty: 4, harga: 95000 },
      { nama: "Filter Oli Avanza", qty: 1, harga: 35000 },
      { nama: "Jasa Ganti Oli", qty: 1, harga: 50000 },
    ],
    totalBiaya: 465000,
    garansiHingga: "2024-08-24",
    catatan: "Oli berikutnya di 90.000 km atau 3 bulan lagi.",
    status: "Selesai",
  },
  {
    id: "srv-002",
    noPolisi: "B 1234 ABC",
    tanggal: "2024-02-10",
    odometer: 80000,
    layanan: "Cek Rem & Kaki-kaki",
    teknisi: "Dani",
    items: [
      { nama: "Kampas Rem Depan", qty: 1, harga: 250000 },
      { nama: "Jasa Pemasangan", qty: 1, harga: 75000 },
    ],
    totalBiaya: 325000,
    garansiHingga: "2024-05-10",
    catatan: "Kampas rem belakang masih 60%, cek lagi di servis berikutnya.",
    status: "Selesai",
  },
  {
    id: "srv-003",
    noPolisi: "B 9999 XYZ",
    tanggal: "2024-04-15",
    odometer: 120000,
    layanan: "Tune Up Mesin",
    teknisi: "Rizky",
    items: [
      { nama: "Busi NGK (4 pcs)", qty: 4, harga: 35000 },
      { nama: "Filter Udara", qty: 1, harga: 85000 },
      { nama: "Jasa Tune Up", qty: 1, harga: 150000 },
    ],
    totalBiaya: 375000,
    catatan: "Mesin sudah normal, AC perlu dicek bulan depan.",
    status: "Selesai",
  },
  {
    id: "srv-004",
    noPolisi: "F 5678 XY",
    tanggal: "2024-05-20",
    odometer: 45000,
    layanan: "Service Rutin 10.000km",
    teknisi: "Dani",
    items: [
      { nama: "Oli Shell Helix HX7 1L", qty: 3, harga: 95000 },
      { nama: "Filter Oli", qty: 1, harga: 35000 },
      { nama: "Filter AC", qty: 1, harga: 120000 },
      { nama: "Jasa Service Rutin", qty: 1, harga: 100000 },
    ],
    totalBiaya: 540000,
    garansiHingga: "2024-08-20",
    catatan: "Service rutin selesai. Jadwal berikutnya di 55.000 km.",
    status: "Selesai",
  },
  {
    id: "srv-005",
    noPolisi: "B 777 VIX",
    tanggal: "2024-05-24",
    odometer: 32000,
    layanan: "Servis Injeksi",
    teknisi: "Rizky",
    items: [
      { nama: "Busi Iridium", qty: 1, harga: 85000 },
      { nama: "Jasa Servis Injeksi", qty: 1, harga: 75000 },
    ],
    totalBiaya: 160000,
    garansiHingga: "2024-08-24",
    status: "Selesai",
  },
];

export interface ServiceReminder {
  id: string;
  customerId: string;
  noPolisi: string;
  kendaraan: string;
  pelanggan: string;
  phone: string;
  jenisReminder: "Ganti Oli" | "Service Rutin" | "Cek Rem" | "Tune Up" | "Perpanjang STNK";
  jadwalTanggal: string;
  odometerTarget?: number;
  odometerSaat: number;
  status: "Aktif" | "Terkirim" | "Lewat Jatuh Tempo";
  catatan?: string;
}

export const MOCK_REMINDERS: ServiceReminder[] = [
  {
    id: "rem-001",
    customerId: "c1",
    noPolisi: "B 1234 ABC",
    kendaraan: "Toyota Avanza",
    pelanggan: "Budi Santoso",
    phone: "0812-3456-7890",
    jenisReminder: "Ganti Oli",
    jadwalTanggal: "2024-08-24",
    odometerTarget: 90000,
    odometerSaat: 85000,
    status: "Aktif",
    catatan: "Otomatis dari servis 24 Mei 2024",
  },
  {
    id: "rem-002",
    customerId: "c2",
    noPolisi: "F 5678 XY",
    kendaraan: "Honda Brio",
    pelanggan: "Ani Wijaya",
    phone: "0856-7890-1234",
    jenisReminder: "Service Rutin",
    jadwalTanggal: "2024-08-20",
    odometerTarget: 55000,
    odometerSaat: 45000,
    status: "Aktif",
    catatan: "Service 10.000 km berikutnya",
  },
  {
    id: "rem-003",
    customerId: "c3",
    noPolisi: "B 777 VIX",
    kendaraan: "Yamaha Vixion",
    pelanggan: "Agus Salim",
    phone: "0813-1122-3344",
    jenisReminder: "Ganti Oli",
    jadwalTanggal: "2024-05-15",
    odometerTarget: 34000,
    odometerSaat: 32000,
    status: "Lewat Jatuh Tempo",
    catatan: "Harap segera servis!",
  },
  {
    id: "rem-004",
    customerId: "c1",
    noPolisi: "B 9999 XYZ",
    kendaraan: "Toyota Kijang Innova",
    pelanggan: "Budi Santoso",
    phone: "0812-3456-7890",
    jenisReminder: "Perpanjang STNK",
    jadwalTanggal: "2024-07-01",
    odometerSaat: 120000,
    status: "Aktif",
    catatan: "STNK habis bulan Juli",
  },
  {
    id: "rem-005",
    customerId: "c4",
    noPolisi: "B 2024 SP",
    kendaraan: "Honda Jazz",
    pelanggan: "Siska Putri",
    phone: "0819-0011-2233",
    jenisReminder: "Tune Up",
    jadwalTanggal: "2024-06-15",
    odometerSaat: 22000,
    status: "Terkirim",
  },
];

export interface PurchaseOrder {
  id: string;
  noPO: string;
  tanggal: string;
  supplier: string;
  status: "Draft" | "Dikirim" | "Diterima" | "Dibatalkan";
  items: { sku: string; nama: string; qty: number; hargaSatuan: number }[];
  totalNilai: number;
  catatan?: string;
  estimasiTiba?: string;
}

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-001",
    noPO: "PO/20240524/001",
    tanggal: "2024-05-24",
    supplier: "PT. Autoparts Nusantara",
    status: "Dikirim",
    items: [
      { sku: "OL-SMX-1L", nama: "Oli Shell Helix HX7 1L", qty: 50, hargaSatuan: 70000 },
      { sku: "FIL-AVZ-01", nama: "Filter Oli Avanza/Xenia", qty: 20, hargaSatuan: 25000 },
    ],
    totalNilai: 4000000,
    catatan: "Pesanan bulanan rutin",
    estimasiTiba: "2024-05-28",
  },
  {
    id: "po-002",
    noPO: "PO/20240520/002",
    tanggal: "2024-05-20",
    supplier: "CV. Sparepart Jaya",
    status: "Diterima",
    items: [
      { sku: "BRK-HD-01", nama: "Kampas Rem Depan Brio", qty: 10, hargaSatuan: 180000 },
    ],
    totalNilai: 1800000,
    estimasiTiba: "2024-05-23",
  },
  {
    id: "po-003",
    noPO: "PO/20240515/003",
    tanggal: "2024-05-15",
    supplier: "PT. Autoparts Nusantara",
    status: "Dibatalkan",
    items: [
      { sku: "OL-MPX-MTR", nama: "Oli MPX2 0.8L", qty: 30, hargaSatuan: 40000 },
    ],
    totalNilai: 1200000,
    catatan: "Dibatalkan karena stok masih cukup",
  },
  {
    id: "po-004",
    noPO: "PO/20240524/004",
    tanggal: "2024-05-24",
    supplier: "Toko Budi Motor",
    status: "Draft",
    items: [
      { sku: "BRK-HD-01", nama: "Kampas Rem Depan Brio", qty: 5, hargaSatuan: 180000 },
      { sku: "FIL-AVZ-01", nama: "Filter Oli Avanza/Xenia", qty: 10, hargaSatuan: 25000 },
    ],
    totalNilai: 1150000,
    catatan: "Stok menipis, perlu segera dipesan",
    estimasiTiba: "2024-05-30",
  },
];
