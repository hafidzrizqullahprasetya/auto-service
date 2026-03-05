import { api } from "@/lib/api";
import { ApiWorkOrder } from "@/types/api";
import { Antrean } from "@/mock/antrean";

const STATUS_MAP: Record<ApiWorkOrder["status"], Antrean["status"]> = {
  menunggu: "Menunggu",
  dikerjakan: "Dikerjakan",
  menunggu_sparepart: "Menunggu Sparepart",
  selesai: "Selesai",
};

const STATUS_MAP_REVERSE: Record<Antrean["status"], ApiWorkOrder["status"]> = {
  Menunggu: "menunggu",
  Dikerjakan: "dikerjakan",
  "Menunggu Sparepart": "menunggu_sparepart",
  Selesai: "selesai",
};

/** Map BE WorkOrder → FE Antrean */
export function mapWorkOrder(wo: ApiWorkOrder): Antrean {
  const vehicle = wo.vehicle;
  const customer = wo.customer;
  return {
    id: wo.id,
    noPolisi: vehicle?.plate_number ?? "",
    kendaraan: vehicle ? `${vehicle.brand} ${vehicle.model}`.trim() : "",
    tipe: (vehicle?.type === "Motor" ? "Motor" : "Mobil") as "Mobil" | "Motor",
    pelanggan: customer?.name ?? "",
    layanan: wo.layanan,
    status: STATUS_MAP[wo.status] ?? "Menunggu",
    waktuMasuk: wo.waktu_masuk ?? wo.created_at,
    mekanik: wo.mekanik,
    estimasiSelesai: wo.estimasi_selesai,
    keluhan: wo.keluhan,
    estimasiBiaya: wo.estimasi_biaya,
    waPelanggan: customer?.phone,
    menginap: wo.menginap,
  };
}

export interface WorkOrderBody {
  customer_id: string;
  vehicle_id: string;
  layanan: string;
  keluhan?: string;
  estimasi_biaya?: number;
  estimasi_selesai?: string;
  menginap?: boolean;
}

export const antreanService = {
  async getAll(): Promise<Antrean[]> {
    const res = await api.get<ApiWorkOrder[]>("/work-orders");
    return (res.data ?? []).map(mapWorkOrder);
  },

  async getById(id: string): Promise<Antrean> {
    const res = await api.get<ApiWorkOrder>(`/work-orders/${id}`);
    return mapWorkOrder(res.data);
  },

  async create(body: WorkOrderBody): Promise<Antrean> {
    const res = await api.post<ApiWorkOrder>("/work-orders", body);
    return mapWorkOrder(res.data);
  },

  async update(id: string, body: Partial<WorkOrderBody>): Promise<Antrean> {
    const res = await api.put<ApiWorkOrder>(`/work-orders/${id}`, body);
    return mapWorkOrder(res.data);
  },

  async updateStatus(id: string, status: Antrean["status"]): Promise<Antrean> {
    const res = await api.patch<ApiWorkOrder>(`/work-orders/${id}/status`, {
      status: STATUS_MAP_REVERSE[status],
    });
    return mapWorkOrder(res.data);
  },

  async assignMechanic(id: string, mekanik: string): Promise<Antrean> {
    const res = await api.patch<ApiWorkOrder>(`/work-orders/${id}/mechanic`, {
      mekanik,
    });
    return mapWorkOrder(res.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/work-orders/${id}`);
  },
};
