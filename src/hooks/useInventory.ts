"use client";
import { useState, useEffect, useCallback } from "react";
import { inventoryService, SparePartBody } from "@/services/inventory.service";
import { Item } from "@/types/inventory";
import { ApiCategory } from "@/types/api";

export function useInventory() {
  const [data, setData] = useState<Item[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [items, cats] = await Promise.all([
        inventoryService.getAll(),
        inventoryService.getCategories(),
      ]);
      setData(items.sort((a, b) => Number(b.id) - Number(a.id)));
      setCategories(cats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data inventori",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addItem = useCallback(async (body: SparePartBody) => {
    const item = await inventoryService.create(body);
    setData((prev) => [item, ...prev]);
    return item;
  }, []);

  const updateItem = useCallback(
    async (id: string, body: Partial<SparePartBody>) => {
      const updated = await inventoryService.update(id, body);
      setData((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return updated;
    },
    [],
  );

  const deleteItem = useCallback(async (id: string) => {
    await inventoryService.delete(id);
    setData((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return {
    data,
    categories,
    loading,
    error,
    refetch: fetchAll,
    addItem,
    updateItem,
    deleteItem,
  };
}
