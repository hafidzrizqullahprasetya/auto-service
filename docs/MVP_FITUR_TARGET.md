# MVP Feature Target List — AutoService Inventory Web Panel

> **Dokumen ini** adalah referensi utama tim untuk menentukan scope MVP. Fitur yang tidak ada di sini → masuk backlog post-MVP.
> **Last Updated:** 2026-03-02 | **Owner:** PM + Team

---

## Definisi MVP

MVP (Minimum Viable Product) adalah versi paling sederhana dari sistem yang **sudah bisa dipakai secara nyata oleh owner bengkel** untuk menggantikan proses manual mereka. Kriteria "Done" untuk MVP:

- [x] Owner bisa lihat stok sparepart real-time
- [x] Owner bisa terima notifikasi WA saat stok hampir habis (UI + config — integrasi BE menyusul)
- [x] Staff bisa catat transaksi (nota servis) dan stok keluar dicatat
- [x] Owner bisa rekap omset bulanan tanpa hitung manual
- [x] Sistem bisa generate & cetak barcode untuk setiap item

---

## Daftar Fitur MVP (Prioritized Backlog)

### 🔴 Priority 1 — Must Have (Wajib di MVP)

| ID | Fitur | Modul | PIC | FE Status | BE Status |
|----|-------|-------|-----|-----------|-----------|
| F-01 | Login & autentikasi user (JWT/session) | Auth | BE + FE | `Done` | `Backlog` |
| F-02 | Manajemen role: Admin, Kasir, Mekanik | Auth | BE + FE | `Done` | `Backlog` |
| F-03 | Dashboard — ringkasan stok, omset, aktivitas | Dashboard | FE | `Done` | `Done` |
| F-04 | CRUD Katalog Sparepart (nama, SKU, harga, stok, min-stok) | Inventory | BE + FE | `Done` | `Backlog` |
| F-05 | Generate Barcode per item (format Code-128 / QR) | Inventory | FE | `Done` | `Done` |
| F-06 | Cetak Barcode (PDF / thermal layout) | Inventory | FE | `Done` | `Done` |
| F-07 | Catat Stok Masuk (restock dari supplier) | Inventory | BE + FE | `Done` | `Backlog` |
| F-08 | Catat Stok Keluar manual | Inventory | BE + FE | `Done` | `Backlog` |
| F-09 | Stok Opname — input fisik vs sistem, hitung selisih | Inventory | BE + FE | `Done` | `Backlog` |
| F-10 | Notifikasi WA otomatis saat stok < minimum | Notifikasi | BE | `Done (UI)` | `Backlog` |
| F-11 | Konfigurasi threshold stok minimum per item | Inventory | BE + FE | `Done` | `Backlog` |
| F-12 | CRUD Data Customer (nama, telp, kendaraan) | Customer | BE + FE | `Done` | `Backlog` |
| F-13 | Riwayat Servis per Customer | Customer | BE + FE | `Done` | `Backlog` |
| F-14 | Buat Nota Transaksi / Invoice Servis | Transaksi | BE + FE | `Done` | `Backlog` |
| F-15 | Stok otomatis berkurang saat item dipakai di transaksi | Transaksi | BE | `Done (UI)` | `Backlog` |
| F-16 | Status Pembayaran (Lunas / DP / Belum Bayar) | Transaksi | BE + FE | `Done` | `Backlog` |
| F-17 | Cetak Nota (PDF A4) | Transaksi | FE | `Done` | `Done` |
| F-18 | Laporan Omset Harian & Bulanan | Laporan | BE + FE | `Done` | `Backlog` |
| F-19 | Laporan Sparepart Terlaris (Top 10) | Laporan | BE + FE | `Done` | `Backlog` |
| F-20 | Pengaturan profil bengkel & konfigurasi WA Gateway | Settings | BE + FE | `Done` | `Backlog` |

### 🟡 Priority 2 — Should Have

| ID | Fitur | Modul | PIC | FE Status | BE Status |
|----|-------|-------|-----|-----------|-----------|
| F-21 | Filter & search katalog sparepart (tipe, kategori) | Inventory | FE | `Done` | `Done` |
| F-22 | Histori log perubahan stok (audit trail) | Inventory | BE + FE | `Done` | `Backlog` |
| F-23 | Laporan Stok Opname (rekap selisih) | Laporan | BE + FE | `Done` | `Backlog` |
| F-24 | Export laporan ke CSV/PDF | Laporan | FE | `In Progress` | — |
| F-25 | Scan barcode di form transaksi | Transaksi | FE | `Backlog` | — |

### 🟢 Priority 3 — Nice to Have (Post-MVP)

| ID | Fitur | Modul | Status |
|----|-------|--------|--------|
| F-26 | Manajemen Supplier | Inventory | `Post-MVP` |
| F-27 | Purchase Order ke Supplier | Inventory | `Post-MVP` |
| F-28 | Manajemen Karyawan / Mekanik & log kinerja | Staff | `Post-MVP` |
| F-29 | Multi-cabang | Inventory | `Post-MVP` |
| F-30 | Integrasi E-Wallet / Payment Gateway | Transaksi | `Post-MVP` |
| F-31 | Aplikasi Mobile (PWA/Native) | - | `Post-MVP` |
| F-32 | Notifikasi Email | Notifikasi | `Post-MVP` |

---

## Ringkasan Beban Kerja per Role (Tim 4 Orang)

| Role | Anggota | Tanggung Jawab Utama |
|------|---------|---------------------|
| **FE Dev** | 1 orang | Semua halaman UI, komponen, mock data, integrasi API dari BE |
| **BE Dev** | 1 orang | REST API, database schema, WA notif service, auth/JWT |
| **PM** | 1 orang | Sprint planning, backlog grooming, laporan ke asdos, ERD final |
| **UI/UX** | 1 orang | Wireframe & high-fi design (Figma), design system, UX review |

---

## Progress Summary (per 2 Maret 2026)

| Kategori | Jumlah | Status |
|----------|--------|--------|
| Must Have (P1) | 20 fitur | **FE: 20/20 Done** · BE: 0/20 (belum mulai) |
| Should Have (P2) | 5 fitur | **FE: 4/5 Done** · 1 In Progress |
| Nice to Have (P3) | 7 fitur | Post-MVP |

> ⚠️ **Disclaimer Internal:** FE sudah selesai 100% dengan mock data. Saat BE sudah siap, tinggal ganti fetching dari mock → API call sesuai `API_SPEC.md`.

---

## Status Legend

| Status | Arti |
|--------|------|
| `Done` | Selesai & terverifikasi |
| `In Progress` | Sedang dikerjakan |
| `In Review` | PR dibuat, menunggu review |
| `Backlog` | Belum dikerjakan |
| `Blocked` | Ada hambatan, perlu diskusi |
