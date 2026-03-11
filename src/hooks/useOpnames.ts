"use client";
import { useState, useEffect, useCallback } from "react";
import {
  opnameService,
  CreateOpnameBody,
  AddOpnameItemBody,
  UpdateOpnameItemBody,
} from "@/services/opname.service";
import { StockOpname } from "@/types/opname";

export function useOpnames() {
  const [data, setData] = useState<StockOpname[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const opnames = await opnameService.getAll();
      setData(opnames);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data opname");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createOpname = useCallback(async (body: CreateOpnameBody) => {
    const opname = await opnameService.create(body);
    setData((prev) => [...prev, opname]);
    return opname;
  }, []);

  const closeOpname = useCallback(async (opnameId: string) => {
    const closed = await opnameService.closeOpname(opnameId);
    setData((prev) => prev.map((o) => (o.id === opnameId ? closed : o)));
    return closed;
  }, []);

  const addItem = useCallback(
    async (opnameId: string, body: AddOpnameItemBody) => {
      return await opnameService.addItem(opnameId, body);
    },
    [],
  );

  const updateItem = useCallback(
    async (opnameId: string, itemId: string, body: UpdateOpnameItemBody) => {
      return await opnameService.updateItem(opnameId, itemId, body);
    },
    [],
  );

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
    createOpname,
    closeOpname,
    addItem,
    updateItem,
  };
}
