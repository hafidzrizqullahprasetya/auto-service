"use client";
import { useState, useEffect, useCallback } from "react";
import { customersService } from "@/services/customers.service";
import { Vehicle } from "@/mock/vehicles";

/** Flattens all vehicles from all customers into the FE Vehicle shape.
 *  Since /customers returns vehicles[] on each customer, we map them. */
export function useVehicles() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const customers = await customersService.getAll();
      // Build vehicle list from customer.vehicles (plate_number array)
      // Full vehicle info requires per-customer fetch; use customer.vehicles plates
      const vehicles: Vehicle[] = customers.flatMap((c) =>
        (c.vehicles ?? []).map((plate, idx) => ({
          id: `${c.id}-v${idx}`,
          plateNumber: plate,
          brand: "",
          model: "",
          type: "Mobil" as const,
          year: 0,
          color: "",
          ownerId: c.id,
          lastServiceKm: 0,
          serviceHistory: [],
        })),
      );
      setData(vehicles);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data kendaraan",
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
