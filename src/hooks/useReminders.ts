"use client";
import { useState, useEffect, useCallback } from "react";
import { remindersService, ApiReminder } from "@/services/reminders.service";

export function useReminders() {
  const [data, setData] = useState<ApiReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await remindersService.getAll();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data reminder");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const sendWa = async (id: string) => {
    try {
      await remindersService.sendWa(id);
      await fetchAll();
    } catch (err) {
      throw err;
    }
  };

  return { data, loading, error, refetch: fetchAll, sendWa };
}
