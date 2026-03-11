import { api } from "@/lib/api";

export interface ServiceCatalog {
  id: number;
  name: string;
  description?: string;
  kategori?: string;
  standard_price: number;
}

export const serviceCatalogService = {
  async getAll(): Promise<ServiceCatalog[]> {
    const res = await api.get<ServiceCatalog[]>("/api/v1/service-catalog");
    return res.data ?? [];
  },

  async create(data: Partial<ServiceCatalog>): Promise<ServiceCatalog> {
    const res = await api.post<ServiceCatalog>("/api/v1/service-catalog", data);
    return res.data;
  },

  async update(id: string | number, data: Partial<ServiceCatalog>): Promise<ServiceCatalog> {
    const res = await api.put<ServiceCatalog>(`/api/v1/service-catalog/${id}`, data);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await api.delete(`/api/v1/service-catalog/${id}`);
  },
};
