# Rancangan Screenshot User Manual AutoService

Target manual final memakai 40 screenshot. Jumlah ini dipilih agar semua alur utama terlihat lengkap tanpa membuat manual terlalu berat dibaca.

## Standar Screenshot

- Viewport desktop: 1440 x 900.
- Folder output: `user-manual/images/autoservice/`.
- Sumber default: `http://localhost:3333`.
- Screenshot dipisah berdasarkan role agar hak akses terlihat jelas.
- Jika data kosong atau modal tertentu belum bisa dibuka, script tetap lanjut dan menandai screenshot sebagai `skipped` di laporan terminal.

## Akun Capture

Credential default dapat dioverride dari environment variable.

| Role | Username | Password |
| --- | --- | --- |
| Owner | `owner` | `owner123` |
| Admin | `admin` | `admin123` |
| Kasir | `kasir` | `kasir123` |
| Mekanik | `mekanik` | `mekanik123` |

## Daftar 40 Screenshot

| No | File | Role | Halaman/State | Tujuan Manual |
| --- | --- | --- | --- | --- |
| 01 | `01-login.png` | Publik | Login kosong | Membuka bab login. |
| 02 | `02-login-filled.png` | Publik | Login dengan contoh kredensial | Menunjukkan field username, password, dan ingat sesi. |
| 03 | `03-dashboard-overview.png` | Owner | Dashboard utama | Ringkasan KPI bengkel. |
| 04 | `04-dashboard-revenue.png` | Owner | Grafik pendapatan | Membaca performa pendapatan. |
| 05 | `05-dashboard-vehicle-ratio.png` | Owner | Rasio mobil vs motor | Membaca komposisi kendaraan. |
| 06 | `06-owner-sidebar-full.png` | Owner | Sidebar lengkap | Bukti akses penuh owner. |
| 07 | `07-antrean-summary.png` | Admin | Antrean dengan kartu status | Memahami ringkasan antrean. |
| 08 | `08-antrean-table.png` | Admin | Tabel antrean | Operasional antrean harian. |
| 09 | `09-antrean-kanban.png` | Admin | Kanban antrean | Monitoring status pengerjaan. |
| 10 | `10-work-order-create.png` | Admin | Form entry antrean baru | Membuat work order. |
| 11 | `11-work-order-edit.png` | Admin | Form ubah antrean | Mengubah data work order. |
| 12 | `12-spk-preview.png` | Admin | Preview/cetak SPK | Mencetak surat perintah kerja. |
| 13 | `13-inspection-header.png` | Admin | Header inspection checklist | Identitas kendaraan dan keluhan. |
| 14 | `14-inspection-engine.png` | Admin | Pengecekan area mesin | Checklist mesin sesuai formulir bengkel. |
| 15 | `15-inspection-cabin.png` | Admin | Pengecekan area dalam kabin | Checklist kabin dengan kolom baik/repair. |
| 16 | `16-inspection-exterior-notes.png` | Admin | Eksterior, understel, catatan | Area exterior, catatan perbaikan, pekerjaan. |
| 17 | `17-kasir-transaction-list.png` | Kasir | Daftar transaksi | Memantau transaksi dan status pembayaran. |
| 18 | `18-kasir-create-transaction.png` | Kasir | Form transaksi | Membuat transaksi servis/produk. |
| 19 | `19-kasir-from-work-order.png` | Kasir | Kasir dari work order | Melanjutkan antrean ke pembayaran. |
| 20 | `20-invoice-preview.png` | Kasir | Preview invoice | Bukti tagihan/cetak invoice. |
| 21 | `21-inventory-list.png` | Admin | Daftar sparepart | Melihat katalog stok. |
| 22 | `22-inventory-add-item.png` | Admin | Form sparepart | Menambah/mengubah sparepart. |
| 23 | `23-inventory-barcode.png` | Admin | Barcode sparepart | Cetak label barcode. |
| 24 | `24-inventory-category-unit.png` | Admin | Kategori dan satuan | Mengelola master kategori/satuan. |
| 25 | `25-inventory-category-form.png` | Admin | Form kategori | Menambah kategori baru. |
| 26 | `26-stock-movement-list.png` | Admin | Stok masuk/keluar | Riwayat mutasi stok. |
| 27 | `27-stock-movement-form.png` | Admin | Form stok masuk/keluar | Input mutasi stok. |
| 28 | `28-stock-opname-session.png` | Admin | Sesi stock opname | Membuat/memantau opname. |
| 29 | `29-stock-opname-items.png` | Admin | Item stock opname | Mengisi hasil opname. |
| 30 | `30-customer-list.png` | Admin | Daftar pelanggan | Mengelola pelanggan. |
| 31 | `31-customer-form.png` | Admin | Form pelanggan | Menambah/mengubah pelanggan. |
| 32 | `32-vehicle-list.png` | Admin | Daftar kendaraan | Mengelola kendaraan pelanggan. |
| 33 | `33-vehicle-form.png` | Admin | Form kendaraan | Menambah/mengubah kendaraan. |
| 34 | `34-service-catalog-list.png` | Admin | Katalog jasa dan paket | Mengelola jasa bengkel. |
| 35 | `35-service-catalog-form.png` | Admin | Form jasa/paket | Menambah jasa atau paket servis. |
| 36 | `36-reminder-list.png` | Admin | Reminder follow-up | Mengelola pengingat servis. |
| 37 | `37-report-tabs.png` | Owner | Laporan | Keuangan, analitik, dan stok. |
| 38 | `38-settings-profile.png` | Owner | Pengaturan profil bengkel | Mengubah data bengkel. |
| 39 | `39-settings-accounts-permissions.png` | Owner | Manajemen akun dan permission | Mengelola user dan hak akses. |
| 40 | `40-mechanic-queue-inspection.png` | Mekanik | Antrean mekanik dan checklist | Bukti mekanik hanya fokus pengerjaan/checklist. |

## Cara Menjalankan

Pastikan FE berjalan dan BE bisa diakses:

```bash
npm run dev
```

Lalu jalankan capture:

```bash
npm run manual:screenshots
```

Jika memakai URL production atau port lain:

```bash
MANUAL_BASE_URL=https://auto-service-jet.vercel.app npm run manual:screenshots
```

Jika credential berbeda:

```bash
MANUAL_OWNER_USER=owner MANUAL_OWNER_PASS=owner123 npm run manual:screenshots
```
