# Alur Per-Modul & Fitur — AutoService Web Panel

> **Dokumen ini** mendeskripsikan alur kerja (user flow) untuk setiap modul/fitur sistem.
> Setiap alur menggambarkan siapa aktor-nya, langkah-langkah interaksi, dan output yang dihasilkan.
> **Last Updated:** 2026-03-03

---

## Daftar Modul

1. [Auth — Login & Akses Sistem](#1-auth--login--akses-sistem)
2. [Dashboard](#2-dashboard)
3. [Antrean Masuk / Work Order](#3-antrean-masuk--work-order)
4. [Kasir & Transaksi](#4-kasir--transaksi)
5. [Inventori & Stok](#5-inventori--stok)
6. [Pelanggan & Kendaraan](#6-pelanggan--kendaraan)
7. [Laporan & Analitik](#7-laporan--analitik)
8. [Notifikasi WhatsApp](#8-notifikasi-whatsapp)
9. [Pengaturan](#9-pengaturan)
10. [Import / Export Excel (Bulk Data)](#10-import--export-excel-bulk-data)

---

## 1. Auth — Login & Akses Sistem

### Aktor

Semua role (Owner, Admin, Kasir)

### Alur Login

```
Buka aplikasi
    │
    ▼
Cek localStorage["auth_user"]
    │
    ├─── ada? ──► Lanjut ke halaman terakhir / Dashboard
    │
    └─── kosong? ──► Redirect ke /auth/sign-in
                          │
                          ▼
                    Input username + password
                          │
                          ▼
                    Validasi vs MOCK_USERS
                    (prod: POST /auth/login → JWT)
                          │
                    ┌─────┴─────┐
                  Match       Tidak match
                    │             │
                    ▼             ▼
              Simpan ke      Tampil error
              localStorage   "Username atau
              auth_user      password salah"
                    │
                    ▼
               Redirect ke /
```

### Route Guard (per halaman)

```
User buka URL /bengkel/karyawan
    │
    ▼
DashboardLayout cek localStorage["auth_user"]
    │
    ├─── tidak ada? ──► Redirect /auth/sign-in
    │
    └─── ada ──► Baca role
                    │
                    ▼
              canAccess(role, "/bengkel/karyawan")
                    │
                    ├─── true ──► Render halaman
                    │
                    └─── false ──► Redirect ke ROLE_HOME
                                   Owner / Admin → /
                                   Kasir → /bengkel/antrean
```

### Default Akses per Role

| Halaman              | Owner | Admin | Kasir |
| -------------------- | ----- | ----- | ----- |
| Dashboard            | ✅    | ✅    | ❌    |
| Antrean Masuk        | ✅    | ✅    | ✅    |
| Kasir & Transaksi    | ✅    | ✅    | ✅    |
| Inventori (+ sub)    | ✅    | ✅    | ❌    |
| Pelanggan            | ✅    | ✅    | ❌    |
| Kendaraan            | ✅    | ✅    | ❌    |
| Karyawan             | ✅    | ✅    | ❌    |
| Laporan              | ✅    | ✅    | ❌    |
| Reminder & Follow-up | ✅    | ✅    | ❌    |
| Pengaturan           | ✅    | ❌    | ❌    |

> Kasir login → otomatis redirect ke `/bengkel/antrean` (bukan Dashboard).  
> Owner dapat mengubah akses Admin & Kasir melalui **Permission Editor** di Pengaturan.

---

## 2. Dashboard

### Aktor

Owner (full), Admin (full)

> **Kasir tidak bisa akses Dashboard.** Setelah login, Kasir langsung diarahkan ke `/bengkel/antrean`.

### Alur

```
Setelah login berhasil (Owner / Admin)
    │
    ▼
Halaman / (Dashboard)
    │
    ▼
Fetch data ringkasan (saat ini: mock data)
    │
    ▼
Render komponen:
  ├─ Cards statistik: Omset hari ini, Total transaksi, Item low stock, Kendaraan aktif
  ├─ Grafik Revenue: Mingguan / Bulanan (line chart)
  ├─ Top Services: Jasa terlaris bulan ini (bar chart)
  ├─ Alert Panel: Item stok < minimum (jika ada)
  ├─ Device breakdown (pie chart)
  └─ Tabel antrean aktif hari ini (5 teratas)
```

---

## 3. Antrean Masuk / Work Order

### Aktor

Owner, Admin (penuh); Kasir (view + update status bayar)

### Alur Penerimaan Kendaraan

```
Kendaraan datang ke bengkel
    │
    ▼
Buka /bengkel/antrean
    │
    ▼
Klik "+ Tambah Antrean"
    │
    ▼
Isi Form Penerimaan:
  - Pilih / tambah customer
  - Pilih kendaraan milik customer
  - Isi keluhan / catatan pelanggan
  - Catatan mekanik awal
  - Toggle "Menginap" (jika kendaraan tidak bisa diambil hari ini)
  - Estimasi biaya awal (opsional)
    │
    ▼
Simpan → Work Order terbuat
    │
    ▼
Tampil di Tabel Antrean (view default)
  atau Kanban Board (switch view)
```

### Status Work Order

```
Menunggu ──► Proses ──► Selesai ──► Diambil
                │
                └──► Menginap (flag tambahan, bisa di status Menunggu/Proses)
```

### Tampilan Badge

- Status ditampilkan sebagai badge berwarna di kolom **Status**
- Jika `menginap = true` → badge berubah menjadi **"Menginap"** (merah/danger)
- Di Kanban Board → ada badge "Menginap" terpisah di bawah info waktu masuk

### View Mode

| Mode   | Deskripsi                                                                                     |
| ------ | --------------------------------------------------------------------------------------------- |
| Tabel  | Tampilan list dengan kolom: No. Polisi, Customer, Keluhan, Mekanik, Waktu Masuk, Status, Aksi |
| Kanban | Board berkolom per status — lebih mudah untuk visual progress pengerjaan                      |

---

## 4. Kasir & Transaksi

### Aktor

Kasir (penuh); Admin & Owner (bisa akses jika punya izin)

### Alur Buat Nota Servis

```
Tab "Buat Nota Servis" di /bengkel/kasir
    │
    ▼
Step 1 — Pilih Customer & Kendaraan:
  - Cari customer (search)
  - Pilih kendaraan terdaftar
  - Atau: Buat customer / kendaraan baru inline
    │
    ▼
Step 2 — Tambah Item & Jasa:
  - Pilih sparepart dari katalog (qty otomatis kurang stok saat transaksi disimpan)
  - Pilih jasa dari Katalog Jasa (harga standar)
  - Input diskon / pajak jika ada
  - Kalkulasi total otomatis
    │
    ▼
Step 3 — Konfirmasi & Bayar:
  - Pilih metode pembayaran: Tunai / Transfer / E-Wallet
  - Set status: Lunas / DP / Belum Bayar
  - Klik "Selesaikan Transaksi"
    │
    ▼
Transaksi tersimpan → Stok otomatis berkurang (BE)
    │
    ▼
Modal Invoice muncul → opsi Cetak PDF
```

### Alur POS Cepat

```
Tab "POS Cepat" → Grid katalog jasa/sparepart
    │
    ▼
Klik item → masuk ke keranjang
    │
    ▼
Review keranjang → sesuaikan qty / hapus
    │
    ▼
Klik "Checkout" → pilih metode bayar → selesai
```

### Tab di Halaman Kasir

| Tab               | Konten                                                            |
| ----------------- | ----------------------------------------------------------------- |
| Riwayat Transaksi | Tabel semua transaksi + filter status bayar + cetak ulang invoice |
| Buat Nota Servis  | Form 3-step buat transaksi baru                                   |
| POS Cepat         | Grid katalog + keranjang untuk transaksi cepat                    |

---

## 5. Inventori & Stok

### Aktor

Owner, Admin (penuh); Kasir (tidak bisa akses — default)

### Sub-modul & Alur

#### 5a. Katalog Sparepart (`/bengkel/inventori`)

```
Buka halaman Inventori
    │
    ▼
Tabel katalog sparepart (search + filter kategori/tipe)
    │
    ├─ Klik "+ Tambah" ──► Modal form (nama, SKU, kategori, harga, stok, min-stok)
    │                           │
    │                           ▼
    │                      Simpan → item baru muncul di tabel
    │
    ├─ Klik baris item ──► Detail + riwayat stok item
    │
    ├─ Klik "Edit" ──► Modal edit (inline)
    │
    ├─ Klik "Barcode" ──► Modal label barcode
    │                         │
    │                         ▼
    │                    Tampil barcode Code-128 / QR
    │                    Tombol "Cetak" → generate PDF / thermal
    │
    └─ Klik "Hapus" ──► Konfirmasi → soft delete
```

#### 5b. Stok Masuk (`/bengkel/inventori/stok`)

```
Tab "Stok Masuk"
    │
    ▼
Form: pilih item, qty, tanggal, catatan (no. faktur supplier)
    │
    ▼
Simpan → current_stock item bertambah
       → entri log pergerakan stok terbuat
```

#### 5c. Stok Keluar (manual)

```
Tab "Stok Keluar"
    │
    ▼
Form: pilih item, qty, alasan (pemakaian servis / jual ecer / rusak)
    │
    ▼
Simpan → current_stock item berkurang
       → entri log terbuat
       → jika stok < minimum → trigger notif WA (BE)
```

#### 5d. Stok Opname (`/bengkel/inventori/opname`)

```
Klik "Mulai Sesi Opname"
    │
    ▼
Sesi aktif terbuka — tabel semua item
    │
    ▼
Untuk setiap item: input "Stok Fisik Aktual"
    │
    ▼
Sistem otomatis hitung: Selisih = Fisik - Sistem
    │
    ▼
Review selisih (hijau = lebih, merah = kurang)
    │
    ▼
Klik "Tutup & Apply Opname"
    │
    ▼
Stok sistem di-update sesuai fisik
Rekap opname tersimpan → bisa dilihat di Laporan
```

---

## 6. Pelanggan & Kendaraan

### Aktor

Owner, Admin (penuh)

### Alur Data Pelanggan (`/bengkel/pelanggan`)

```
Tabel daftar pelanggan (search nama / no. tlp)
    │
    ├─ Klik "+ Tambah Customer"
    │       │
    │       ▼
    │   Form: nama, no. WA/HP, alamat
    │       │
    │       ▼
    │   Simpan → customer baru ditambahkan
    │
    ├─ Klik nama customer ──► Modal Detail Customer
    │       │
    │       ▼
    │   Tab "Kendaraan": daftar kendaraan milik customer
    │       │
    │       ├─ Tambah kendaraan baru (no. polisi, tipe, merek, model, tahun)
    │       └─ Lihat detail / edit / hapus kendaraan
    │
    │   Tab "Riwayat Servis": histori transaksi customer
    │       └─ Lihat detail setiap transaksi
    │
    └─ Klik "Hapus" ──► Konfirmasi → soft delete
```

### Alur Data Kendaraan (`/bengkel/kendaraan`)

```
Tabel semua kendaraan (lintas customer) — search + filter tipe
    │
    ├─ Klik kendaraan ──► ServiceBook modal
    │       │
    │       ▼
    │   Riwayat lengkap servis kendaraan itu:
    │   tanggal, keluhan, jasa, sparepart, total bayar
    │
    └─ Klik nama customer di baris ──► Redirect ke detail customer
```

---

## 7. Laporan & Analitik

### Aktor

Owner, Admin (default); Kasir (tidak bisa akses — default)

### Alur

```
Buka /bengkel/laporan
    │
    ▼
Pilih Tab:
  ├─ Laporan Keuangan
  │     │
  │     ▼
  │   Pilih periode (harian / mingguan / bulanan / custom range)
  │     │
  │     ▼
  │   Tabel transaksi periode tsb + ringkasan:
  │     Total omset, Total HPP, Margin kotor
  │     │
  │     └─ Export → CSV / PDF
  │
  └─ Laporan Analitik
        │
        ▼
      Grafik top sparepart terlaris (bar chart)
      Grafik tren penjualan per kategori
      Tabel slow-moving items
      Rekap stok opname sebelumnya
        │
        └─ Export → CSV / PDF
```

---

## 8. Notifikasi WhatsApp

### Aktor

- **Trigger otomatis** (sistem/BE — dipicu stock movement & update status Work Order)
- **Konfigurasi & manajemen** oleh Owner/Admin di panel

> **Implementasi:** WhatsApp Web.js (`whatsapp-web.js`) — terhubung langsung ke WA tanpa gateway pihak ketiga. **Hanya dijalankan di local** (`npm run dev`), tidak di-deploy ke server/cloud. Session disimpan di `.wwebjs_auth/`.

### Alur Koneksi WhatsApp (QR Scan)

```
Server start → initWaClient() dipanggil otomatis
    │
    ▼
[GET] /notifications/wa/status → status: "initializing"
    │
    ▼
 Tunggu QR tersedia (~3-5 detik)
    │
    ▼
[GET] /notifications/wa/qr → { qr: "data:image/png;base64,..." }
    │
    ▼
FE tampilkan gambar QR → Admin/Owner scan dengan HP WhatsApp
    │
    ▼
[GET] /notifications/wa/status → status: "authenticated" → "ready"
    │
    ▼
Kirim notif test via [POST] /notifications/wa/test
```

> Jika client disconnect atau token expired → restart via [POST] /notifications/wa/restart, lalu scan QR baru.

### Alur Notif Stok Menipis

```
[Event] Stok item berubah (transaksi / stok keluar)
    │
    ▼
BE: cek current_stock vs minimum_stock item
    │
    ├─ current_stock <= minimum_stock?
    │       │
    │       ▼
    │   triggerWaNotificationIfNeeded(sparePartId, stock)
    │       │
    │       ▼
    │   Buat log wa_notifications (status: pending)
    │       │
    │       ▼
    │   sendWaMessage(wa_target_number, pesan) → WA Web.js
    │   Pesan: "⚠️ Stok [nama item] tinggal [N] [unit]..."
    │       │
    │   ┌───┴───┐
    │  OK      Error
    │   │       │
    │  status   status
    │  "sent"   "failed" → retry via POST /notifications/wa/retry/:id
    │
    └─ stok masih aman → tidak ada aksi
```

### Alur Notif Progress Servis ke Pelanggan

```
Admin/Mekanik update status Work Order via PATCH /work-orders/:id/status
    │
    ▼
Status berubah ke "dikerjakan" atau "selesai"
    │
    ▼
BE: ambil no. WA dari data customer work order
    │
    ▼
sendServiceProgressNotification(phone, platNomor, status, woId)
    │
    ▼
Kirim WA ke pelanggan:
  - "dikerjakan": "Kendaraan Anda [no.pol] sedang dikerjakan..."
  - "selesai": "Kendaraan Anda [no.pol] sudah selesai dan siap diambil..."
    │
    ▼
Log terkirim di tabel wa_notifications
```

### Riwayat Notif (UI)

- Tampil di tab **Reminder & Follow-up** (`/bengkel/reminder`)
- Tabel: tanggal, tipe (stok/pelanggan), penerima, pesan, status (sent/failed/pending)
- Retry manual untuk yang failed via [POST] /notifications/wa/retry/:id

### Endpoint API WA

| Method | Endpoint                      | Deskripsi                                      |
| ------ | ----------------------------- | ---------------------------------------------- |
| GET    | `/notifications/wa`           | Log semua notifikasi WA                        |
| GET    | `/notifications/wa/status`    | Status koneksi WA client                       |
| GET    | `/notifications/wa/qr`        | Ambil QR code (base64) untuk scan              |
| POST   | `/notifications/wa/restart`   | Restart WA client (scan QR baru)               |
| POST   | `/notifications/wa/test`      | Kirim pesan test ke nomor wa_target_number     |
| POST   | `/notifications/wa/retry/:id` | Retry kirim notifikasi yang gagal (status failed) |

---

## 9. Pengaturan

### Aktor per Tab

| Tab                | Owner | Admin | Kasir |
| ------------------ | ----- | ----- | ----- |
| Profil Bengkel     | ✅    | ❌    | ❌    |
| Operasional        | ✅    | ❌    | ❌    |
| Pengaturan Invoice | ✅    | ❌    | ❌    |
| Katalog Jasa       | ✅    | ❌    | ❌    |
| WA Gateway         | ✅    | ❌    | ❌    |
| Manajemen Akun     | ✅    | ✅    | ❌    |

> Akses halaman Pengaturan secara keseluruhan default hanya untuk Owner. Admin dan Kasir dapat diberikan akses via Permission Editor.

### Alur Profil Bengkel

```
Tab "Profil Bengkel"
    │
    ▼
Edit: nama bengkel, no. telp/WA, email, alamat, NPWP, SIUP
Upload logo bengkel
    │
    ▼
Klik "Commit Changes" → tersimpan (BE: PUT /settings/profile)
```

### Alur Manajemen Akun

```
Tab "Manajemen Akun" (Owner / Admin)
    │
    ▼
Daftar akun pengguna terdaftar (dengan role badge)
    │
    ├─ Klik "+ Tambah Akun"
    │       │
    │       ▼
    │   Form: nama, username, password, role (Admin / Kasir)
    │   * Role Owner tidak bisa dibuat via panel
    │       │
    │       ▼
    │   Simpan → akun baru ditambahkan
    │   (BE: POST /users)
    │
    └─ Klik "Edit" di akun non-Owner ──► Edit nama / password / role
```

### Alur Permission Editor _(Owner only)_

```
Tab "Manajemen Akun" → Bagian "Pengaturan Izin Akses"
    │
    ▼
Tabel: setiap baris = 1 halaman, kolom = Admin | Kasir
    │
    ▼
Toggle checkbox untuk mengizinkan / melarang akses halaman
    │
    ▼
Klik "Simpan Izin"
    │
    ▼
Tersimpan di localStorage["role_permissions"]
    │
    ▼
Efek langsung:
  ├─ Sidebar Admin/Kasir update (menu tersembunyi jika tidak punya akses)
  └─ Route guard aktif (akses url langsung juga diblokir → redirect ke /)
```

### Alur Konfigurasi WA Gateway

```
Tab "WA Gateway"
    │
    ▼
Input nomor WA tujuan notif stok (wa_target_number)
    │
    ▼
Simpan nomor target (BE: PUT /settings → wa_target_number)
    │
    ▼
Scan QR WhatsApp Web.js:
  [BE] GET /notifications/wa/status
    ├─ status "ready" ──► WA sudah terhubung, tidak perlu scan
    ├─ status "qr_ready" ──► GET /notifications/wa/qr → tampilkan QR ke UI
    └─ status "disconnected" ──► POST /notifications/wa/restart → tunggu QR baru
    │
    ▼
[Admin] Scan QR dengan WhatsApp di HP
    │
    ▼
Status berubah → "authenticated" → "ready"
    │
    ▼
Test kirim pesan: [POST] /notifications/wa/test → notif "Koneksi OK" jika terkirim
```

---

## Ringkasan Alur Utama (End-to-End)

### Alur Servis Kendaraan — dari Datang hingga Bayar

```
Kendaraan datang
    │
    ▼ [Admin / Owner]
Buat Work Order (Antrean) → set status "Menunggu"
    │
    ▼ [Mekanik / Admin]
Update status → "Proses" → notif WA terkirim ke pelanggan
    │
    ▼ [Mekanik / Admin]
Update status → "Selesai" → notif WA terkirim ke pelanggan
    │
    ▼ [Kasir]
Buka tab Kasir → Buat Nota Servis dari data WO
Tambah item sparepart + jasa → konfirmasi total
    │
    ▼
Pilih metode bayar → Lunas
    │
    ▼
Stok sparepart otomatis berkurang
Invoice ter-generate → cetak / kirim ke pelanggan
    │
    ▼ [Admin / Owner]
Update status WO → "Diambil" → selesai
```

### Alur Monitoring Stok — dari Masuk hingga Alert

```
Restock dari supplier
    │
    ▼ [Admin]
Catat Stok Masuk: pilih item + qty
    │
    ▼
current_stock bertambah
    │
    ▼
Kendaraan diservis → pakai sparepart
    │
    ▼ [Kasir / Sistem]
Stok otomatis berkurang via transaksi
    │
    ▼
BE cek: current_stock < minimum_stock?
    │
    ├─ Ya → kirim notif WA ke Owner/Admin
    │         catat di log notifikasi
    │
    └─ Tidak → tidak ada aksi
```
---

## 10. Import / Export Excel (Bulk Data)

### Aktor
Owner (full), Admin (full), Kasir (hanya tabel yang bisa diakses)

### Latar Belakang
Setiap tabel utama dilengkapi 3 tombol Excel di toolbar:
- **Template** — download file `.xlsx` kosong + 2 baris contoh, sesuai schema kolom modul
- **Import** — upload file `.xlsx/.xls`, tampil preview, konfirmasi sebelum data masuk
- **Export** — download semua data aktif di tabel saat ini ke file `.xlsx`

### Modul yang Didukung
| Modul | Schema Kolom Utama |
|-------|--------------------|
| Inventori | SKU, Nama Item, Kategori, Harga Modal, Harga Jual, Stok, Min. Stok, Satuan, Tipe |
| Pelanggan | Nama, Telepon, Email, Alamat |
| Kendaraan | No. Polisi, Merk, Model, Tipe, Tahun, Warna, ID Pemilik |
| Karyawan | Nama, Role, Status, Telepon, Tanggal Bergabung, Rating |
| Antrean | No. Polisi, Kendaraan, Tipe, Pelanggan, Layanan, WA, Mekanik, Keluhan, Estimasi Biaya |

### Alur Export

```
User klik tombol [Export]
    │
    ▼
exportToExcel(moduleKey, dataAktif)
    │
    ▼
Generate file: <nama_modul>_<tanggal>.xlsx
    │
    ▼
Browser trigger download otomatis
```

### Alur Download Template

```
User klik tombol [Template]
    │
    ▼
downloadTemplate(moduleKey)
    │
    ▼
Generate file: template_<nama_modul>.xlsx
(berisi baris header + 2 baris contoh)
    │
    ▼
Browser trigger download otomatis
```

### Alur Import

```
User klik tombol [Import]
    │
    ▼
Buka file picker (accept: .xlsx, .xls)
    │
    ▼
User pilih file → parseExcelImport(file)
    │
    ▼
Tampil ImportPreviewModal:
  ├─ Header kolom dari file
  ├─ Preview 5 baris pertama
  └─ Jumlah total baris ditemukan
    │
    ├── Ada error (file rusak)? ──► Tampil pesan error, batal
    │
    └── Data valid? ──► Tombol [Import N Data]
                              │
                              ▼
                        onImport(rows) dipanggil
                        (parent update state / kirim ke BE)
                              │
                              ▼
                        Modal tertutup, data masuk
```

### File & Komponen
| File | Keterangan |
|------|------------|
| `src/lib/excel.ts` | Core utility: `exportToExcel`, `downloadTemplate`, `parseExcelImport`, converter per modul |
| `src/components/Bengkel/shared/ExcelButtons.tsx` | Komponen 3-tombol + `ImportPreviewModal` |
| `src/components/ui/DataTable.tsx` | `extraActions` prop untuk render ExcelButtons di toolbar |

### Library
`xlsx` (SheetJS) — client-side, tidak butuh server untuk generate/parse file Excel.