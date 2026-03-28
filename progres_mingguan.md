# 🎬 Script Video Progress Mingguan — Auto Service
### Peran: Frontend Developer | Minggu: 28 Maret 2026

---

## 🎙️ OPENING (0:00 – 0:30)

> *[Layar: Desktop/IDE terbuka, atau langsung ke browser app]*

**Narasi:**
"Hai semua, di video minggu ini aku bakal ngerekap progress update dari proyek kuliah kita, Auto Service — aplikasi manajemen bengkel berbasis web.

Jadi minggu ini ada update dari sisi backend dari teman aku, dan aku udah sesuaikan bagian frontendnya biar selaras. Aku bakal jelasin satu-satu apa aja yang diupdate dan tampilinnya langsung di aplikasi."

---

## 📦 BAGIAN 1: UPDATE DARI BE (0:30 – 1:30)

> *[Layar: Buka terminal / VS Code, tunjukin git log]*

**Narasi:**
"Jadi pertama-tama, ini commit terbaru dari tim backend —"

```text
feat: Add service bundling, vehicle frame number, and work order checklists with complaint logs.
feat: add tax settings and reminder crud
fix: include customer phone and vehicle details in transaction list
```

**Narasi lanjut:**
"Jadi total ada 5 update besar dari tim backend minggu ini:

**Pertama & Kedua** — *Service Bundling* dan *Work Order Checklists*. Sekarang kita bisa pilih Paket Service di awal, yang otomatis jadi checklist tugas buat mekanik.

**Ketiga** — *Informasi Kendaraan yang Lebih Detail*. Sekarang di database kendaraan ada 'Nomor Rangka' (VIN). Plus, di semua riwayat transaksi, data Merek dan Model mobil juga udah disertakan, jadi gak cuma plat nomor doang.

**Keempat & Kelima** — *Pajak (Tax Settings)* dan *Reminder CRUD*. Sekarang sistem sudah dukung pengaturan persentase PPN yang fleksibel dan fitur pengingat servis otomatis."

### 🛠️ Technical Command (Munculkan Data BE)
```bash
# Pastikan seeder sudah jalan agar Paket Service & Data Dummy muncul
cd be && npm run seed

# Cek log commit terakhir untuk demo
git log --oneline -5
```

---

## 💻 BAGIAN 2: PENYESUAIAN FRONTEND (1:30 – 3:00)

> *[Layar: VS Code, tunjukin file-file yang diubah]*

**Narasi:**
"Nah dari update BE itu, aku udah beresin sinkronisasi di frontend. Ini highlight perubahannya:"

> *[Scroll di VS Code / tunjukin satu per satu]*

"**Pertama**, di bagian **Antrean**, aku tambahin Nomor Rangka di SPK dan sistem checklist interaktif.

**Kedua**, di bagian **Kasir**, aku update `TransactionFormModal.tsx`. Sekarang kasir gak perlu input pajak manual. Sistem otomatis narik data `% PPN` dari pengaturan dan ngitung `Total Bayar` secara akurat.

**Ketiga**, di **Riwayat Transaksi**, tampilan sekarang lebih informatif. Kita bisa liat Merek dan Model mobil di kolom pelanggan, jadi lebih gampang buat tracing invoice.

**Terakhir**, di **Laporan Keuangan**, label pajaknya sekarang dinamis. Kalau pak bos ubah pajak jadi 12% di setting, di laporan juga otomatis berubah keterangannya."

---

## 🖥️ DEMO LIVE — BAGIAN 3: Form Kendaraan & Antrean (3:00 – 4:30)

> *[Layar: Browser, navigasi ke Kendaraan lalu Antrean]*

**Narasi:**
"Kita liat langsung. Di form kendaraan sekarang ada field **Nomor Rangka**. Dan kalau kita masuk ke **Antrean**..."

> *[Klik Entry Antrean, pilih kendaraan]*

