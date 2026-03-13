"use client";
import { useState, useEffect, useCallback } from "react";
import { transactionsService } from "@/services/transactions.service";
import { Transaction } from "@/types/transaction";

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const txs = await transactionsService.getAll();
      setData(txs.sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data transaksi",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const deleteTransaction = useCallback(async (id: string) => {
    await transactionsService.delete(id);
    setData((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { data, loading, error, refetch: fetchAll, deleteTransaction, setData };
}
