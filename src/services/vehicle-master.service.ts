import { api } from "@/lib/api";

export interface VehicleMaster {
  id: number;
  brand: string;
  model: string;
  created_at: string;
}

export const vehicleMasterService = {
  async getAll(): Promise<VehicleMaster[]> {
    const res = await api.get<VehicleMaster[]>("/api/v1/vehicle-masters");
    return res.data ?? [];
  },

  async create(brand: string, model: string): Promise<VehicleMaster> {
    const res = await api.post<VehicleMaster>("/api/v1/vehicle-masters", { brand, model });
    return res.data;
  },
};