"Pas kita pilih **Paket Service**, checklistnya otomatis ke-generate. Kita bisa liat di **SPK**..."

> *[Buka SPK Modal, tunjukin Nomor Rangka & Checklist]*

"Lihat, Nomor Rangka muncul di header SPK, dan di bawah ada Checklist yang bisa di-centang mekanik secara realtime."

---

## 🖥️ DEMO LIVE — BAGIAN 4: Kasir & Pajak Otomatis (4:30 – 6:00)

> *[Navigasi ke halaman Kasir / Transaksi Baru]*

**Narasi:**
"Sekarang kita ke fitur yang paling ditunggu: **Pajak Otomatis**. Perhatikan pas aku tambah item..."

> *[Tambah beberapa sparepart / jasa di Kasir]*

"Di bagian ringkasan pembayaran, sekarang muncul baris **Pajak (PPN %)**. Angka ini otomatis dari Settings. Jadi kasir tinggal fokus scanning barang, hitungannya sudah pasti benar."

> *[Selesaikan transaksi, buka Riwayat]*

"Dan di **Riwayat Transaksi**, sekarang tampilannya cantik. Ada plat nomor, plus keterangan **Merek & Model** kendaraannya. Jadi laporannya lengkap banget."

---

## 📊 BAGIAN 5: Recap Progress (6:00 – 7:00)

> *[Layar: Dashboard atau slide recap]*

**Narasi:**
"Jadi recap minggu ini:
1. **Full Sinkronisasi BE-FE** untuk 5 commit terbaru.
2. **Sistem Pajak Otomatis** sudah jalan di Kasir & Laporan.
3. **Detail Kendaraan** (Nomor Rangka & Model) sudah tersebar di seluruh menu.
4. **Interactive Checklist** sudah bisa dipakai mekanik.

Semua sinkron, data tersimpan aman di Supabase, dan siap untuk digunakan operasional bengkel."

---

## 🎙️ CLOSING (7:00 – 7:20)

**Narasi:**
"Itu dia update minggu ini. Minggu depan rencananya kita mau ngerjain halaman manajemen Paket Service-nya sendiri — buat CRUD paket dari UI. 

Kalau ada pertanyaan bisa disampaikan. Makasih udah nonton!"

> *[Fade out]*

---

## 📋 CHECKLIST SEBELUM REKAM

- [ ] App FE berjalan (Port default)
- [ ] Backend BE berjalan di `localhost:3001` (Cek file `.env`)
- [ ] Sudah jalankan `npm run seed` di folder `be` (Penting biar dropdown Isi)
- [ ] Ada minimal 1 Kendaraan dengan Nomor Rangka di daftar
- [ ] Resolusi layar bersih, tab browser tidak terlalu banyak
- [ ] Matikan notifikasi HP/komputer
- [ ] Test sekali alur (Tambah Kendaraan -> Entry Antrean -> Buka SPK) sebelum record.

---

## 🎙️ CLOSING (7:00 – 7:20)

**Narasi:**
"Itu dia update minggu ini. Minggu depan rencananya kita mau ngerjain halaman manajemen Paket Service-nya sendiri — buat CRUD paket dari UI. 

Kalau ada pertanyaan bisa disampaikan. Makasih udah nonton!"

> *[Fade out]*

---

## 📋 CHECKLIST SEBELUM REKAM

- [ ] App FE berjalan (Port default)
- [ ] Backend BE berjalan di `localhost:3001` (Cek file `.env`)
- [ ] Sudah jalankan `npm run seed` di folder `be` (Penting biar dropdown Isi)
- [ ] Ada minimal 1 Kendaraan dengan Nomor Rangka di daftar
- [ ] Resolusi layar bersih, tab browser tidak terlalu banyak
- [ ] Matikan notifikasi HP/komputer
- [ ] Test sekali alur (Tambah Kendaraan -> Entry Antrean -> Buka SPK) sebelum record.

---

## ⏱️ Total Durasi Estimasi: ~7 menit
