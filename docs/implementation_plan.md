# Rencana Perbaikan Struktur Frontend

Setelah melakukan analisis mendalam (*deep screen*) terhadap struktur direktori `src` sistem Anda, ditemukan beberapa hal yang dapat dioptimalkan:

## Analisis Masalah Saat Ini
1. **Pencampuran Template dan Logika Bisnis**: Dalam `src/app/(dashboard)`, fitur inti aplikasi (`bengkel`) tercampur dengan halaman-halaman contoh bawaan dari *template* UI (seperti `charts`, `forms`, `tables`, `ui-elements`).
2. **Folder Direktori `components` Sangat Padat**: Terdapat percampuran antara komponen UI *reusable* (seperti `ui`, `ui-elements`, `FormElements`) dengan komponen pintar yang sangat spesifik untuk domain bengkel aplikasi (`Auth`, `Bengkel`). Serta ada redudansi seperti folder `ui` dan `ui-elements`.
3. **Inkonsistensi Penamaan**: Terdapat folder dengan gaya Kapital (`Auth`, `Bengkel`, `Charts`) dan huruf kecil (`layouts`, `ui`). Ini membuat pengurutan file secara alfabet dan kebersihan penamaan kurang konsisten.
4. **Terlalu Banyak Layer (Nesting)**: Hal krusial dari bisnis Anda tersembunyi jauh di dalam rute `src/components/Bengkel/Inventori/...` atau rute navigasi `src/app/(dashboard)/bengkel/inventori`.

---

## User Review Required
> [!IMPORTANT]
> **Refactoring besar-besaran terhadap direktori.**  
> Proposal di bawah ini akan mengubah lokasi mayoritas file `.tsx` yang Anda miliki. Harap tinjau apakah model arsitektur di bawah ini masuk dengan ekspektasi Anda ke depan.

## Proposed Changes / Proposal Struktur Baru

Untuk membuat struktur yang "BENAR dan rapi" serta sangat handal (*scalable*) untuk dikembangkan ke depan, direkomendasikan menggunakan perpaduan **Feature-Based Architecture**.

Struktur impian (*ideal structure*) nantinya akan menjadi seperti ini:

```text
src/
├── app/                        # 🌐 Routing Framework (Next.js App Router)
│   ├── (auth)/                 # -> [MEMINDAHKAN] halaman /auth/sign-in
│   ├── (dashboard)/            # -> [MENGHAPUS] file bawaan template yg tidak dipakai (charts, pages, dll)
│   │   ├── antrean/            # -> [MEMINDAHKAN] dari (dashboard)/bengkel/antrean
│   │   ├── inventori/          # -> [MEMINDAHKAN] dari (dashboard)/bengkel/inventori
│   │   ├── kasir/              # -> [MEMINDAHKAN] dari (dashboard)/bengkel/kasir
│   │   └── ... 
│   ├── api/                    # Endpoint API backend (Next.js API Routes - biarkan utuh)
│   ├── layout.tsx              
│   └── providers.tsx           
│
├── components/                 # 🧩 Reusable UI Components (Dumb Components)
│   ├── ui/                     # -> [MENGGABUNGKAN] ui, ui-elements, FormElements ke sini
│   ├── layouts/                # -> [MENYIMPAN] Header, Sidebar, dll
│   └── icons/                  # -> [MEMINDAHKAN] dari folder /Icons
│
├── features/                   # ✨ Business Logic & Smart Components (Kumpulan Fitur Inti)
│   ├── auth/                   # -> [MEMINDAHKAN] komponen Auth di sini (SignIn form)
│   ├── antrean/                # -> [MEMINDAHKAN] komponen Bengkel/Antrean di sini
│   ├── inventori/              # -> [MEMINDAHKAN] komponen Bengkel/Inventori di sini
│   ├── pelanggan/              # -> [MEMINDAHKAN] komponen spesifik pelanggan
│   ├── kasir/                  # -> [MEMINDAHKAN] logika & modal invoice kasir
│   └── shared/                 # -> [MEMINDAHKAN] komponen Bengkel/shared
│
├── hooks/                      # 🔄 Global React Hooks
│
├── lib/                        # 🛠️ Helper dan Utilities (format-number, utils, excel)
│
├── services/                   # 📡 API Calls / Network Requests
│
├── types/                      # 🏷️ Global TypeScript Interfaces (misal: api.ts)
│
├── assets/                     # 🖼️ Static Assets (Gambar, Logo)
│
├── styles/                     # 🎨 [MENGUBAH] nama folder 'css' menjadi 'styles'
│
└── mock/                       # 🧪 Data Dummy untuk testing/mocking
```

### Penjelasan Perubahan & Keuntungan:
1. **Screaming Architecture**: Saat pengembang membuka folder `src/features/`, pengembang akan langsung paham fungsi aplikasi ini (ada inventori, kasir, antrean, pelanggan).
2. **Pemisahan Perhatian (Separation of Concerns)**: Folder `src/components` murni hanya berisi tombol, tabel generik, modal generik, dll yang *tidak* terkait dengan fungsional database sama sekali. Jika ada *table* berisi *antrean*, itu merupakan bagian dari `features/antrean`.
3. **Membersihkan File Bawaan Template**: Template Next.js (Admin) sering membawa banyak komponen & modul demonstrasi yang tidak kita perlukan (`CalenderBox`, berbagai jenis *charts*). File-file ini akan diisolasi/dijauhkan agar Anda tidak pusing.

## Verification Plan
Karena memodifikasi puluhan folder (*refactoring* massal):
1. **Automated Verification**: Saya akan menjalankan `npm run build` dan memeriksa terminal `npm run dev` secara terus menerus selama me-*rename* direktori.
2. **Manual Verification**: Anda akan diminta secara berkala memastikan halaman tidak rusak (*broken imports*) melalui peramban uji (testing browser).
