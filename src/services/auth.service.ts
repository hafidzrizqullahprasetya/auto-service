import { api } from "@/lib/api";
import { LoginResponse, ApiUser } from "@/types/api";

export type FrontendRole = "Owner" | "Admin" | "Kasir";

/** Normalize BE role (lowercase) → FE role (capitalized) */
export function normalizeRole(role: string): FrontendRole {
  const r = role.toLowerCase();
  if (r === "owner") return "Owner";
  if (r === "admin") return "Admin";
  return "Kasir";
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  },

  async me(): Promise<ApiUser> {
    const res = await api.get<ApiUser>("/auth/me");
    return res.data;
  },
};
