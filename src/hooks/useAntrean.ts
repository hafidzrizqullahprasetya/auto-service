"use client";
import { useState, useEffect, useCallback } from "react";
import { antreanService } from "@/services/antrean.service";
import { Antrean } from "@/mock/antrean";

export function useAntrean() {
  const [data, setData] = useState<Antrean[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await antreanService.getAll();
      setData(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data antrean",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateStatus = useCallback(
    async (id: string, status: Antrean["status"]) => {
      const updated = await antreanService.updateStatus(id, status);
      setData((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    },
    [],
  );

  const assignMechanic = useCallback(async (id: string, mekanik: string) => {
    const updated = await antreanService.assignMechanic(id, mekanik);
    setData((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const create = useCallback(async (body: any) => {
    try {
      setLoading(true);
      const newItem = await antreanService.create(body);
      setData((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await antreanService.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
    updateStatus,
    assignMechanic,
    create,
    remove,
    setData,
  };
}
