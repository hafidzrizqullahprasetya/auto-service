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

/** Alias for compatibility with newer service naming */
export type WorkOrder = Antrean;
