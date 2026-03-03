# FE Progress Analysis — AutoService Inventory Web Panel

> **Tanggal Analisis:** 2026-03-03
> **Analisis oleh:** FE Dev
> **Tujuan:** Pemetaan status terkini seluruh modul FE — semua gap sprint sebelumnya telah diselesaikan.

---

## Ringkasan Cepat

| Modul | Komponen | Mock Data | Halaman (Route) | Status |
|-------|----------|-----------|-----------------|--------|
| Dashboard | ✅ Lengkap | ✅ Ada | ✅ Ada | **100% Done** |
| Inventory (+ Stok Masuk/Keluar) | ✅ Table + Form + Summary + Movement | ✅ Ada | ✅ Ada | **100% Done** |
| Stok Opname | ✅ OpnameForm + OpnameHistory | ✅ Ada | ✅ Ada | **100% Done** |
| Antrean | ✅ Table + Kanban + Form + SPK | ✅ Ada | ✅ Ada | **100% Done** |
| Pelanggan | ✅ Table + Detail + Form + Delete | ✅ Ada | ✅ Ada | **100% Done** |
| Kendaraan | ✅ Table + Form + ServiceBook | ✅ Ada | ✅ Ada | **100% Done** |
| Kasir/Transaksi | ✅ Table + Invoice + Katalog + POS | ✅ Ada | ✅ Ada | **100% Done** |
| POS | ✅ CartItem + ItemCard + OrderSummary + Halaman | ✅ Ada | ✅ Ada | **100% Done** |
| Karyawan | ✅ Table + Form | ✅ Ada | ✅ Ada | **100% Done** |
| Laporan | ✅ Analitik + Keuangan | ✅ Ada | ✅ Ada | **~90% Done** |
| Pengaturan (+ WA + Akun + Role) | ✅ Form + WA Gateway + ManajemenAkun + PermissionEditor | ✅ Ada | ✅ Ada | **100% Done** |
| WA Notifikasi | ✅ NotifLogTable + Konfigurasi | ✅ Ada | ✅ Ada | **100% Done** |
| Auth / RBAC | ✅ Login + Route Guard + Sidebar Filter + PermissionEditor | ✅ Ada | ✅ Ada | **100% Done** |
| Profile | ✅ 3 persona (Owner/Admin/Kasir) | ✅ Ada | ✅ Ada | **100% Done** |
| **Excel Bulk Import/Export** | ✅ ExcelButtons + ImportPreviewModal | ✅ Ada | ✅ Semua tabel | **100% Done** |

---

## Detail: Yang Sudah Ada

### ✅ Auth & RBAC (`src/lib/permissions.ts`, `src/hooks/useAuth.ts`)
- 3 role: Owner, Admin, Kasir dengan default permission matrix
- Route guard di DashboardLayout — redirect ke `ROLE_HOME` saat akses ditolak
- Sidebar filter: modul tidak boleh diakses = tidak tampil
- PermissionEditor (Owner only): toggle akses Admin/Kasir per route
- `ALWAYS_ALLOWED = ["/profile"]` — semua role bisa akses halaman profil
- Kasir: login langsung ke `/bengkel/antrean`

### ✅ `src/components/Bengkel/Dashboard/`
| File | Isi |
|------|-----|
| `StatCard.tsx` | Card statistik (Omset, kendaraan masuk, dll) |
| `RevenueAnalysis.tsx` | Grafik pendapatan dengan timeframe picker |
| `WeeklyPerformance.tsx` | Grafik performa mingguan |
| `VehicleTypeRatio.tsx` | Pie/donut chart rasio Mobil/Motor |
| `TopServices.tsx` | Tabel top jasa terlaris |
| `RecentActivity.tsx` | Log aktivitas terbaru |

### ✅ `src/components/Bengkel/Inventori/`
| File | Isi |
|------|-----|
| `InventoryTable.tsx` | Tabel item + filter tipe/kategori + tombol Excel |
| `InventorySummary.tsx` | Summary card (total item, low stock, nilai stok) |
| `InventoryFormModal.tsx` | Form tambah/edit item |
| `StockMovementForm.tsx` | Form stok masuk & keluar |
| `StockMovementPage.tsx` | Halaman pergerakan stok |
| `StockOpnamePage.tsx` | Halaman opname fisik + riwayat |

