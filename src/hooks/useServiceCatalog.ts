"use client";
import { useState, useEffect, useCallback } from "react";
import { serviceCatalogService, ServiceCatalog as ApiServiceCatalogType } from "@/services/service-catalog.service";

export interface ServiceCatalog {
  id: string;
  namaJasa: string;
  kategori: string;
  hargaStandar: number;
  durasiEstimasi: string; 
  berlakuUntuk: string;
  garansi?: string; 
  aktif: boolean;
}

export function useServiceCatalog() {
  const [data, setData] = useState<ServiceCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await serviceCatalogService.getAll();
      const mapped = items.map((item) => ({
        id: item.id.toString(),
        namaJasa: item.name,
        kategori: item.kategori || "Lainnya",
        hargaStandar: Number(item.standard_price),
        durasiEstimasi: "1 - 2 Jam", // Mocked since DB doesn't have this
        berlakuUntuk: (item as any).berlaku_untuk || "Keduanya",
        garansi: "1 Bulan", // Mocked
        aktif: (item as any).is_active ?? true,
      }));
      setData(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat katalog jasa");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // real toggle status via API
  const toggleAktif = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await serviceCatalogService.update(id, { is_active: !currentStatus } as any);
      setData((prev) => prev.map((s) => (s.id === id ? { ...s, aktif: !currentStatus } : s)));
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await serviceCatalogService.delete(id);
      setData((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
    toggleAktif,
    deleteItem,
  };
}
