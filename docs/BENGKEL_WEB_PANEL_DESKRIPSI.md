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

### 3. Notifikasi WhatsApp (Stok & Progress Servis)

Sistem notifikasi otomatis via **WhatsApp Web.js** (whatsapp-web.js) — terhubung langsung ke akun WhatsApp tanpa gateway pihak ketiga. **Dijalankan hanya di lokal** (`npm run dev`), tidak perlu server eksternal.

- **Koneksi via QR Code**: Scan QR dari panel untuk menghubungkan akun WhatsApp
- **Session Persistent**: Sesi disimpan ke disk (`/.wwebjs_auth`) — tidak perlu scan ulang tiap restart
- **Alert Stok**: Notifikasi dikirim ke nomor WA owner/admin saat stok mendekati batas minimum
- **Progress Servis Pelanggan**: Notifikasi otomatis ke nomor HP pelanggan saat status Work Order berubah ke `dikerjakan` atau `selesai`
- **Riwayat Notif**: Log notifikasi yang sudah terkirim (stok dan pelanggan) — beserta status `sent/failed/pending` dan tombol retry
- **Nomor Target Owner**: Dikonfigurasi di Settings (`wa_target_number`) — untuk notif stok menipis

### 4. Manajemen Pelanggan, Kendaraan & Work Order (Penerimaan)

Modul untuk mendata pelanggan dan membuat dokumen penerimaan sebelum diservis.

- **Data Customer**: Nama, nomor WA, dan daftar kendaraan yang dimiliki.
- **Penerimaan / Work Order**: Pencatatan awal saat mobil datang. Berisi keluhan pelanggan, catatan mekanik, dan penentuan apakah kendaraan **Menginap** atau tidak.
- **Estimasi Biaya (Quotation)**: Perkiraan awal biaya jasa dan sparepart yang disampaikan ke pelanggan sebelum pengerjaan.
- **Riwayat Kunjungan**: Histori servis tiap customer (tanggal, keluhan, sparepart, total bayar).

### 5. Transaksi & Invoice Sederhana

Pencatatan transaksi sebagai pengganti nota manual, terintegrasi dengan data Work Order.

- **Buat Nota Servis**: Konversi dari Work Order / Estimasi menjadi nota aktual (scan/input barcode jika ada tambahan).
- **Total Tagihan**: Kalkulasi otomatis (termasuk diskon/pajak jika ada).
- **Status Bayar**: Lunas / Belum Lunas / DP.
- **Cetak Nota**: Export PDF A4 atau layout thermal.

### 6. Laporan & Analitik

Menggantikan pencatatan omset manual di komputer.

- **Laporan Omset Harian/Bulanan**: Total pemasukan, margin kotor.
- **Laporan Penjualan Sparepart**: Barang terlaris, barang slow-moving.
- **Laporan Stok Opname**: Rekap selisih stok dari sesi opname.
- **Export**: CSV / PDF.

### 7. Pengaturan (Settings)

- **Profil Bengkel**: Nama, alamat, logo, kontak WA.
- **Manajemen User & Role**: Owner, Admin, Kasir (3 Role Sistem). Tambah / edit akun oleh Owner atau Admin. Akun Owner tidak bisa dibuat atau dihapus via panel.
- **Permission Editor** _(Owner only)_: Owner dapat mengatur halaman mana yang boleh diakses oleh Admin dan Kasir. Perubahan disimpan di local storage dan diterapkan ke sidebar + route guard secara langsung.
- **Konfigurasi WA**: Setup nomor tujuan notif stok (`wa_target_number`). Koneksi WA menggunakan WhatsApp Web.js — tidak memerlukan token gateway eksternal.

---

## Aturan Pengembangan (Development Rules)

🚨 **WAJIB DIPATUHI**:

1. **Gunakan Komponen Bawaan**: Seluruh UI **WAJIB** menggunakan komponen yang sudah ada di `src/components/` (template NextAdmin). Jangan bangun dari awal jika sudah tersedia.
2. **Styling Monokrom**: Komponen baru wajib ikut tema hitam-putih dari `tailwind.config.ts`. Dilarang tambahkan `shadow-*`, `animate-*`, atau warna custom di luar primary/secondary.
3. **Pisahkan Dummy Data**: Semua mock/dummy data di file/folder tersendiri (misal `src/mocks/`). Saat BE siap, cukup ganti data source tanpa ubah struktur UI.
4. **Komponen Harus Stateless dari API**: Gunakan props + custom hook sebagai lapisan data. UI tidak boleh fetch langsung di dalam JSX/TSX komponen.
5. **Scope MVP Ketat**: Jangan kembangkan fitur di luar daftar MVP. Fitur "nice to have" masuk backlog post-MVP.
