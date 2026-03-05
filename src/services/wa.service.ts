import { api } from "@/lib/api";
import { ApiWaNotification, ApiWaStatus } from "@/types/api";

export const waService = {
  async getNotifications(): Promise<ApiWaNotification[]> {
    const res = await api.get<ApiWaNotification[]>("/notifications/wa");
    return res.data ?? [];
  },

  async getStatus(): Promise<ApiWaStatus> {
    const res = await api.get<ApiWaStatus>("/notifications/wa/status");
    return res.data;
  },

  async sendTest(): Promise<void> {
    await api.post("/notifications/wa/test");
  },
};
