# Scrum Sprint Plan — 10 Minggu

## AutoService Inventory Web Panel

> **Metode:** Scrum | **Durasi Sprint:** 1 Minggu | **Total Sprint:** 10
> **Tim:** 4 Orang (PM, FE Dev, BE Dev, UI/UX)
> **Laporan:** Setiap akhir sprint ke Asisten Praktikum

---

## Tim & Role

| Role       | Tugas Utama                                                  |
| ---------- | ------------------------------------------------------------ |
| **PM**     | Sprint planning, backlog, koordinasi, laporan ke asdos, ERD  |
| **FE Dev** | Semua halaman & komponen UI, mock data, integrasi API BE     |
| **BE Dev** | REST API, database schema, WA notification service, auth/JWT |
| **UI/UX**  | Wireframe, Figma design, review konsistensi visual           |

---

## Scrum Ceremonies (Setiap Minggu)

| Ceremony                 | Kapan         | Durasi   | Output                           |
| ------------------------ | ------------- | -------- | -------------------------------- |
| **Sprint Planning**      | Senin pagi    | 1-2 jam  | Sprint backlog per orang         |
| **Daily Standup**        | Setiap hari   | 15 menit | Update progress & blocker        |
| **Sprint Review**        | Jumat sore    | 1 jam    | Demo fitur ke tim                |
| **Sprint Retrospective** | Jumat sore    | 30 menit | What went well / what to improve |
| **Laporan Asdos**        | Jumat / Sabtu | -        | Dokumen laporan mingguan         |

---

## Catatan Penting (Disclaimer Internal)

> 🔒 **FE sudah selesai 100%** menggunakan mock data sejak awal sprint.
> Laporan ke asdos tetap mengikuti timeline sprint seperti biasa.
> Realisasi FE yang lebih cepat dijadikan buffer untuk membantu koordinasi BE dan integrasi API.

---

## Sprint Timeline

### 🟦 Sprint 1 — Minggu 1: Fondasi & Setup

**Goal:** Proyek bisa jalan secara lokal oleh semua anggota

| PIC    | Task                                                    | Est. | Status |
| ------ | ------------------------------------------------------- | ---- | ------ |
| PM     | Finalisasi scope, buat product backlog (Trello/Notion)  | S    | `Done` |
| UI/UX  | Buat wireframe low-fi: Dashboard, Inventory, Login      | M    | `Todo` |
| BE Dev | Setup project BE (framework, DB, ENV), buat skema DB V1 | M    | `Todo` |
| FE Dev | Setup Next.js, Tailwind, struktur folder `src/`         | S    | `Done` |
| FE Dev | Layout utama: Sidebar, Header, navigasi (role-based)    | M    | `Done` |

**Deliverable Laporan Asdos:**

- [x] Repo sudah dibuat & semua anggota bisa clone
- [x] ERD V1 sudah disetujui PM (lihat `docs/ERD_DATABASE.md`)
- [ ] Wireframe low-fi sudah jadi (UI/UX)

---

### 🟦 Sprint 2 — Minggu 2: Auth & Navigasi

**Goal:** User bisa login, role-based, navigasi sidebar berfungsi

| PIC    | Task                                                             | Est. | Status |
| ------ | ---------------------------------------------------------------- | ---- | ------ |
| BE Dev | Endpoint `POST /auth/login`, `GET /auth/me`, JWT                 | M    | `Todo` |
| BE Dev | Tabel `users`, seed data (owner, admin, kasir)                   | S    | `Todo` |
| FE Dev | Halaman Login (UI + auth logic + protected routes + route guard) | M    | `Done` |
| FE Dev | Sidebar dinamis berdasarkan role + filter nav per permission     | M    | `Done` |
| FE Dev | Permission editor (Owner atur akses Admin & Kasir)               | S    | `Done` |
| UI/UX  | High-fi: Login page + Layout utama                               | M    | `Todo` |

**Deliverable:**

- [ ] Login end-to-end (BE + FE)
- [x] FE: Login UI + sidebar dinamis + route guard sudah siap (mock auth)
- [x] FE: Permission editor Owner tersedia di Pengaturan → Manajemen Akun
- [ ] Halaman diproteksi berdasarkan role (BE auth — await JWT integrasi)

---

### 🟦 Sprint 3 — Minggu 3: Inventory — Katalog Sparepart

**Goal:** Staff bisa CRUD data sparepart & generate barcode

