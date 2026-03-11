"use client";
import { useState, useEffect, useCallback } from "react";
import { stockMovementService } from "@/services/stock-movements.service";
import { StockMovement } from "@/types/stock-movement";

export function useStockMovements() {
  const [data, setData] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const movements = await stockMovementService.getAll();
      setData(movements);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data pergerakan stok",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
  };
}
