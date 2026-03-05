import { api } from "@/lib/api";
import { ApiVehicle } from "@/types/api";

export type { ApiVehicle };

export interface VehicleBody {
  plate_number: string;
  type: string;
  brand: string;
  model: string;
  year: number;
}

export const vehiclesService = {
  async getByCustomer(customerId: string): Promise<ApiVehicle[]> {
    const res = await api.get<ApiVehicle[]>(
      `/customers/${customerId}/vehicles`,
    );
    return res.data ?? [];
  },

  async create(customerId: string, body: VehicleBody): Promise<ApiVehicle> {
    const res = await api.post<ApiVehicle>(
      `/customers/${customerId}/vehicles`,
      body,
    );
    return res.data;
  },

  async update(
    vehicleId: string,
    body: Partial<VehicleBody>,
  ): Promise<ApiVehicle> {
    const res = await api.put<ApiVehicle>(`/vehicles/${vehicleId}`, body);
    return res.data;
  },
};
