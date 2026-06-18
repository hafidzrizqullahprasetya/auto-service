# Responsive Fix Plan

Tanggal audit: 18 Juni 2026  
Target production: https://auto-service-jet.vercel.app  
Tool: `npm run responsive:audit`

## Ringkasan Audit

Audit responsive sudah dijalankan dengan login real, bukan seed/mock.

Run owner sebelumnya:

- Role: `owner`
- Kredensial: `owner / owner123`
- Hasil: `27/68` kombinasi viewport-route lolos, `41/68` flagged
- Catatan: owner cocok untuk cakupan halaman paling luas karena memiliki akses dashboard utama.

Run terakhir yang tersimpan di `responsive-audit/results.json`:

- Role: `kasir`
- Kredensial: `kasir / kasir123`
- Hasil: `9/68` kombinasi viewport-route lolos, `59/68` flagged
- Catatan penting: banyak route non-kasir redirect ke `/antrean`, jadi banyak flag pada run kasir sebenarnya mengulang masalah layout `/antrean`, bukan masalah unik di semua route.

Output audit:

- HTML report: `responsive-audit/index.html`
- Raw JSON: `responsive-audit/results.json`
- Screenshot: `responsive-audit/screenshots/`

## Prioritas Perbaikan

### P0 - Fix pola overflow berulang di toolbar action

Halaman terdampak dari audit owner:

- `/antrean`
- `/inventori`
- `/karyawan`
- `/kendaraan`
- `/pelanggan`

Gejala:

- Tombol `Template`, `Import`, `Export`, dan tooltip seperti `Download template Excel kosong` melebar keluar viewport mobile.
- Banyak elemen memakai kombinasi `shrink-0`, `whitespace-nowrap`, dan tooltip absolute `left-1/2 -translate-x-1/2`.

Arahan fix:

- Di mobile, toolbar action jangan dipaksa satu baris.
- Gunakan wrapping atau grid 2 kolom untuk tombol action.
- Tooltip mobile sebaiknya tidak `whitespace-nowrap`, atau posisinya di-clamp agar tidak keluar viewport.
- Untuk tombol icon, tampilkan label penuh hanya mulai breakpoint `sm`/`md`; mobile cukup icon + tooltip yang aman.

Checklist:

- [ ] Cari komponen toolbar import/export/template yang dipakai berulang.
- [ ] Ubah container dari `flex shrink-0` menjadi `flex flex-wrap` atau `grid grid-cols-2 sm:flex`.
- [ ] Hapus `whitespace-nowrap` pada tooltip mobile atau ganti dengan `max-w-[calc(100vw-2rem)] whitespace-normal`.
- [ ] Pastikan tidak ada horizontal scroll pada `375px`.

### P0 - Fix layout `/antrean`

Halaman terdampak:

- `/antrean`
- Route kasir yang redirect ke `/antrean`

Gejala:

- Tooltip `Download template Excel kosong` overflow sekitar `38px` di iPhone SE/iPhone 14.
- Tooltip `WhatsApp Progres` overflow kecil tapi berulang.

Arahan fix:

- Perbaiki tooltip action button di antrean.
- Jika toolbar berada di sisi kanan viewport, tooltip perlu `right-0 left-auto translate-x-0` pada mobile.
- Alternatif lebih stabil: buat tooltip menggunakan `max-w` dan wrapping text.

Checklist:

- [ ] Fix tooltip action import/template.
- [ ] Fix tooltip action WhatsApp.
- [ ] Screenshot ulang `/antrean` pada `iphone-se`, `iphone-14`, `android`, `tablet`.

### P1 - Fix tombol stok masuk/keluar di `/inventori/stok`

Halaman terdampak:

- `/inventori/stok`

Gejala dari audit owner:

- Container tombol `Kurang Stok (Keluar)` dan `Tambah Stok (Masuk)` lebarnya sekitar `400px`.
- Tombol `Tambah Stok (Masuk)` sendiri sekitar `214px`, overflow di mobile kecil.

Arahan fix:

- Di mobile, tombol stok masuk/keluar dibuat stacked full-width.
- Mulai `sm`/`md`, boleh balik horizontal.

Checklist:

