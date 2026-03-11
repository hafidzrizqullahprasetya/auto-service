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
