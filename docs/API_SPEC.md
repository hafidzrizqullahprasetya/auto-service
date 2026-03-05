# API Specification — AutoService Inventory Web Panel

> **Base URL:** `https://api.autoservice.local/api/v1` > **Auth:** Bearer Token (JWT) di header `Authorization: Bearer <token>` > **Format:** JSON (`Content-Type: application/json`)
> **Last Updated:** 2026-03-03

---

## Response Envelope (Standard)

Semua response menggunakan format standar:

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "OK",
  "meta": { "page": 1, "total": 100, "per_page": 20 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field name is required",
    "details": { "name": ["required"] }
  }
}
```

---

## 1. Authentication

### `POST /auth/login`

Login user, dapatkan token.

```json
// Request
{ "username": "admin", "password": "secret" }

// Response 200
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "expires_in": 86400,
    "user": { "id": 1, "name": "Larasati", "role": "admin" }
  }
}
```

### `POST /auth/logout`

Invalidate token (gunakan token di header).

### `GET /auth/me`

Ambil data user yang sedang login.

---

## 2. Users (Owner & Admin Only)

| Method | Endpoint      | Deskripsi                      |
| ------ | ------------- | ------------------------------ |
| GET    | `/users`      | List semua user                |
| POST   | `/users`      | Buat user baru                 |
| GET    | `/users/{id}` | Detail user                    |
| PUT    | `/users/{id}` | Update user                    |
| DELETE | `/users/{id}` | Nonaktifkan user (soft delete) |

```json
// POST /users — Request Body
{
  "name": "Budi Kasir",
  "username": "budi.kasir",
  "password": "password123",
  "role": "kasir"
}
// Catatan: role 'owner' tidak dapat dibuat via API. Hanya 'admin' dan 'kasir'.


// Admin hanya dapat membuat akun 'kasir'. Owner dapat membuat 'admin' dan 'kasir'.
```

---

## 3. Customers

| Method | Endpoint                  | Deskripsi                 |
| ------ | ------------------------- | ------------------------- |
| GET    | `/customers`              | List customer (paginated) |
| POST   | `/customers`              | Tambah customer baru      |
| GET    | `/customers/{id}`         | Detail + daftar kendaraan |
| PUT    | `/customers/{id}`         | Update data customer      |
| DELETE | `/customers/{id}`         | Soft delete customer      |
| GET    | `/customers/{id}/history` | Riwayat servis customer   |

```json
// POST /customers — Request Body
{
  "name": "Andi Susanto",
  "phone": "081234567890",
  "email": "andi@email.com",
  "address": "Jl. Merdeka No. 10"
}

// GET /customers/{id}/history — Response data
{
  "customer": { "id": 1, "name": "Andi Susanto" },
  "transactions": [
    {
      "invoice_number": "INV-20260302-001",
      "vehicle": { "plate": "B 1234 XY", "type": "mobil" },
      "total_amount": 350000,
      "payment_status": "lunas",
      "transaction_date": "2026-03-01"
    }
  ]
}
```

---

## 4. Vehicles

| Method | Endpoint                   | Deskripsi                     |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/customers/{id}/vehicles` | List kendaraan milik customer |
| POST   | `/customers/{id}/vehicles` | Tambah kendaraan              |
| PUT    | `/vehicles/{id}`           | Update data kendaraan         |

```json
// POST /customers/{id}/vehicles — Request Body
{
  "plate_number": "B 1234 XY",
  "type": "mobil",
  "brand": "Toyota",
  "model": "Avanza",
  "year": 2020
}
```

---

## 5. Categories

| Method | Endpoint           | Deskripsi           |
| ------ | ------------------ | ------------------- |
| GET    | `/categories`      | List semua kategori |
| POST   | `/categories`      | Buat kategori baru  |
| PUT    | `/categories/{id}` | Update kategori     |
| DELETE | `/categories/{id}` | Hapus kategori      |

---

## 6. Spare Parts (Inventory)

| Method | Endpoint                          | Deskripsi                                     |
| ------ | --------------------------------- | --------------------------------------------- |
| GET    | `/spare-parts`                    | List semua item (filter: category, low_stock) |
| POST   | `/spare-parts`                    | Tambah item baru (SKU auto-gen)               |
| GET    | `/spare-parts/{id}`               | Detail item + riwayat stok                    |
| PUT    | `/spare-parts/{id}`               | Update item                                   |
| DELETE | `/spare-parts/{id}`               | Soft delete item                              |
| GET    | `/spare-parts/{id}/barcode`       | Ambil barcode image (PNG/SVG)                 |
| POST   | `/spare-parts/{id}/barcode/print` | Generate PDF barcode untuk cetak              |

