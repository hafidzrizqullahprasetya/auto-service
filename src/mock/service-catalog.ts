export interface ServiceCatalog {
  id: string;
  namaJasa: string;
  kategori: "Mesin" | "Rem & Transmisi" | "Kelistrikan" | "AC & Kabin" | "Body & Cat" | "Lainnya";
  hargaStandar: number;
  durasiEstimasi: string; // e.g. "1-2 jam"
  berlakuUntuk: "Mobil" | "Motor" | "Keduanya";
  garansi?: string; // e.g. "3 bulan"
  aktif: boolean;
}

export const MOCK_SERVICE_CATALOG: ServiceCatalog[] = [
  {
    id: "svc-001",
    namaJasa: "Ganti Oli & Filter",
    kategori: "Mesin",
    hargaStandar: 50000,
    durasiEstimasi: "30-45 menit",
    berlakuUntuk: "Keduanya",
    garansi: "1 bulan / 1.000 km",
    aktif: true,
  },
  {
    id: "svc-002",
    namaJasa: "Service Rutin 10.000km",
    kategori: "Mesin",
    hargaStandar: 150000,
    durasiEstimasi: "2-3 jam",
    berlakuUntuk: "Mobil",
    garansi: "3 bulan",
    aktif: true,
  },
  {
    id: "svc-003",
    namaJasa: "Tune Up Mesin",
    kategori: "Mesin",
    hargaStandar: 200000,
    durasiEstimasi: "2-4 jam",
    berlakuUntuk: "Mobil",
    garansi: "3 bulan",
    aktif: true,
  },
  {
    id: "svc-004",
    namaJasa: "Cek & Ganti Kampas Rem",
    kategori: "Rem & Transmisi",
    hargaStandar: 75000,
    durasiEstimasi: "1-2 jam",
    berlakuUntuk: "Keduanya",
    garansi: "3 bulan",
    aktif: true,
  },
  {
    id: "svc-005",
    namaJasa: "Spooring & Balancing",
    kategori: "Rem & Transmisi",
    hargaStandar: 120000,
    durasiEstimasi: "1-1.5 jam",
    berlakuUntuk: "Mobil",
    aktif: true,
  },
  {
    id: "svc-006",
    namaJasa: "Servis AC (Freon + Cuci Filter)",
    kategori: "AC & Kabin",
    hargaStandar: 175000,
    durasiEstimasi: "1.5-2 jam",
    berlakuUntuk: "Mobil",
    garansi: "1 bulan",
    aktif: true,
  },
  {
    id: "svc-007",
    namaJasa: "Servis Injeksi Motor",
    kategori: "Mesin",
    hargaStandar: 75000,
    durasiEstimasi: "1-2 jam",
    berlakuUntuk: "Motor",
    garansi: "1 bulan",
    aktif: true,
  },
  {
    id: "svc-008",
    namaJasa: "Ganti Aki",
    kategori: "Kelistrikan",
    hargaStandar: 50000,
    durasiEstimasi: "30 menit",
    berlakuUntuk: "Keduanya",
    aktif: false,
  },
];
