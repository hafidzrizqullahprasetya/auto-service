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
