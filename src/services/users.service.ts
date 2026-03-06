import { api } from "@/lib/api";
import { ApiUser } from "@/types/api";
import { Employee } from "@/mock/employees";
import { normalizeRole } from "./auth.service";

/** Map BE ApiUser → FE Employee */
export function mapUser(u: ApiUser): Employee {
  return {
    id: u.id,
    name: u.name,
    role: normalizeRole(u.role) as Employee["role"],
    status: u.is_active === false ? "Off" : "Aktif",
    joinDate: "",
    totalTasks: 0,
    rating: 0,
    phone: u.phone ?? "",
  };
}

export interface UserBody {
  name: string;
  username: string;
  password: string;
  role: "admin" | "kasir";
  phone?: string;
}

export const usersService = {
  async getAll(): Promise<Employee[]> {
    const res = await api.get<ApiUser[]>("/api/v1/users");
    return (res.data ?? []).map(mapUser);
  },

  async create(body: UserBody): Promise<Employee> {
    const res = await api.post<ApiUser>("/api/v1/users", body);
    return mapUser(res.data);
  },

  async update(
    id: string,
    body: Partial<Omit<UserBody, "password"> & { password?: string }>,
  ): Promise<Employee> {
    const res = await api.put<ApiUser>(`/api/v1/users/${id}`, body);
    return mapUser(res.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/users/${id}`);
  },
};
