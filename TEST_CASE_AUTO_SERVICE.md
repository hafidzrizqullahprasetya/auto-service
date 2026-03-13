# 🧪 Dokumen Pengujian Perangkat Lunak (Software Test Case)
**Aplikasi:** Auto Service Management System  
**Modul:** Full System (Auth, Antrean, Kasir, Inventori, Pelanggan, Kendaraan, Pengaturan)  
**Tujuan:** Memastikan seluruh fungsionalitas aplikasi berjalan sesuai spesifikasi (Normal) dan tahan terhadap input tidak valid (Negative).

---

## 1. Modul: Authentikasi & Aktivitas Akun (Auth)
Layanan untuk manajemen akses pengguna ke dalam sistem.

| No | Test Type | Test Item | Scenario | Precondition | Expected Result | Result | Approval PO | Dokumentasi |
|:---|:---|:---|:---|:---|:---|:---:|:---:|:---|
| 1.1 | Normal | Login Admin | Input email & password yang benar | Akun admin terdaftar di DB | Berhasil masuk ke Dashboard | [Ok/Fail] | [ ] | [Video] |
| 1.2 | Negative | Login Gagal | Input password salah | Akun admin terdaftar | Muncul alert "Invalid Credentials" | [Ok/Fail] | [ ] | [Video] |
| 1.3 | Normal | Update Profile | Mengubah nama & foto profil di Pengaturan | User sudah login | Data profil tersimpan dan terupdate di sidebar | [Ok/Fail] | [ ] | [Video] |
| 1.4 | Negative | Login Email Kosong | Klik login tanpa input email | Halaman login terbuka | Muncul validasi "Email wajib diisi" | [Ok/Fail] | [ ] | [Video] |
| 1.5 | Normal | Logout | Klik tombol logout di menu | User sedang login | Session berakhir & diarahkan ke login | [Ok/Fail] | [ ] | [Video] |

---

## 2. Modul: Antrean Kendaraan (Work Orders)
Manajemen pendaftaran unit servis dan monitoring progress (Kanban).

| No | Test Type | Test Item | Scenario | Precondition | Expected Result | Result | Approval PO | Dokumentasi |
|:---|:---|:---|:---|:---|:---|:---:|:---:|:---|
| 2.1 | Normal | Entry Antrean Baru | Input data unit, pelanggan, keluhan & estimasi | Data master (layanan) tersedia | Antrean muncul di kolom "Menunggu" | [Ok/Fail] | [ ] | [Video] |
| 2.2 | Negative | Entry Tanpa No. Plat | Simpan antrean tanpa No. Polisi | Modal Antrean terbuka | Validasi error "No. Polisi wajib diisi" | [Ok/Fail] | [ ] | [Video] |
| 2.3 | Normal | Update Progress | Drag & drop card dari Menunggu ke Dikerjakan | Ada card di kolom "Menunggu" | Status WO berubah & notif WA terkirim | [Ok/Fail] | [ ] | [Video] |
| 2.4 | Normal | Edit Mekanik | Mengganti mekanik penanggung jawab di card | WO status "Dikerjakan" | Nama mekanik terupdate secara realtime | [Ok/Fail] | [ ] | [Video] |
| 2.5 | Normal | Bayar ke Kasir | Klik "Lanjut ke Kasir" pada card Selesai | WO status "Selesai" | Redirect ke Kasir dengan data terisi otomatis | [Ok/Fail] | [ ] | [Video] |

---

## 3. Modul: Kasir & POS (Point of Sale)
Proses transaksi, pembayaran, dan pencetakan invoice.