```json
// POST /spare-parts — Request Body
{
  "category_id": 1,
  "name": "Oli Mesin 1L",
  "cost_price": 45000,
  "sell_price": 65000,
  "current_stock": 20,
  "minimum_stock": 5,
  "unit": "liter"
}

// Response — SKU dan barcode_value di-generate oleh BE
{
  "success": true,
  "data": {
    "id": 42,
    "sku": "AS-MOB-0042",
    "barcode_value": "AS-MOB-0042",
    "barcode_image_url": "/storage/barcodes/AS-MOB-0042.png",
    ...
  }
}

// GET /spare-parts?low_stock=true — List barang hampir habis
// GET /spare-parts?category_id=1&search=oli
```

---

## 7. Stock Movements

| Method | Endpoint           | Deskripsi                  |
| ------ | ------------------ | -------------------------- |
| GET    | `/stock-movements` | Log semua pergerakan stok  |
| POST   | `/stock/in`        | Catat stok masuk (restock) |
| POST   | `/stock/out`       | Catat stok keluar manual   |

```json
// POST /stock/in — Request Body
{
  "spare_part_id": 42,
  "quantity": 10,
  "note": "Restock dari Supplier ABC"
}

// POST /stock/out — Request Body
{
  "spare_part_id": 42,
  "quantity": 2,
  "note": "Dipakai untuk servis B 1234 XY"
}

// Response: stok terbaru + log movement
```

---

## 8. Stock Opname

| Method | Endpoint                        | Deskripsi                          |
| ------ | ------------------------------- | ---------------------------------- |
| GET    | `/opnames`                      | List semua sesi opname             |
| POST   | `/opnames`                      | Mulai sesi opname baru             |
| GET    | `/opnames/{id}`                 | Detail sesi + semua item           |
| POST   | `/opnames/{id}/items`           | Input hitungan fisik per item      |
| PUT    | `/opnames/{id}/items/{item_id}` | Update hitungan fisik              |
| POST   | `/opnames/{id}/close`           | Tutup sesi & apply adjustment stok |

```json
// POST /opnames — Request Body
{ "session_name": "Opname Februari 2026" }

// POST /opnames/{id}/items — Saat input hitungan fisik
{
  "spare_part_id": 42,
  "physical_count": 18
}

// POST /opnames/{id}/close — Menutup sesi
// BE otomatis buat stock_movements dengan type 'opname_adjustment' untuk semua item yang ada selisih
```

---

## 9. Transactions

| Method | Endpoint                     | Deskripsi                             |
| ------ | ---------------------------- | ------------------------------------- |
| GET    | `/transactions`              | List transaksi (filter: date, status) |
| POST   | `/transactions`              | Buat nota/invoice baru                |
| GET    | `/transactions/{id}`         | Detail transaksi + semua item         |
| PATCH  | `/transactions/{id}/payment` | Update status & jumlah bayar          |
| GET    | `/transactions/{id}/pdf`     | Generate PDF nota                     |

```json
// POST /transactions — Request Body
{
  "customer_id": 1,
  "vehicle_id": 1,
  "transaction_date": "2026-03-02",
  "payment_method": "cash",
  "notes": "Ganti oli + tune up",
  "items": [
    {
      "item_type": "spare_part",
      "spare_part_id": 42,
      "item_name": "Oli Mesin 1L",
      "quantity": 1,
      "unit_price": 65000
    },
    {
      "item_type": "jasa",
      "item_name": "Jasa Tune Up",
      "quantity": 1,
      "unit_price": 150000
    }
  ]
}
// BE otomatis: kurangi stok spare_part, hitung total, generate invoice_number

// PATCH /transactions/{id}/payment
{
  "paid_amount": 215000,
  "payment_status": "lunas"
}
```

---

## 10. Reports

| Method | Endpoint                | Deskripsi                                                |
| ------ | ----------------------- | -------------------------------------------------------- |
| GET    | `/reports/revenue`      | Laporan omset (query: period=daily/monthly&date=2026-03) |
| GET    | `/reports/top-products` | Top sparepart terlaris                                   |
| GET    | `/reports/low-stock`    | Daftar barang stok menipis                               |
| GET    | `/reports/opname/{id}`  | Rekap hasil opname tertentu                              |

```json
// GET /reports/revenue?period=monthly&date=2026-03
{
  "period": "2026-03",
  "total_revenue": 12500000,
  "total_transactions": 48,
  "gross_profit": 4200000,
  "daily_breakdown": [
    { "date": "2026-03-01", "revenue": 850000 },
    ...
  ]
}
```

---

## 11. WA Notifications (WhatsApp Web.js)

> **Implementasi:** whatsapp-web.js — terhubung langsung ke WA tanpa gateway pihak ketiga. **Local only** (dijalankan di local bersama server BE via `npm run dev`).

### Log & Status

