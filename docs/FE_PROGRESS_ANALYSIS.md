# FE Progress Analysis — AutoService Inventory Web Panel

> **Tanggal Analisis:** 2026-03-02
> **Analisis oleh:** FE Dev
> **Tujuan:** Pemetaan apa yang sudah selesai, apa yang masih kurang, dan urutan penyelesaian FE secara mandiri.

---

## Ringkasan Cepat

| Modul | Komponen | Mock Data | Halaman (Route) | Status |
|-------|----------|-----------|-----------------|--------|
| Dashboard | ✅ Lengkap (6 komponen) | ✅ Ada | ✅ Ada | **~85% Done** |
| Inventory | ✅ Table + Form + Summary | ✅ Ada | ✅ Ada | **~70% Done** |
| Antrean | ✅ Table + Kanban + Form | ✅ Ada | ✅ Ada | **~75% Done** |
| Pelanggan | ✅ Table + Detail + Form + Delete | ✅ Ada | ✅ Ada | **~80% Done** |
| Kendaraan | ✅ Table + Form | ✅ Ada | ✅ Ada | **~70% Done** |
| Kasir/Transaksi | ✅ Table + Invoice + Katalog | ✅ Ada | ✅ Ada | **~65% Done** |
| Karyawan | ✅ Table + Form | ✅ Ada | ✅ Ada | **~70% Done** |
| Laporan | ✅ Analitik + Keuangan | ⚠️ Sebagian | ✅ Ada | **~60% Done** |
| Pengaturan | ✅ Form lengkap | ⚠️ Minimal | ✅ Ada | **~75% Done** |
| POS | ⚠️ Components partial (Cart, Item, Summary) | ❌ Belum | ❌ Belum | **~30% Done** |
| **Stok Opname** | ❌ Belum ada | ❌ Belum | ❌ Belum | **0% — Harus Dibuat** |
| **WA Notif** | ❌ Belum ada | ❌ Belum | ❌ Belum | **0% — Harus Dibuat** |

---

## Detail: Yang Sudah Ada

### ✅ `src/components/Bengkel/Dashboard/`
| File | Isi |
|------|-----|
| `StatCard.tsx` | Card statistik (Total omset, kendaraan masuk, dll) |
| `RevenueAnalysis.tsx` | Grafik pendapatan (pakai timeframe) |
| `WeeklyPerformance.tsx` | Grafik performa mingguan |
| `VehicleTypeRatio.tsx` | Pie/donut chart rasio Mobil/Motor |
| `TopServices.tsx` | Tabel top jasa paling diminati |
| `RecentActivity.tsx` | Log aktivitas terbaru |
| `WorkshopSettings.tsx` | Component settings bengkel |

**Gap:** Alert panel stok menipis belum ada di dashboard. Perlu tambah `LowStockAlert.tsx`.

---

### ✅ `src/components/Bengkel/Inventori/`
| File | Isi |
|------|-----|
| `InventoryTable.tsx` | Tabel data + search + barcode button + action (edit/hapus UI only) |
| `InventorySummary.tsx` | Summary card (total item, low stock, dll) |
| `InventoryFormModal.tsx` | Form tambah/edit item baru |

**Gap yang perlu diisi:**
- [ ] Form **Edit** belum terhubung (tombol Edit di tabel belum trigger modal dengan data)
- [ ] Mock data `inventory.ts` belum punya field `cost_price`, `minimum_stock`, `unit` — perlu diupdate agar sesuai schema BE
- [ ] Halaman belum ada tab atau section **Stok Masuk / Stok Keluar** 
- [ ] **Stok Opname** = halaman baru dari nol
- [ ] Filter by `type` (Mobil/Motor/Umum) dan `category` belum ada

---

### ✅ `src/components/Bengkel/Antrean/`
| File | Isi |
|------|-----|
| `AntreanTable.tsx` | Tabel daftar antrean + filter |
| `AntreanRow.tsx` | Satu baris antrean |
| `AntreanFormModal.tsx` | Form tambah antrean baru |
| `KanbanBoard.tsx` | Board Kanban 4 kolom status (Scoped sebagai view alternatif) |

**Status:** Hampir lengkap untuk MVP. Gap:
- [ ] Update status antrean belum bisa dilakukan inline (UI only)
- [ ] Penugasan mekanik di form belum linked ke mock employees

---

### ✅ `src/components/Bengkel/Pelanggan/`
| File | Isi |
|------|-----|
| `CustomerTable.tsx` | Tabel customer + search |
| `CustomerFormModal.tsx` | Form tambah/edit customer |
| `CustomerDetailModal.tsx` | Detail customer + riwayat servis |
| `DeleteConfirmModal.tsx` | Konfirmasi hapus |

