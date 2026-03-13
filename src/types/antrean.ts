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
  estimasiSelesai?: string; 
  keluhan?: string;
  estimasiBiaya?: number;
  waPelanggan?: string;
  menginap?: boolean;
  customer_id?: number;
  vehicle_id?: number;
  payment_status?: "Lunas" | "DP" | "Piutang" | "Belum Bayar";
}
export type WorkOrder = Antrean;