| PIC    | Task                                                             | Est. | Status |
| ------ | ---------------------------------------------------------------- | ---- | ------ |
| BE Dev | Endpoint CRUD `/spare-parts`                                     | L    | `Todo` |
| BE Dev | Auto-generate SKU                                                | S    | `Todo` |
| FE Dev | Halaman Daftar Sparepart — tabel + search + filter tipe/kategori | M    | `Done` |
| FE Dev | Form Tambah/Edit Sparepart (modal, support mode Edit)            | M    | `Done` |
| FE Dev | Generate & Cetak Barcode (modal label)                           | M    | `Done` |
| UI/UX  | High-fi: Halaman Inventory                                       | M    | `Todo` |

**Deliverable:**

- [x] FE: Halaman inventory selesai lengkap dengan mock data
- [ ] API CRUD berfungsi (BE)
- [x] Barcode bisa digenerate & dicetak (FE mock)

---

### 🟦 Sprint 4 — Minggu 4: Stok Masuk, Keluar & Opname

**Goal:** Workflow stok lengkap — restock, pemakaian, dan rekonsiliasi opname

| PIC    | Task                                                              | Est. | Status |
| ------ | ----------------------------------------------------------------- | ---- | ------ |
| BE Dev | `POST /stock/in`, `POST /stock/out` + update `current_stock`      | M    | `Todo` |
| BE Dev | Stok Opname: buka sesi, input fisik, tutup sesi, apply adjustment | L    | `Todo` |
| FE Dev | Form Stok Masuk (pilih item, qty, catatan)                        | M    | `Done` |
| FE Dev | Form Stok Keluar manual                                           | M    | `Done` |
| FE Dev | Halaman Stok Opname: sesi aktif, tabel input fisik, tutup sesi    | L    | `Done` |
| FE Dev | Riwayat Pergerakan Stok (tabel log)                               | M    | `Done` |

**Deliverable:**

- [x] FE: Semua halaman stok selesai (mock data)
- [ ] API stok masuk/keluar/opname (BE)

---

### 🟦 Sprint 5 — Minggu 5: Customer, Kendaraan & Antrean

**Goal:** Staff bisa data customer, kendaraan, & penerimaan kendaraan via Work Order

| PIC    | Task                                                   | Est. | Status |
| ------ | ------------------------------------------------------ | ---- | ------ |
| BE Dev | CRUD `/customers`, `/vehicles`, `/service-history`     | M    | `Todo` |
| BE Dev | CRUD `/work-orders` + `PATCH /work-orders/{id}/status` | M    | `Todo` |
| FE Dev | Halaman Daftar Customer — tabel + search + filter      | M    | `Done` |
| FE Dev | Form Tambah/Edit Customer + modal detail + hapus       | M    | `Done` |
| FE Dev | Halaman Daftar Kendaraan — tabel + ServiceBook modal   | M    | `Done` |
| FE Dev | Halaman Antrean — tabel + Kanban + form + badge Inap   | M    | `Done` |
| UI/UX  | High-fi: Customer, Kendaraan & Antrean                 | M    | `Todo` |

**Deliverable:**

- [x] FE: Customer, kendaraan, & antrean selesai (mock data)
- [ ] API customer, kendaraan & work order (BE)

---

### 🟦 Sprint 6 — Minggu 6: Transaksi & Invoice

**Goal:** Kasir bisa buat nota servis, cetak invoice, stok otomatis berkurang

| PIC    | Task                                                       | Est. | Status |
| ------ | ---------------------------------------------------------- | ---- | ------ |
| BE Dev | `POST /transactions` + otomatis kurangi stok               | L    | `Todo` |
| BE Dev | `PATCH /transactions/{id}/payment`                         | S    | `Todo` |
| BE Dev | `GET /transactions/{id}/pdf` (generate PDF nota)           | M    | `Todo` |
| BE Dev | CRUD `/service-catalog`                                    | S    | `Todo` |
| FE Dev | Kasir: tab Riwayat Transaksi + filter status bayar         | M    | `Done` |
| FE Dev | Kasir: tab Buat Nota Servis 2-step (customer+item → bayar) | L    | `Done` |
| FE Dev | Kasir: POS Cepat (katalog grid + keranjang + checkout)     | L    | `Done` |
| FE Dev | Modal Invoice (detail + tombol cetak)                      | M    | `Done` |
| UI/UX  | High-fi: Kasir & Invoice                                   | M    | `Todo` |

**Deliverable:**

- [x] FE: Kasir 3-tab selesai (mock data)
- [ ] API transaksi + PDF nota (BE)

---

### 🟦 Sprint 7 — Minggu 7: Notifikasi WhatsApp

**Goal:** Owner terima WA otomatis saat stok item di bawah minimum