**Status:** Paling lengkap dari semua modul. Gap:
- [ ] `CustomerDetailModal` perlu terhubung ke `service-history.ts` mock data yang sudah ada

---

### ✅ `src/components/Bengkel/Kendaraan/`
| File | Isi |
|------|-----|
| `VehicleTable.tsx` | Tabel kendaraan + search + filter tipe |
| `VehicleFormModal.tsx` | Form tambah/edit kendaraan |

**Gap:**
- [ ] Halaman detail kendaraan (buku servis digital) belum ada. `ServiceBookModal.tsx` sudah ada di `shared/` — tinggal dihubungkan

---

### ✅ `src/components/Bengkel/Kasir/`
| File | Isi |
|------|-----|
| `TransactionTable.tsx` | Tabel riwayat transaksi |
| `InvoiceModal.tsx` | Modal detail invoice (tampil + opsi cetak) |
| `FinancialSummary.tsx` | Ringkasan keuangan harian |
| `KatalogJasa.tsx` | Daftar katalog jasa + harga |

**Gap:**
- [ ] Form **Buat Transaksi Baru** belum ada — ini fitur penting untuk MVP
- [ ] POS components (`CartItem`, `ItemCard`, `OrderSummary`) ada di folder `POS/` tapi belum terakit jadi satu halaman

---

### ✅ `src/components/Bengkel/Karyawan/`
| File | Isi |
|------|-----|
| `EmployeeTable.tsx` | Tabel karyawan + status |
| `EmployeeFormModal.tsx` | Form tambah/edit karyawan |

**Status:** Cukup untuk MVP. Gap minor: filter by status (Aktif/Cuti/Off).

---

### ✅ `src/components/Bengkel/Laporan/`
| File | Isi |
|------|-----|
| `LaporanKeuangan.tsx` | Laporan keuangan lengkap (10KB — paling besar) |
| `LaporanAnalitik.tsx` | Analitik (terlaris, grafik, dll) |

**Gap:**
- [ ] Export CSV/PDF belum ada (button mungkin ada tapi logic belum)
- [ ] Laporan Stok Opname belum ada

---

### ✅ `src/components/Bengkel/Pengaturan/`
| File | Isi |
|------|-----|
| `PengaturanBengkel.tsx` | Form lengkap pengaturan bengkel (12KB — sangat lengkap) |

**Gap:**
- [ ] Belum ada section **Konfigurasi WA Gateway** (nomor + token)
- [ ] Manajemen User & Role belum ada

---

### ⚠️ `src/components/Bengkel/POS/`
3 komponen partial: `CartItem`, `ItemCard`, `OrderSummary`  
**Belum ada halaman/route-nya** → perlu dirakit jadi halaman POS penuh

---

### ✅ `src/components/Bengkel/shared/`
Shared components yang sudah ada dan bisa dipakai ulang:
- `Badge.tsx` — label status warna-warni
- `ActionButton.tsx` — tombol aksi (primary/danger/outline)
- `BaseModal.tsx` — modal wrapper dengan overlay
- `TableToolbar.tsx` — header tabel + search + tombol primary
- `BarcodeLabelModal.tsx` — modal generate & cetak barcode ✅
- `ServiceBookModal.tsx` — modal buku servis (perlu dihubungkan)
- `ServiceHistoryModal.tsx` — modal riwayat servis
- `PlaceholderPage.tsx` — halaman placeholder
- `ReminderTable.tsx` — tabel reminder stok
- `PurchaseOrderTable.tsx` — tabel purchase order

---

### ✅ `src/mock/`
| File | Status | Catatan |
|------|--------|---------|
| `inventory.ts` | ✅ Ada | Perlu tambah field `cost_price`, `minimum_stock` |
| `customers.ts` | ✅ Ada | Lengkap |
| `vehicles.ts` | ✅ Ada | Ada `serviceHistory` juga |
| `transactions.ts` | ✅ Ada | Lengkap |
| `antrean.ts` | ✅ Ada | Lengkap |
| `employees.ts` | ✅ Ada | Lengkap |
| `service-catalog.ts` | ✅ Ada | Daftar jasa |
| `service-history.ts` | ✅ Ada | Histori servis per kendaraan |
| `dashboard-charts.ts` | ✅ Ada | Data grafik dashboard |
| `dashboard-fetcher.ts` | ✅ Ada | Fetcher simulated |

