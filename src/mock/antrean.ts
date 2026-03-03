export interface Antrean {
  id: string;
  noPolisi: string;
  kendaraan: string;
  tipe: "Mobil" | "Motor";
  pelanggan: string;
  layanan: string;
  status: "Menunggu" | "Dikerjakan" | "Menunggu Sparepart" | "Selesai";
  waktuMasuk: string;
  mekanik?: string;
  estimasiSelesai?: string; // e.g. "2 jam"
  keluhan?: string;
  estimasiBiaya?: number;
  waPelanggan?: string;
  menginap?: boolean;
}

export const MOCK_ANTREAN: Antrean[] = [
  {
    id: "1",
    noPolisi: "B 1234 ABC",
    kendaraan: "Toyota Avanza",
    tipe: "Mobil",
    pelanggan: "Budi Santoso",
    layanan: "Ganti Oli & Filter",
    status: "Dikerjakan",
    waktuMasuk: "2024-05-24T08:30:00Z",
    mekanik: "Suryo Atmojo",
    estimasiSelesai: "1 jam",
    keluhan: "Tarikan berat, mesin sering ngelitik",
    waPelanggan: "081234567890",
    estimasiBiaya: 450000,
  },
  {
    id: "2",
    noPolisi: "F 5678 XY",
    kendaraan: "Honda Brio",
    tipe: "Mobil",
    pelanggan: "Ani Wijaya",
    layanan: "Service Rutin 10.000km",
    status: "Menunggu",
    waktuMasuk: "2024-05-24T09:15:00Z",
    estimasiSelesai: "3 jam",
    keluhan: "Rem berdecit, AC kurang dingin",
    waPelanggan: "085678123456",
    estimasiBiaya: 850000,
    menginap: true,
  },
  {
    id: "3",
    noPolisi: "B 9999 BOS",
    kendaraan: "Mitsubishi Pajero",
    tipe: "Mobil",
    pelanggan: "H. Slamet",
    layanan: "Cek Rem & Kaki-kaki",
    status: "Selesai",
    waktuMasuk: "2024-05-24T07:45:00Z",
    mekanik: "Budi Setiadi",
    keluhan: "Setir getar saat kecepatan tinggi",
    waPelanggan: "089988776655",
    estimasiBiaya: 1250000,
  },
  {
    id: "4",
    noPolisi: "D 4321 DEF",
    kendaraan: "Suzuki Ertiga",
    tipe: "Mobil",
    pelanggan: "Riko Pambudi",
    layanan: "Ganti Aki",
    status: "Menunggu",
    waktuMasuk: "2024-05-24T10:00:00Z",
    keluhan: "Starter mati, lampu redup",
    waPelanggan: "082123456789",
    estimasiBiaya: 750000,
  },
  {
    id: "5",
    noPolisi: "B 777 VIX",
    kendaraan: "Yamaha Vixion",
    tipe: "Motor",
    pelanggan: "Agus Salim",
    layanan: "Servis Injeksi",
    status: "Menunggu Sparepart",
    waktuMasuk: "2024-05-24T10:30:00Z",
    mekanik: "Agus Prasetyo",
    keluhan: "Gas nyendat-nyendat",
    waPelanggan: "081122334455",
    estimasiBiaya: 250000,
  },
];