| No | Test Type | Test Item | Scenario | Precondition | Expected Result | Result | Approval PO | Dokumentasi |
|:---|:---|:---|:---|:---|:---|:---:|:---:|:---|
| 3.1 | Normal | Auto-Fill WO | Membuka form transaksi via redirect Antrean | Redirect dari menu Antrean | Pelanggan & Kendaraan terpilih otomatis | [Ok/Fail] | [ ] | [Video] |
| 3.2 | Normal | Simpan Transaksi Lunas | Buat transaksi & pilih status "Lunas" | Stok sparepart mencukupi | Transaksi disimpan & muncul di Riwayat | [Ok/Fail] | [ ] | [Video] |
| 3.3 | Negative | Stok Tidak Cukup | Input sparepart melebihi stok yang ada | Stok sparepart terbatas | Alert "Stok tidak mencukupi" muncul | [Ok/Fail] | [ ] | [Video] |
| 3.4 | Normal | Transaksi DP (Belum Lunas) | Input bayar kurang dari total tagihan | Form transaksi terbuka | Status tetap "Belum Bayar/Parsial" | [Ok/Fail] | [ ] | [Video] |
| 3.5 | Normal | Cetak Invoice | Klik tombol cetak/print pada riwayat | Transaksi sudah tersimpan | Printer dialog muncul / PDF terunduh | [Ok/Fail] | [ ] | [Video] |

---

## 4. Modul: Inventori & Suku Cadang
Manajemen stok barang dan jasa servis.

| No | Test Type | Test Item | Scenario | Precondition | Expected Result | Result | Approval PO | Dokumentasi |
|:---|:---|:---|:---|:---|:---|:---:|:---:|:---|
| 4.1 | Normal | Tambah Sparepart | Input SKU, Nama, Kategori, Harga & Stok | Halaman Inventori terbuka | Barang muncul di daftar inventori | [Ok/Fail] | [ ] | [Video] |
| 4.2 | Normal | Adjust Stok | Mengubah jumlah stok secara manual | Barang sudah terdaftar | Nilai stok berubah & tercatat di log | [Ok/Fail] | [ ] | [Video] |
| 4.3 | Negative | Harga Minus | Input harga jual bernilai negatif (-1000) | Form Edit Barang | Muncul validasi "Harga harus positif" | [Ok/Fail] | [ ] | [Video] |
| 4.4 | Normal | Filter Kategori | Memilih kategori "Jasa" | Ada data jasa & sparepart | Hanya item kategori Jasa yang tampil | [Ok/Fail] | [ ] | [Video] |

---

## 5. Modul: Pelanggan & Kendaraan
Database master pemilik kendaraan.

| No | Test Type | Test Item | Scenario | Precondition | Expected Result | Result | Approval PO | Dokumentasi |
|:---|:---|:---|:---|:---|:---|:---:|:---:|:---|
| 5.1 | Normal | Create Pelanggan | Input Nama, HP, dan Alamat | Halaman Pelanggan terbuka | Pelanggan tersimpan di database | [Ok/Fail] | [ ] | [Video] |
| 5.2 | Normal | Bind Unit ke User | Tambah plat nomor ke profil pelanggan | Pelanggan sudah terdaftar | Unit muncul di detail profil pelanggan | [Ok/Fail] | [ ] | [Video] |
| 5.3 | Negative | HP Duplikat | Input nomor HP yang sudah ada di sistem | Ada pelanggan dengan HP sama | Alert "Nomor HP sudah terdaftar" muncul | [Ok/Fail] | [ ] | [Video] |

---

## 6. Modul: Pengaturan & Karyawan (Settings)
Konfigurasi sistem dan manajemen tim.

| No | Test Type | Test Item | Scenario | Precondition | Expected Result | Result | Approval PO | Dokumentasi |
|:---|:---|:---|:---|:---|:---|:---:|:---:|:---|
| 6.1 | Normal | Ganti Nama Bengkel | Mengubah info nama bengkel di Settings | Menu Pengaturan terbuka | Header & Laporan berubah nama bengkelnya | [Ok/Fail] | [ ] | [Video] |
| 6.2 | Normal | Tambah Mekanik | Input data mekanik baru | Menu Karyawan terbuka | Nama mekanik tampil di dropdown Antrean | [Ok/Fail] | [ ] | [Video] |
| 6.3 | Normal | Role Permission | Login sebagai Kasir (Non-Admin) | Akun Kasir dibuat | Menu Laporan/Hapus Data tidak bisa diakses | [Ok/Fail] | [ ] | [Video] |

---

**Keterangan Hasil Akhir:**
- **Ok (Hijau):** Fitur berjalan sempurna sesuai alur bisnis.
- **Fail (Merah):** Ditemukan bug/error yang menghambat alur kerja.
