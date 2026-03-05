import { api } from "@/lib/api";
import { ApiCustomer } from "@/types/api";
import { Customer } from "@/mock/customers";

/** Map BE ApiCustomer → FE Customer */
export function mapCustomer(c: ApiCustomer): Customer {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    totalVisits: c.total_visits ?? 0,
    totalSpent: c.total_spent ?? 0,
    lastVisit: c.last_visit ?? "",
    vehicles: c.vehicles?.map((v) => v.plate_number) ?? [],
  };
}

export interface CustomerBody {
  name: string;
  phone: string;
  email?: string;
  address: string;
}

export const customersService = {
  async getAll(): Promise<Customer[]> {
    const res = await api.get<ApiCustomer[]>("/customers");
    return (res.data ?? []).map(mapCustomer);
  },

  async getById(id: string): Promise<Customer> {
    const res = await api.get<ApiCustomer>(`/customers/${id}`);
    return mapCustomer(res.data);
  },

  async create(body: CustomerBody): Promise<Customer> {
    const res = await api.post<ApiCustomer>("/customers", body);
    return mapCustomer(res.data);
  },

  async update(id: string, body: Partial<CustomerBody>): Promise<Customer> {
    const res = await api.put<ApiCustomer>(`/customers/${id}`, body);
    return mapCustomer(res.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
