"use client";
import { useState, useEffect, useCallback } from "react";
import { customersService, CustomerBody } from "@/services/customers.service";
import { Customer } from "@/mock/customers";

export function useCustomers() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const customers = await customersService.getAll();
      setData(customers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data pelanggan",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addCustomer = useCallback(async (body: CustomerBody) => {
    const customer = await customersService.create(body);
    // Refetch data untuk ensure kita get complete customer data dengan relasi
    await fetchAll();
    return customer;
  }, [fetchAll]);

  const updateCustomer = useCallback(
    async (id: string, body: Partial<CustomerBody>) => {
      const updated = await customersService.update(id, body);
      // Refetch data untuk ensure kita get complete updated customer data
      await fetchAll();
      return updated;
    },
    [fetchAll],
  );

  const deleteCustomer = useCallback(async (id: string) => {
    await customersService.delete(id);
    setData((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
