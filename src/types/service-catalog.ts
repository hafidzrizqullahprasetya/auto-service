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
