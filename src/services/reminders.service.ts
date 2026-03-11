import { api } from "@/lib/api";

export interface ApiReminder {
  id: string;
  pelanggan: string;
  noPolisi: string;
  kendaraan: string;
  phone: string;
  jenisReminder: string;
  jadwalTanggal: string;
  odometerSaat: number;
  odometerTarget: number;
  status: "Aktif" | "Terkirim" | "Lewat Jatuh Tempo";
  catatan?: string;
}

export const remindersService = {
  async getAll(): Promise<ApiReminder[]> {
    try {
      const res = await api.get<ApiReminder[]>("/api/v1/reports/reminders");
      return res.data;
    } catch (err) {
       console.warn("Backend reminders not found, using empty array or fallback logic");
       return [];
    }
  },

  async sendWa(id: string): Promise<void> {
    await api.post(`/api/v1/notifications/wa/send-reminder/${id}`);
  }
};
