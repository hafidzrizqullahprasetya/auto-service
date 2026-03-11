"use client";
import { useState, useEffect, useCallback } from "react";
import { settingsService } from "@/services/settings.service";
import { ApiSettings } from "@/types/api";

export function useSettings() {
  const [data, setData] = useState<ApiSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const settings = await settingsService.get();
      setData(settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (body: Partial<ApiSettings>) => {
    try {
      const updated = await settingsService.update(body);
      setData(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  return { data, loading, error, refetch: fetchSettings, updateSettings };
}
