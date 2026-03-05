"use client";
import { useState, useEffect, useCallback } from "react";
import { usersService } from "@/services/users.service";
import { Employee } from "@/mock/employees";

export function useEmployees() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const employees = await usersService.getAll();
      setData(employees);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data karyawan",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}
