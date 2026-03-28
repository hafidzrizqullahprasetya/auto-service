import { api } from "@/lib/api";
import { ApiServiceBundle } from "@/types/api";

export type { ApiServiceBundle };

export const serviceBundlesService = {
  async getAll(): Promise<ApiServiceBundle[]> {
    const res = await api.get<ApiServiceBundle[]>("/api/v1/service-bundles");
    return res.data ?? [];
  },

  async getById(id: number): Promise<ApiServiceBundle> {
    const res = await api.get<ApiServiceBundle>(`/api/v1/service-bundles/${id}`);
    return res.data;
  },

  async create(payload: {
    name: string;
    description?: string;
    price: number;
    items?: string[];
  }): Promise<ApiServiceBundle> {
    const res = await api.post<ApiServiceBundle>("/api/v1/service-bundles", payload);
    return res.data;
  },

  async update(
    id: number,
    payload: {
      name?: string;
      description?: string;
      price?: number;
      items?: string[];
    }
  ): Promise<ApiServiceBundle> {
    const res = await api.put<ApiServiceBundle>(`/api/v1/service-bundles/${id}`, payload);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/service-bundles/${id}`);
  },
};