| PIC    | Task                                                       | Est. | Status |
| ------ | ---------------------------------------------------------- | ---- | ------ |
| BE Dev | Integrasi WA Gateway API (Fonnte/WaBlas)                   | M    | `Todo` |
| BE Dev | Trigger otomatis cek `minimum_stock` saat stok berubah     | M    | `Todo` |
| BE Dev | Tabel `wa_notifications` + log pengiriman                  | S    | `Todo` |
| FE Dev | Pengaturan: tab WA Gateway (form nomor + token + provider) | S    | `Done` |
| FE Dev | Log Notifikasi WA (tabel status sent/failed/pending)       | S    | `Done` |
| FE Dev | Dashboard: Alert Panel stok menipis                        | S    | `Done` |

**Deliverable:**

- [x] FE: Semua UI notif WA selesai (mock data)
- [ ] WA notif terkirim end-to-end (BE integrasi)

---

### 🟦 Sprint 8 — Minggu 8: Dashboard & Laporan

**Goal:** Dashboard informatif, laporan bisa diekspor

| PIC    | Task                                                                       | Est. | Status        |
| ------ | -------------------------------------------------------------------------- | ---- | ------------- |
| BE Dev | Endpoint `/reports/revenue`, `/reports/top-products`, `/reports/low-stock` | L    | `Todo`        |
| FE Dev | Dashboard: cards statistik + grafik revenue + performa + top services      | L    | `Done`        |
| FE Dev | Laporan Keuangan (tabel omset + ringkasan keuangan)                        | M    | `Done`        |
| FE Dev | Laporan Analitik (top item terlaris + grafik)                              | M    | `Done`        |
| FE Dev | Fitur Export CSV/PDF laporan                                               | M    | `In Progress` |
| UI/UX  | High-fi: Dashboard & Laporan                                               | M    | `Todo`        |

**Deliverable:**

- [x] FE: Dashboard + laporan selesai (mock data)
- [ ] Data real dari API BE

---

### 🟦 Sprint 9 — Minggu 9: Integrasi BE–FE

**Goal:** Semua fitur MVP terhubung ke API BE yang sudah live

| PIC    | Task                                                   | Est. | Status |
| ------ | ------------------------------------------------------ | ---- | ------ |
| BE Dev | Finalisasi semua endpoint, dokumentasi Swagger/Postman | L    | `Todo` |
| FE Dev | Ganti semua mock fetch → API call (`src/lib/api.ts`)   | L    | `Todo` |
| FE Dev | Handle loading state, error handling, toast notif      | M    | `Todo` |
| FE Dev | Test integrasi setiap modul                            | M    | `Todo` |
| UI/UX  | Review konsistensi visual semua halaman                | M    | `Todo` |

**Deliverable:**

- [ ] Semua fitur P1 berjalan dengan data real dari BE
- [ ] Error handling ada di setiap form

---

### 🟦 Sprint 10 — Minggu 10: Testing, Polish & Demo

**Goal:** Sistem stabil, bug kritis 0, siap demo ke stakeholder/asdos

| PIC        | Task                                                  | Est. | Status |
| ---------- | ----------------------------------------------------- | ---- | ------ |
| PM + semua | Full regression test semua fitur MVP                  | L    | `Todo` |
| PM         | UAT bersama: simulasi skenario user nyata             | M    | `Todo` |
| FE Dev     | Fix bug, responsive check (tablet-friendly)           | M    | `Todo` |
| BE Dev     | Fix bug API, optimasi query, security check           | M    | `Todo` |
| UI/UX      | Polish UI akhir: spacing, tipografi, konsistensi ikon | S    | `Todo` |
| PM         | Dokumen final: user manual, flow diagram              | M    | `Todo` |
| PM         | Persiapan & rehearsal demo ke asdos/klien             | M    | `Todo` |

**Deliverable:**

- [ ] Semua fitur MVP P1 berfungsi tanpa bug kritis
- [ ] Demo ready & terdokumentasi

---

## Story Point Reference

| Label | Estimasi Waktu           |
| ----- | ------------------------ |
| `XS`  | < 2 jam                  |
| `S`   | 2–4 jam                  |
| `M`   | 4–8 jam (1 hari)         |
| `L`   | 1–2 hari                 |
| `XL`  | > 2 hari (perlu dipecah) |

---

## Template Laporan Mingguan ke Asdos

```markdown
# Laporan Sprint [N] — Minggu ke-[N]

**Tanggal:** [tanggal]
**Tim:** [nama tim] | 4 orang (PM, FE, BE, UI/UX)

## ✅ Yang Selesai Sprint Ini

- [Fitur/task yang selesai]

## 🚧 Yang Masih Dalam Proses

- [Task yang belum selesai + alasan]

## ❌ Hambatan (Blockers)

- [Masalah yang dihadapi & solusi yang direncanakan]

## 🎯 Target Sprint Berikutnya

- [Rencana minggu depan]

## 📊 Progress

- Fitur MVP (FE) selesai: [X] / 20
- Fitur MVP (BE) selesai: [X] / 20
- Bug open: [N]
```