- [ ] Ubah container action menjadi `flex-col sm:flex-row`.
- [ ] Tombol mobile pakai `w-full justify-center`.
- [ ] Hilangkan `shrink-0` yang membuat container tidak mau mengecil.

### P1 - Fix tabs di `/pengaturan`

Halaman terdampak:

- `/pengaturan`

Gejala dari audit owner:

- Tab `WA Gateway` dan `Manajemen Akun` keluar viewport di iPhone SE.
- Class yang tampak bermasalah memakai `whitespace-nowrap`.

Arahan fix:

- Untuk mobile, tab bisa horizontal scroll internal atau wrap ke beberapa baris.
- Jangan biarkan tab list membuat document-level horizontal overflow.

Checklist:

- [ ] Bungkus tab list dengan `overflow-x-auto max-w-full`.
- [ ] Atau ubah tab list ke `grid grid-cols-2` pada mobile.
- [ ] Pastikan active indicator tetap terlihat.

### P1 - Fix tabel `/purchase-order`

Halaman terdampak:

- `/purchase-order`

Gejala dari audit owner:

- Tabel melebar sekitar `488px` pada viewport `375px`.
- Kolom `No. PO / Tanggal`, `Supplier`, `Status`, `Progress`, `Total Nilai`, `Est. Tiba`, `Aksi` terlalu padat untuk mobile.

Arahan fix:

- Jika data tabel perlu tetap lengkap, pakai scroll container lokal: `overflow-x-auto`.
- Jika ingin pengalaman mobile lebih baik, ubah row menjadi card layout pada `<md`.

Checklist:

- [ ] Bungkus table dengan container `max-w-full overflow-x-auto`.
- [ ] Pastikan overflow terjadi di container tabel, bukan document body.
- [ ] Pertimbangkan card mobile untuk PO jika halaman sering dipakai dari HP.

### P2 - Pisahkan request/API noise dari layout issue

Gejala:

- Beberapa route flagged karena `request gagal`, bukan karena layout.
- Ini bisa muncul karena production API lambat, request role tidak punya akses, atau endpoint gagal.

Arahan fix:

- Untuk responsive, prioritaskan `overflow` dulu.
- Request gagal dicatat terpisah sebagai bug integrasi/data, bukan blocker layout kecuali membuat halaman kosong/rusak.

Checklist:

- [ ] Setelah layout fix, jalankan audit ulang.
- [ ] Jika masih ada `request gagal`, cek endpoint dan response network dari HTML report/JSON.
- [ ] Jangan campur request failure dengan responsive bug saat laporan final.

## Cara Verifikasi Ulang

Owner, untuk cakupan halaman penuh:

```bash
cd /Users/fizualstd/Documents/GitHub/auto-service
RESPONSIVE_AUDIT_URL=https://auto-service-jet.vercel.app npm run responsive:audit
open responsive-audit/index.html
```

Kasir, untuk workflow kasir:

```bash
RESPONSIVE_AUDIT_URL=https://auto-service-jet.vercel.app RESPONSIVE_AUDIT_ROLE=kasir npm run responsive:audit
open responsive-audit/index.html
```

Mekanik, untuk workflow mekanik:

```bash
RESPONSIVE_AUDIT_URL=https://auto-service-jet.vercel.app RESPONSIVE_AUDIT_ROLE=mekanik npm run responsive:audit
open responsive-audit/index.html
```

## Catatan Operasional

Saat ini folder `responsive-audit/` akan dioverwrite setiap run. Kalau perlu membandingkan antar role, simpan manual setelah run:

```bash
mv responsive-audit responsive-audit-owner
RESPONSIVE_AUDIT_URL=https://auto-service-jet.vercel.app RESPONSIVE_AUDIT_ROLE=kasir npm run responsive:audit
mv responsive-audit responsive-audit-kasir
```

Untuk perbaikan paling efisien, jangan mulai dari halaman satu per satu. Mulai dari komponen bersama:

1. Toolbar import/export/template.
2. Tooltip action button.
3. Container action button mobile.
4. Table wrapper.
5. Tab list settings.

Satu komponen bersama yang benar bisa menghapus banyak flag sekaligus.
