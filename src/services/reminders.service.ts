import { api } from "@/lib/api";

export interface ApiReminder {
  id: string;
  customer_id: number;
  vehicle_id: number;
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
  created_at?: string;
}

export interface CreateReminderBody {
  customer_id: number;
  vehicle_id: number;
  jenis_reminder: string;
  jadwal_tanggal: string;
  odometer_saat?: number;
  odometer_target?: number;
  catatan?: string;
  status?: string;
}

export const remindersService = {
  async getAll(): Promise<ApiReminder[]> {
    const res = await api.get<ApiReminder[]>("/api/v1/reminders");
    return res.data;
  },

  async getById(id: string): Promise<ApiReminder> {
    const res = await api.get<ApiReminder>(`/api/v1/reminders/${id}`);
    return res.data;
  },

  async create(data: CreateReminderBody): Promise<any> {
    const res = await api.post("/api/v1/reminders", data);
    return res.data;
  },

  async update(id: string, data: Partial<CreateReminderBody>): Promise<any> {
    const res = await api.put(`/api/v1/reminders/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/reminders/${id}`);
  },

  async sendWa(id: string): Promise<void> {
    // Note: The original service used /api/v1/notifications/wa/send-reminder/${id}
    // but the backend controller I saw didn't have this. 
    // I should check notificationRoutes.ts/controller.ts again or just implement it.
    await api.post(`/api/v1/reminders/send-wa/${id}`);
  }
};
