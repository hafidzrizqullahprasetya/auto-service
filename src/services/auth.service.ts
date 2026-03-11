import { api } from "@/lib/api";
import { LoginResponse, ApiUser } from "@/types/api";

export type FrontendRole = "Owner" | "Admin" | "Kasir";
export function normalizeRole(role: string): FrontendRole {
  const r = role.toLowerCase();
  if (r === "owner") return "Owner";
  if (r === "admin") return "Admin";
  return "Kasir";
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const res = await api.post<LoginResponse>("/api/v1/auth/login", {
        username,
        password,
      }, true);
      return res.data;
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes("username") || message.includes("password")) {
          throw new Error(error.message);
        }
        if (message.includes("401") || message.includes("unauthenticated")) {
          throw new Error("Username atau password salah. Silakan coba lagi.");
        }
        if (message.includes("403") || message.includes("forbidden")) {
          throw new Error("Akun Anda tidak memiliki akses. Hubungi admin.");
        }
        if (message.includes("404") || message.includes("not found")) {
          throw new Error("Username tidak ditemukan.");
        }
        if (message.includes("429") || message.includes("too many requests")) {
          throw new Error("Terlalu banyak percobaan. Silakan tunggu beberapa saat.");
        }
      }
      throw new Error("Username atau password salah. Silakan coba lagi.");
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_refresh_token");
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("auth_refresh_token");
    }
  },

  async me(): Promise<ApiUser> {
    const res = await api.get<ApiUser>("/api/v1/auth/me");
    return res.data;
  },
};
