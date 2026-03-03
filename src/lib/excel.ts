/**
 * excel.ts — Utility untuk export/import/template Excel
 * menggunakan library SheetJS (xlsx)
 *
 * Mendukung 5 modul: Inventori, Pelanggan, Kendaraan, Karyawan, Antrean
 */

import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExcelModuleKey =
  | "inventori"
  | "pelanggan"
  | "kendaraan"
  | "karyawan"
  | "antrean";

interface ColumnDef<T> {
  header: string;
  key: keyof T;
  /** Transform value saat export (opsional) */
  format?: (val: unknown) => string | number;
}

// ─── Schema per Modul ─────────────────────────────────────────────────────────

/** Tipe generik baris template */
export type TemplateRow = Record<string, string | number | undefined>;

interface ModuleSchema<T extends TemplateRow> {
  fileName: string;
  sheetName: string;
  columns: ColumnDef<T>[];
  sampleRows: T[];
}

// Inventori
export interface InventoriExcelRow {
  SKU: string;
  "Nama Item": string;
  Kategori: string;
  "Harga Modal (Rp)": number;
  "Harga Jual (Rp)": number;
  Stok: number;
  "Min. Stok": number;
  Satuan: string;
  "Tipe Kendaraan": string;
}

// Pelanggan
export interface PelangganExcelRow {
  Nama: string;
  Telepon: string;
  Email: string;
  Alamat: string;
}

// Kendaraan
export interface KendaraanExcelRow {
  "No. Polisi": string;
  Merk: string;
  Model: string;
  Tipe: string;
  Tahun: number;
  Warna: string;
  "ID Pemilik": string;
}

// Karyawan
export interface KaryawanExcelRow {
  Nama: string;
  Role: string;
  Status: string;
  Telepon: string;
  "Tanggal Bergabung": string;
  Rating: number;
}

// Antrean
export interface AntreanExcelRow {
  "No. Polisi": string;
  Kendaraan: string;
  Tipe: string;
  Pelanggan: string;
  Layanan: string;
  "WA Pelanggan": string;
  Mekanik: string;
  Keluhan: string;
  "Estimasi Biaya (Rp)": number;
}

// ─── Schema Definitions ───────────────────────────────────────────────────────

