"use client";
import { useState, useEffect, useCallback } from "react";
import { customersService } from "@/services/customers.service";
import { vehiclesService, VehicleBody } from "@/services/vehicles.service";
import { Vehicle } from "@/types/vehicle";
import { ApiVehicle } from "@/types/api";

/** Flattens all vehicles from all customers into the FE Vehicle shape.
 *  Since /customers returns vehicles[] (full ApiVehicle objects) on each customer, we map them. */
export function useVehicles() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const customers = await customersService.getAllRaw();
      const vehicles: Vehicle[] = customers.flatMap((c) =>
        (c.vehicles ?? []).map((v: ApiVehicle) => ({
          id: String(v.id),
          plateNumber: v.plate_number,
          brand: v.brand ?? "",
          model: v.model ?? "",
          type: ((v.type as string) === "Motor" ? "Motor" : "Mobil") as
            | "Mobil"
            | "Motor",
          year: v.year ?? 0,
          color: "",
          ownerId: String(c.id),
          ownerName: c.name,
          lastServiceKm: 0,
          serviceHistory: [],
        })),
      );
      
      // Sort by ID descending (newest first)
      const sortedVehicles = [...vehicles].sort((a, b) => Number(b.id) - Number(a.id));
      setData(sortedVehicles);
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

  async function addVehicle(customerId: string, body: VehicleBody) {
    await vehiclesService.create(customerId, body);
    await fetchAll();
  }

  async function updateVehicle(vehicleId: string, body: Partial<VehicleBody>) {
    await vehiclesService.update(vehicleId, body);
    await fetchAll();
  }

  async function removeVehicle(vehicleId: string) {
    await vehiclesService.delete(vehicleId);
    await fetchAll();
  }

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchAll, 
    addVehicle, 
    updateVehicle,
    deleteVehicle: removeVehicle 
  };
}