---

## Yang Harus Dibuat dari Nol (GAP KRITIS)

### 1. 🔴 Halaman Stok Opname (Inventory Reconciliation)
Fitur inti tapi belum ada sama sekali.

**Yang dibutuhkan:**
- `src/mock/opname.ts` — tipe `StockOpname` dan `StockOpnameItem`
- `src/components/Bengkel/Inventori/OpnameForm.tsx` — form input fisik per item
- `src/components/Bengkel/Inventori/OpnameHistory.tsx` — riwayat sesi opname
- `src/app/(dashboard)/bengkel/inventori/opname/page.tsx` — route halaman

---

### 2. 🔴 Form Buat Transaksi Baru (POS / Kasir)
Belum ada form untuk membuat nota servis baru dari kasir.

**Yang dibutuhkan:**
- `src/components/Bengkel/Kasir/CreateTransactionForm.tsx` — form lengkap: pilih customer, tambah item (sparepart/jasa via scan/search), hitung total, set metode bayar
- Rakit POS components (`CartItem`, `ItemCard`, `OrderSummary`) jadi 1 form

---

### 3. 🔴 Stok Masuk & Stok Keluar Form
Belum ada form/UI untuk mencatat pergerakan stok.

**Yang dibutuhkan:**
- `src/components/Bengkel/Inventori/StockMovementForm.tsx`
- Tab di halaman Inventori: "Stok Masuk" | "Stok Keluar" | "Riwayat"
- `src/mock/stock-movements.ts`

---

### 4. 🟡 Halaman WA Notifikasi & Konfigurasi
Belum ada UI untuk lihat log notif dan atur WA gateway.

**Yang dibutuhkan:**
- Section baru di `PengaturanBengkel.tsx`: form input `wa_number` + `wa_token`
- `src/components/Bengkel/shared/NotifLogTable.tsx` — log notifikasi WA
- `src/mock/wa-notifications.ts`

---

### 5. 🟡 Alert Low Stock di Dashboard
Card/panel yang menampilkan daftar barang stok menipis.

**Yang dibutuhkan:**
- `src/components/Bengkel/Dashboard/LowStockAlert.tsx`
- Filter `MOCK_ITEMS` di mana `stock <= minimum_stock`

---

### 6. 🟡 Halaman Detail Kendaraan (Buku Servis Digital)
`ServiceBookModal.tsx` sudah ada, tinggal hubungkan ke halaman kendaraan.

---

## Estimasi Penyelesaian FE (Realistis)

| Prioritas | Gap Item | Estimasi |
|-----------|----------|----------|
| 🔴 P1 | Edit Item Inventory (hubungkan modal) | 2 jam |
| 🔴 P1 | Update mock `inventory.ts` (tambah field baru) | 1 jam |
| 🔴 P1 | Tab Stok Masuk / Keluar + mock data | 4 jam |
| 🔴 P1 | Halaman Stok Opname (dari nol) | 1 hari |
| 🔴 P1 | Form Buat Transaksi Baru (Kasir) | 1 hari |
| 🟡 P2 | Low Stock Alert di Dashboard | 2 jam |
| 🟡 P2 | Konfigurasi WA di Pengaturan | 2 jam |
| 🟡 P2 | Log Notifikasi WA + mock | 3 jam |
| 🟡 P2 | Halaman Detail Kendaraan | 2 jam |
| 🟢 P3 | Export CSV/PDF laporan | 3 jam |
| 🟢 P3 | Manajemen User & Role di Settings | 3 jam |
| 🟢 P3 | POS halaman penuh | 4 jam |

**Total estimasi gap: ~3–4 hari kerja penuh**

---

## Urutan Pengerjaan yang Disarankan

```
Hari 1:
├── Update mock inventory.ts (tambah cost_price, minimum_stock, unit)
├── Fix: Edit Item (hubungkan InventoryFormModal ke data yang dipilih)
└── Tambah: Tab Stok Masuk + Stok Keluar di halaman Inventori

Hari 2:
└── Buat: Halaman Stok Opname (mock + komponen + route)

Hari 3:
├── Buat: Form Buat Transaksi Baru (CreateTransactionForm)
└── Rakit: POS halaman (gabungkan CartItem, ItemCard, OrderSummary + CreateTransactionForm)

Hari 4:
├── Tambah: Low Stock Alert di Dashboard
├── Tambah: Konfigurasi WA di Pengaturan + Log Notif
└── Hubungkan: ServiceBookModal ke halaman Kendaraan

Selesai → Siap Handoff ke BE
```
