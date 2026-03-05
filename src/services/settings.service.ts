import { api } from "@/lib/api";
import { ApiSettings } from "@/types/api";

export const settingsService = {
  async get(): Promise<ApiSettings> {
    const res = await api.get<ApiSettings>("/settings");
    return res.data;
  },

  async update(body: Partial<ApiSettings>): Promise<ApiSettings> {
    const res = await api.put<ApiSettings>("/settings", body);
    return res.data;
  },
};
