export interface AntreanChecklist {
  id: number;
  work_order_id: number;
  task_name: string;
  is_done: boolean;
  updated_at: string;
}

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
  noRangka?: string;
  complaintLog?: string | null;
  estimasiBiaya?: number;
  waPelanggan?: string;
  menginap?: boolean;
  customer_id?: number;
  vehicle_id?: number;
  payment_status?: "Lunas" | "DP" | "Piutang" | "Belum Bayar";
  service_bundle_id?: number | null;
  checklists?: AntreanChecklist[];
}
export type WorkOrder = Antrean;
