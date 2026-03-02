# Deskripsi Web Panel — Inventory Stok Opname Bengkel AutoService

> **Konteks Proyek:** Proyek tim 4 orang (1 PM, 1 FE Dev, 1 BE Dev, 1 UI/UX). Dikerjakan dengan metode Scrum selama 10 minggu.

Web Panel ini mendigitalisasi operasional **Bengkel AutoService (Mobil & Motor)** yang saat ini masih berjalan **full manual** — mulai dari pencatatan nota, pendataan stok sparepart, hingga laporan omset bulanan. Fokus utama sistem ini adalah **Manajemen Inventori & Stok Opname**, dilengkapi notifikasi WA stok menipis, generate barcode mandiri, dan riwayat customer.

Desain panel menggunakan pendekatan **"Minimalist Monochrome"** — putih sebagai primary, hitam sebagai secondary, tanpa shadow/animasi berlebih. Fokus pada kejelasan data dan kecepatan workflow.

---

## Scope Utama Sistem (Core Domain)

**Inventory Stok Opname** adalah inti dari sistem ini. Fitur lainnya bersifat pendukung operasional bengkel tersebut.

---

## Modul-Modul Sistem

### 1. Dashboard
Snapshot aktivitas dan kondisi terkini bengkel secara real-time.
- **Ringkasan Stok**: Total item, barang hampir habis, barang out-of-stock
- **Statistik Transaksi**: Omset hari ini, bulan ini (pengganti catatan manual di komputer)
- **Top 5 Barang Terlaris**: Rekomendasi otomatis berdasarkan data penjualan
- **Alert Panel**: Notifikasi barang stok menipis (threshold kustom per item)

### 2. Manajemen Inventori & Stok (Core Feature)
Pengelolaan katalog dan stok sparepart — **fitur utama aplikasi**.
- **Katalog Sparepart**: Daftar item (nama, SKU, kategori mobil/motor/umum, harga modal, harga jual, stok saat ini, stok minimum)
- **Generate Barcode**: Sistem men-generate kode SKU/Barcode unik per item. Bisa dicetak (PDF/thermal) dan ditempel manual ke fisik barang/rak
- **Stok Masuk (Restock)**: Pencatatan barang masuk dari supplier
- **Stok Keluar**: Pencatatan pemakaian sparepart (dari servis atau jual ecer)
- **Stok Opname**: Fitur rekonsiliasi stok fisik vs sistem — input jumlah fisik aktual, sistem otomatis hitung selisih

### 3. Notifikasi Stok (WhatsApp Alert)
Sistem notifikasi otomatis saat stok mendekati batas minimum.
- **Threshold per Item**: Setiap sparepart punya nilai minimum stok yang dapat dikonfigurasi
- **Kirim via WA**: Notifikasi dikirim ke nomor WA owner/admin menggunakan WA API/Gateway
- **Riwayat Notif**: Log notifikasi yang sudah terkirim

### 4. Manajemen Pelanggan & Riwayat Servis
- **Data Customer**: Nama, telepon, kendaraan yang dimiliki
- **Riwayat Kunjungan**: Histori servis tiap customer (tanggal, keluhan, sparepart yang dipakai, total bayar)
- **Lookup Cepat**: Cari customer berdasarkan nama/nomor telp/plat kendaraan

### 5. Transaksi & Invoice Sederhana
Pencatatan transaksi sebagai pengganati nota manual, bukan full POS.
- **Buat Nota Servis**: Catat item jasa + sparepart yang dipakai (scan/input barcode)
- **Total Tagihan**: Kalkulasi otomatis
- **Status Bayar**: Lunas / Belum Lunas / DP
- **Cetak Nota**: Export PDF A4 atau layout thermal

### 6. Laporan & Analitik
Menggantikan pencatatan omset manual di komputer.
- **Laporan Omset Harian/Bulanan**: Total pemasukan, margin kotor
- **Laporan Penjualan Sparepart**: Barang terlaris, barang slow-moving
- **Laporan Stok Opname**: Rekap selisih stok dari sesi opname
- **Export**: CSV / PDF

### 7. Pengaturan (Settings)
- **Profil Bengkel**: Nama, alamat, logo, kontak WA
- **Manajemen User & Role**: Admin, Kasir, Mekanik (hak akses berbeda)
- **Konfigurasi WA Gateway**: Setup nomor & token API gateway

---

## Aturan Pengembangan (Development Rules)

🚨 **WAJIB DIPATUHI**:

1. **Gunakan Komponen Bawaan**: Seluruh UI **WAJIB** menggunakan komponen yang sudah ada di `src/components/` (template NextAdmin). Jangan bangun dari awal jika sudah tersedia.
2. **Styling Monokrom**: Komponen baru wajib ikut tema hitam-putih dari `tailwind.config.ts`. Dilarang tambahkan `shadow-*`, `animate-*`, atau warna custom di luar primary/secondary.
3. **Pisahkan Dummy Data**: Semua mock/dummy data di file/folder tersendiri (misal `src/mocks/`). Saat BE siap, cukup ganti data source tanpa ubah struktur UI.
4. **Komponen Harus Stateless dari API**: Gunakan props + custom hook sebagai lapisan data. UI tidak boleh fetch langsung di dalam JSX/TSX komponen.
5. **Scope MVP Ketat**: Jangan kembangkan fitur di luar daftar MVP. Fitur "nice to have" masuk backlog post-MVP.