| Method | Endpoint                      | Deskripsi                                         |
| ------ | ----------------------------- | ------------------------------------------------- |
| GET    | `/notifications/wa`           | Log semua notifikasi WA (paginated, filter status) |
| GET    | `/notifications/wa/status`    | Status koneksi WA client saat ini                 |
| GET    | `/notifications/wa/qr`        | Ambil QR code (base64 data URL) untuk di-scan     |
| POST   | `/notifications/wa/restart`   | Restart WA client (scan QR baru)                  |
| POST   | `/notifications/wa/test`      | Kirim pesan WA test ke nomor `wa_target_number`   |
| POST   | `/notifications/wa/retry/:id` | Retry kirim notifikasi yang gagal (status failed)  |

```json
// GET /notifications/wa/status — Response
{
  "success": true,
  "data": {
    "status": "ready",
    "qr_expires_at": null
  }
}
// status: "initializing" | "qr_ready" | "authenticated" | "ready" | "disconnected"

// GET /notifications/wa/qr — Response saat QR tersedia
{
  "success": true,
  "data": {
    "status": "qr_ready",
    "qr": "data:image/png;base64,..."
  },
  "message": "QR tersedia, silakan scan dengan WhatsApp."
}

// POST /notifications/wa/retry/:id — Response
{
  "success": true,
  "data": { "id": 5, "status": "sent", "sent_at": "2026-03-04T..." },
  "message": "Notifikasi berhasil dikirim ulang"
}
```

---

## 12. Settings

| Method | Endpoint    | Deskripsi                          |
| ------ | ----------- | ---------------------------------- |
| GET    | `/settings` | Ambil profil bengkel & konfigurasi |
| PUT    | `/settings` | Update profil + WA config          |

```json
// PUT /settings — Request Body
{
  "name": "Bengkel AutoService",
  "address": "Jl. Raya Bandung No. 99",
  "phone": "022-123456",
  "wa_gateway_token": "token_fonntes_atau_wablas",
  "wa_target_number": "6281234567890"
}
```

---

## 13. Work Orders (Antrean Servis)

| Method | Endpoint                     | Deskripsi                                       |
| ------ | ---------------------------- | ----------------------------------------------- |
| GET    | `/work-orders`               | List semua work order (filter: status, date)    |
| POST   | `/work-orders`               | Buat work order baru saat kendaraan masuk       |
| GET    | `/work-orders/{id}`          | Detail work order                               |
| PUT    | `/work-orders/{id}`          | Update data work order (keluhan, estimasi, dll) |
| PATCH  | `/work-orders/{id}/status`   | Update status pengerjaan                        |
| PATCH  | `/work-orders/{id}/mechanic` | Tugaskan mekanik                                |
| DELETE | `/work-orders/{id}`          | Hapus work order                                |

```json
// POST /work-orders — Request Body
{
  "customer_id": 1,
  "vehicle_id": 1,
  "layanan": "Service Rutin 10.000km",
  "keluhan": "Rem berdecit, AC kurang dingin",
  "estimasi_biaya": 850000,
  "estimasi_selesai": "3 jam",
  "menginap": true
}

// PATCH /work-orders/{id}/status — Request Body
{ "status": "dikerjakan" }
// status: "menunggu" | "dikerjakan" | "menunggu_sparepart" | "selesai"

// PATCH /work-orders/{id}/mechanic — Request Body
{ "mekanik": "Suryo Atmojo" }
```

---

## 14. Service Catalog (Katalog Jasa)

| Method | Endpoint                       | Deskripsi                                          |
| ------ | ------------------------------ | -------------------------------------------------- |
| GET    | `/service-catalog`             | List semua jasa (filter: berlaku_untuk, is_active) |
| POST   | `/service-catalog`             | Tambah jasa baru                                   |
| PUT    | `/service-catalog/{id}`        | Update jasa                                        |
| PATCH  | `/service-catalog/{id}/toggle` | Aktifkan / nonaktifkan jasa                        |
| DELETE | `/service-catalog/{id}`        | Hapus jasa                                         |

```json
// POST /service-catalog — Request Body
{
  "name": "Ganti Oli & Filter",
  "description": "Penggantian oli mesin dan filter oli",
  "kategori": "Mesin",
  "standard_price": 50000,
  "durasi_estimasi": "30-45 menit",
  "berlaku_untuk": "keduanya",
  "garansi": "1 bulan / 1.000 km"
}
```

---

## Error Codes

| Code                  | HTTP Status | Keterangan                             |
| --------------------- | ----------- | -------------------------------------- |
| `UNAUTHORIZED`        | 401         | Token tidak valid atau expired         |
| `FORBIDDEN`           | 403         | User tidak punya akses ke resource ini |
| `NOT_FOUND`           | 404         | Resource tidak ditemukan               |
| `VALIDATION_ERROR`    | 422         | Data input tidak valid                 |
| `STOCK_INSUFFICIENT`  | 422         | Stok tidak cukup untuk dikurangi       |
| `OPNAME_ALREADY_OPEN` | 409         | Ada sesi opname yang masih terbuka     |
| `SERVER_ERROR`        | 500         | Kesalahan internal server              |