### ✅ `src/components/Bengkel/Antrean/`
| File | Isi |
|------|-----|
| `AntreanTable.tsx` | Tabel daftar antrean + tombol Excel |
| `AntreanFormModal.tsx` | Form tambah/edit antrean |
| `KanbanBoard.tsx` | Board kanban 4 kolom status |
| `SPKModal.tsx` | Surat Perintah Kerja (cetak) |

### ✅ `src/components/Bengkel/Pelanggan/`
| File | Isi |
|------|-----|
| `CustomerTable.tsx` | Tabel customer + tombol Excel |
| `CustomerFormModal.tsx` | Form tambah/edit |
| `CustomerDetailModal.tsx` | Detail + riwayat servis |
| `DeleteConfirmModal.tsx` | Konfirmasi hapus |

### ✅ `src/components/Bengkel/Kendaraan/`
| File | Isi |
|------|-----|
| `VehicleTable.tsx` | Tabel kendaraan + tombol Excel |
| `VehicleFormModal.tsx` | Form registrasi/edit kendaraan |

### ✅ `src/components/Bengkel/Kasir/` + `POS/`
| File | Isi |
|------|-----|
| `TransactionTable.tsx` | Tabel riwayat transaksi |
| `InvoiceModal.tsx` | Modal detail invoice |
| `FinancialSummary.tsx` | Ringkasan keuangan harian |
| `KatalogJasa.tsx` | Katalog jasa + harga |
| POS: `CartItem`, `ItemCard`, `OrderSummary` | Komponen POS lengkap |

### ✅ `src/components/Bengkel/Karyawan/`
| File | Isi |
|------|-----|
| `EmployeeTable.tsx` | Tabel karyawan + tombol Excel |
| `EmployeeFormModal.tsx` | Form tambah/edit karyawan |

### ✅ `src/components/Bengkel/Laporan/`
| File | Isi |
|------|-----|
| `LaporanKeuangan.tsx` | Laporan keuangan lengkap |
| `LaporanAnalitik.tsx` | Analitik: terlaris, grafik, dll |

**Gap tersisa:** Export CSV/PDF (in progress)

### ✅ `src/components/Bengkel/Pengaturan/`
- `PengaturanBengkel.tsx`: form info bengkel, WA gateway, jam operasional
- `ManajemenAkunTab`: daftar user + trigger PermissionEditor
- `PermissionEditor`: toggle hak akses per route untuk Admin/Kasir

### ✅ `src/components/Bengkel/shared/ExcelButtons.tsx` — BARU
| Komponen | Fungsi |
|----------|--------|
| `ExcelButtons` | 3 tombol: Download Template, Import, Export |
| `ImportPreviewModal` | Preview + konfirmasi sebelum data diimport |

**Dipasang di:** InventoryTable, CustomerTable, EmployeeTable, VehicleTable, AntreanTable

### ✅ `src/lib/excel.ts` — BARU
| Fungsi | Keterangan |
|--------|------------|
| `downloadTemplate(moduleKey)` | Generate file `.xlsx` template kosong + 2 baris contoh |
| `exportToExcel(moduleKey, rows)` | Export data tabel aktif ke `.xlsx` |
| `parseExcelImport(file)` | Parse file `.xlsx/.xls` → array of objects |
| `inventoriToExcelRows()` | Converter Item[] → InventoriExcelRow[] |
| `pelangganToExcelRows()` | Converter Customer[] → PelangganExcelRow[] |
| `kendaraanToExcelRows()` | Converter Vehicle[] → KendaraanExcelRow[] |
| `karyawanToExcelRows()` | Converter Employee[] → KaryawanExcelRow[] |
| `antreanToExcelRows()` | Converter Antrean[] → AntreanExcelRow[] |

---

## Satu-Satunya Item Tersisa

| Item | Estimasi | Priority |
|------|----------|----------|
| Export CSV/PDF di halaman Laporan | ~3 jam | 🟡 P3 |

---

## Status Keseluruhan

**Semua modul FE selesai.** Siap untuk handoff ke BE dan integrasi API.

Dependency ke BE (saat ini masih mock):
- POST `/auth/login` → JWT
- CRUD semua entitas (Item, Customer, Vehicle, Employee, Antrean, Transaction)
- WebSocket atau polling untuk update status antrean real-time
- WA Gateway: POST `/wa/send`