const SCHEMAS: Record<ExcelModuleKey, ModuleSchema<TemplateRow>> = {
  inventori: {
    fileName: "inventori_sparepart",
    sheetName: "Inventori",
    columns: [
      { header: "SKU", key: "SKU" },
      { header: "Nama Item", key: "Nama Item" },
      { header: "Kategori", key: "Kategori" },
      { header: "Harga Modal (Rp)", key: "Harga Modal (Rp)" },
      { header: "Harga Jual (Rp)", key: "Harga Jual (Rp)" },
      { header: "Stok", key: "Stok" },
      { header: "Min. Stok", key: "Min. Stok" },
      { header: "Satuan", key: "Satuan" },
      { header: "Tipe Kendaraan", key: "Tipe Kendaraan" },
    ],
    sampleRows: [
      {
        SKU: "OL-SMX-1L",
        "Nama Item": "Oli Shell Helix HX7 1L",
        Kategori: "Oil",
        "Harga Modal (Rp)": 72000,
        "Harga Jual (Rp)": 95000,
        Stok: 20,
        "Min. Stok": 10,
        Satuan: "liter",
        "Tipe Kendaraan": "Mobil",
      },
      {
        SKU: "FIL-AVZ-01",
        "Nama Item": "Filter Oli Avanza/Xenia",
        Kategori: "Part",
        "Harga Modal (Rp)": 22000,
        "Harga Jual (Rp)": 35000,
        Stok: 15,
        "Min. Stok": 5,
        Satuan: "pcs",
        "Tipe Kendaraan": "Mobil",
      },
    ],
  },

  pelanggan: {
    fileName: "pelanggan",
    sheetName: "Pelanggan",
    columns: [
      { header: "Nama", key: "Nama" },
      { header: "Telepon", key: "Telepon" },
      { header: "Email", key: "Email" },
      { header: "Alamat", key: "Alamat" },
    ],
    sampleRows: [
      {
        Nama: "Budi Santoso",
        Telepon: "081234567890",
        Email: "budi@email.com",
        Alamat: "Jl. Merdeka No. 10, Jakarta",
      },
      {
        Nama: "Ani Wijaya",
        Telepon: "085678901234",
        Email: "",
        Alamat: "Perum Indah Blok C/12, Bogor",
      },
    ],
  },

  kendaraan: {
    fileName: "kendaraan",
    sheetName: "Kendaraan",
    columns: [
      { header: "No. Polisi", key: "No. Polisi" },
      { header: "Merk", key: "Merk" },
      { header: "Model", key: "Model" },
      { header: "Tipe", key: "Tipe" },
      { header: "Tahun", key: "Tahun" },
      { header: "Warna", key: "Warna" },
      { header: "ID Pemilik", key: "ID Pemilik" },
    ],
    sampleRows: [
      {
        "No. Polisi": "B 1234 ABC",
        Merk: "Toyota",
        Model: "Avanza G AT",
        Tipe: "Mobil",
        Tahun: 2021,
        Warna: "Silver Metallic",
        "ID Pemilik": "c1",
      },
      {
        "No. Polisi": "D 9876 XY",
        Merk: "Honda",
        Model: "Beat Street",
        Tipe: "Motor",
        Tahun: 2022,
        Warna: "Hitam",
        "ID Pemilik": "c2",
      },
    ],
  },

  karyawan: {
    fileName: "karyawan",
    sheetName: "Karyawan",
    columns: [
      { header: "Nama", key: "Nama" },
      { header: "Role", key: "Role" },
      { header: "Status", key: "Status" },
      { header: "Telepon", key: "Telepon" },
      { header: "Tanggal Bergabung", key: "Tanggal Bergabung" },
      { header: "Rating", key: "Rating" },
    ],
    sampleRows: [
      {
        Nama: "Suryo Atmojo",
        Role: "Owner",
        Status: "Aktif",
        Telepon: "081234XXXXXX",
        "Tanggal Bergabung": "2023-01-10",
        Rating: 4.9,
      },
      {
        Nama: "Budi Setiadi",
        Role: "Kasir",
        Status: "Aktif",
        Telepon: "085678XXXXXX",
        "Tanggal Bergabung": "2023-06-15",
        Rating: 4.7,
      },
    ],
  },

  antrean: {
    fileName: "antrean",
    sheetName: "Antrean",
    columns: [
      { header: "No. Polisi", key: "No. Polisi" },
      { header: "Kendaraan", key: "Kendaraan" },
      { header: "Tipe", key: "Tipe" },
      { header: "Pelanggan", key: "Pelanggan" },
      { header: "Layanan", key: "Layanan" },
      { header: "WA Pelanggan", key: "WA Pelanggan" },
      { header: "Mekanik", key: "Mekanik" },
      { header: "Keluhan", key: "Keluhan" },
      { header: "Estimasi Biaya (Rp)", key: "Estimasi Biaya (Rp)" },
    ],
    sampleRows: [
      {
        "No. Polisi": "B 1234 ABC",
        Kendaraan: "Toyota Avanza",
        Tipe: "Mobil",
        Pelanggan: "Budi Santoso",
        Layanan: "Ganti Oli & Filter",
        "WA Pelanggan": "081234567890",
        Mekanik: "Suryo Atmojo",
        Keluhan: "Mesin sering ngelitik",
        "Estimasi Biaya (Rp)": 450000,
      },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function triggerDownload(wb: XLSX.WorkBook, fileName: string) {
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

function applyHeaderStyle(ws: XLSX.WorkSheet, colCount: number) {
  if (!ws["!cols"]) {
    ws["!cols"] = Array.from({ length: colCount }, () => ({ wch: 22 }));
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Download template kosong (+ 2 baris contoh) untuk modul tertentu
 */
export function downloadTemplate(moduleKey: ExcelModuleKey) {
  const schema = SCHEMAS[moduleKey];
  const headers = schema.columns.map((c) => c.header);

  const ws = XLSX.utils.aoa_to_sheet([
    headers,
    ...schema.sampleRows.map((row) =>
      schema.columns.map((c) => row[c.header as keyof typeof row] ?? ""),
    ),
  ]);

  applyHeaderStyle(ws, headers.length);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, schema.sheetName);
  triggerDownload(wb, `template_${schema.fileName}`);
}

/**
 * Export data array ke file Excel
 */
export function exportToExcel(
  moduleKey: ExcelModuleKey,
  rows: TemplateRow[],
  suffix?: string,
) {
  const schema = SCHEMAS[moduleKey];
  const headers = schema.columns.map((c) => c.header);

  const dataRows = rows.map((row) =>
    schema.columns.map((c) => {
      const val = row[c.header as keyof typeof row];
      return c.format ? c.format(val) : (val ?? "");
    }),
  );

  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
  applyHeaderStyle(ws, headers.length);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, schema.sheetName);

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const fileSuffix = suffix ? `_${suffix}` : "";
  triggerDownload(wb, `${schema.fileName}${fileSuffix}_${today}`);
}

/**
 * Parse file Excel (.xlsx/.xls) dari input <file> ke array of objects
 * Returns { data, headers, errors }
 */
export function parseExcelImport(file: File): Promise<{
  headers: string[];
  data: TemplateRow[];
  errors: string[];
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<TemplateRow>(ws, { defval: "" });
        const headers = raw.length > 0 ? Object.keys(raw[0]) : [];
        resolve({ headers, data: raw, errors: [] });
      } catch {
        resolve({
          headers: [],
          data: [],
          errors: ["File tidak valid atau format tidak didukung."],
        });
      }
    };
    reader.onerror = () =>
      resolve({ headers: [], data: [], errors: ["Gagal membaca file."] });
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Konversi data inventori ke format InventoriExcelRow[]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function inventoriToExcelRows(items: any[]): InventoriExcelRow[] {
  return items.map((item) => ({
    SKU: item.sku ?? "",
    "Nama Item": item.name ?? "",
    Kategori: item.category ?? "",
    "Harga Modal (Rp)": item.costPrice ?? 0,
    "Harga Jual (Rp)": item.price ?? 0,
    Stok: item.stock ?? 0,
    "Min. Stok": item.minimumStock ?? 0,
    Satuan: item.unit ?? "",
    "Tipe Kendaraan": item.type ?? "",
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pelangganToExcelRows(customers: any[]): PelangganExcelRow[] {
  return customers.map((c) => ({
    Nama: c.name ?? "",
    Telepon: c.phone ?? "",
    Email: c.email ?? "",
    Alamat: c.address ?? "",
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function kendaraanToExcelRows(vehicles: any[]): KendaraanExcelRow[] {
  return vehicles.map((v) => ({
    "No. Polisi": v.plateNumber ?? "",
    Merk: v.brand ?? "",
    Model: v.model ?? "",
    Tipe: v.type ?? "",
    Tahun: v.year ?? 0,
    Warna: v.color ?? "",
    "ID Pemilik": v.ownerId ?? "",
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function karyawanToExcelRows(employees: any[]): KaryawanExcelRow[] {
  return employees.map((e) => ({
    Nama: e.name ?? "",
    Role: e.role ?? "",
    Status: e.status ?? "",
    Telepon: e.phone ?? "",
    "Tanggal Bergabung": e.joinDate ?? "",
    Rating: e.rating ?? 0,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function antreanToExcelRows(queue: any[]): AntreanExcelRow[] {
  return queue.map((a) => ({
    "No. Polisi": a.noPolisi ?? "",
    Kendaraan: a.kendaraan ?? "",
    Tipe: a.tipe ?? "",
    Pelanggan: a.pelanggan ?? "",
    Layanan: a.layanan ?? "",
    "WA Pelanggan": a.waPelanggan ?? "",
    Mekanik: a.mekanik ?? "",
    Keluhan: a.keluhan ?? "",
    "Estimasi Biaya (Rp)": a.estimasiBiaya ?? 0,
  }));
}
