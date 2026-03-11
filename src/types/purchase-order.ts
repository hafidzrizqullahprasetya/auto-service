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
