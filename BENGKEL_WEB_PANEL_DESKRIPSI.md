# Deskripsi Web Panel Admin Bengkel AutoService

Web Panel ini dirancang untuk mempermudah operasional **Bengkel AutoService (Mobil & Motor)**, mulai dari pendaftaran pelanggan, pemantauan status servis kendaraan, manajemen stok sparepart, hingga pelaporan keuangan kasir. Desain panel menggunakan tema "Premium Garage" yang modern, elegan, dan profesional.

Berikut adalah usulan struktur dan fitur lengkap dari Web Panel Bengkel AutoService:

## 1. Dashboard (Ikhtisar)
Halaman utama yang memberikan ringkasan (snapshot) dari seluruh aktivitas bengkel secara *real-time*.
*   **Statistik Harian/Bulanan**: Total pendapatan, jumlah antrean masuk (Mobil & Motor), kendaraan selesai, dll.
*   **Grafik Pendapatan**: Visualisasi pendapatan bengkel.
*   **Aktivitas Terbaru**: Log singkat kendaraan yang baru masuk atau baru selesai.
*   **Peringatan Stok**: Notifikasi untuk sparepart yang stoknya sudah menipis.

## 2. Manajemen Antrean (Service Queue)
Modul untuk mengelola alur kerja kendaraan di bengkel, dari kedatangan hingga selesai.
*   **Daftar Antrean**: Tabel status kendaraan (Menunggu, Dikerjakan, Menunggu Sparepart, Selesai). *Mendukung filter Tipe Kendaraan (Mobil/Motor)*.
*   **Tambah Antrean Baru**: Pendaftaran kendaraan masuk (Data pelanggan, jenis/plat kendaraan, keluhan, estimasi).
*   **Update Status pengerjaan**.
*   **Penugasan Mekanik**.

## 3. Manajemen Pelanggan (Customers)
*   **Daftar Pelanggan**: Nama, Kontak, dan riwayat kunjungannya.
*   **Riwayat Servis**: Histori lengkap perawatan untuk tiap pelanggan (bisa mencakup beberapa kendaraan baik motor maupun mobil).

## 4. Manajemen Kendaraan (Vehicles)
*   **Data Kendaraan**: Plat Nomor, Tipe (Mobil/Motor), Merk, Model, dan Pemilik.
*   **Buku Servis Digital**: Catatan lengkap perbaikan dan penggantian suku cadang.

## 5. Manajemen Inventori & Sparepart (Inventory)
Pengelolaan stok suku cadang bengkel.
*   **Katalog Sparepart**: Daftar barang (kategori mobil/motor/umum), harga modal, harga jual, dan stok.
*   **Sistem Barcode Manual**: *Sistem akan men-*generate* kode SKU/Barcode yang dapat dicetak (print) lalu ditempelkan secara manual ke fisik sparepart atau rak.* Kasir/Mekanik bisa men-scan barcode ini nanti saat penggunaan.
*   **Riwayat Barang Masuk/Keluar**.

## 6. Kasir & POS (Point of Sale)
Sistem pembayaran tranksaksi pelanggan (Checkout).
*   **Buat Invoice / Transaksi Baru**:
    *   Fokus kasir melayani pembayaran dari servis (menyatukan jasa mekanik & scan barcode sparepart yang dipakai).
    *   Bisa juga untuk **pembelian sparepart langsung** (tanpa servis).
*   **Status Pembayaran**: Lunas, DP, Piutang.
*   **Metode Pembayaran**: Cash, Transfer Bank, E-Wallet, Kartu.
*   **Cetak Struk/Nota**: Bisa print struk thermal (kasir) atau nota A4, serta opsi kirim via WA/Email.

## 7. Manajemen Karyawan / Mekanik (Staff)
*   **Daftar Mekanik & Staff**: Nama, posisi, nomor telepon.
*   **Perfoma / Log Kerja**: Melihat berapa banyak kendaraan yang sudah dikerjakan oleh mekanik A bulan ini (bisa untuk perhitungan insentif/bonus).

## 8. Laporan & Analitik (Reports)
Modul pelaporan untuk owner / manajer bengkel.
*   **Laporan Keuangan**: Laba/rugi, arus kas harian/bulanan.
*   **Laporan Penjualan Sparepart**: Sparepart yang paling laku.
*   **Laporan Layanan**: Layanan (jasa) yang paling sering diminta pelanggan (misal: Ganti Oli, Tune up).

## 9. Pengaturan (Settings)
*   **Profil Bengkel**: Nama bengkel, alamat, logo, jam operasional.
*   **Role & Hak Akses**: Pengaturan peran pengguna web panel (Admin, Kasir, Mekanik, Owner).
*   **Katalog Layanan/Jasa**: Master data untuk jenis-jenis jasa perbaikan beserta standar harganya.

---

## Aturan Pengembangan (Development Rules)
🚨 **WAJIB DIPATUHI**: 
1. **Gunakan Komponen Bawaan**: Seluruh antarmuka (UI) dalam sistem ini **WAJIB menggunakan komponen bawaan (UI elements, Tables, Forms, Layouts, dsb)** yang sudah ada di dalam template NextAdmin (lokasi: `src/components/`). Jangan membuat komponen/style *from scratch* jika elemen yang serupa (seperti Button, Input, Modal, Table) sudah tersedia di *library* template untuk menjaga konsistensi desain dan mempercepat *development*.
2. **Styling Komponen Baru**: Jika terpaksa harus membuat komponen baru karena tidak ada di template dasar, **WAJIB** meniru hirarki warna, *spacing*, dan *styling* CSS (Tailwind) yang identik dengan komponen bawaan agar *feel* aplikasinya tetap menyatu.
3. **Pemisahan Dummy Data (Persiapan Integrasi API)**: Karena fase saat ini berfokus pada pekerjaan *Frontend* terlebih dahulu, semua **Dummy Data** harus diletakkan pada folder/file terpisah (misalnya di *mock folder* atau di dalam direktori komponen/halaman itu sendiri namun dalam konstan pisah). Ini agar tidak terjadi kerja dua kali (2x); ketika *Backend* sudah siap, kita hanya tinggal menyambungkan *API Fetcher* pada penangkap datanya tanpa merombak struktur UI.
