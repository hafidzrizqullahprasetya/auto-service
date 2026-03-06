import { api } from "@/lib/api";
import { ApiSettings } from "@/types/api";

export const settingsService = {
  async get(): Promise<ApiSettings> {
    const res = await api.get<ApiSettings>("/api/v1/settings");
    return res.data;
  },

  async update(body: Partial<ApiSettings>): Promise<ApiSettings> {
    const res = await api.put<ApiSettings>("/api/v1/settings", body);
    return res.data;
  },
};
