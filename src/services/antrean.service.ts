import { api } from "@/lib/api";
import { ApiWorkOrder } from "@/types/api";
import { Antrean } from "@/types/antrean";

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

export function mapWorkOrder(wo: ApiWorkOrder): Antrean {
  const vehicle = wo.vehicles;
  const customer = wo.customers;
  return {
    id: wo.id.toString(),
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
    estimasiBiaya: Number(wo.estimasi_biaya ?? 0),
    waPelanggan: customer?.phone,
    menginap: wo.menginap,
    customer_id: wo.customer_id ?? undefined,
    vehicle_id: wo.vehicle_id ?? undefined,
    payment_status: (wo as any).transactions?.[0] ? 
      (PAYMENT_STATUS_MAP_ANTREAN[(wo as any).transactions[0].payment_status] || "Belum Bayar") : 
      "Belum Bayar",
  };
}

const PAYMENT_STATUS_MAP_ANTREAN: Record<string, Antrean["payment_status"]> = {
  lunas: "Lunas",
  dp: "DP",
  piutang: "Piutang",
};

export interface WorkOrderBody {
  customer_id?: number;
  vehicle_id?: number;
  payment_status?: "Lunas" | "DP" | "Piutang" | "Belum Bayar";
  layanan: string;
  keluhan?: string;
  estimasi_biaya?: number;
  estimasi_selesai?: string;
  menginap?: boolean;
}

export const antreanService = {
  async getAll(): Promise<Antrean[]> {
    const res = await api.get<ApiWorkOrder[]>("/api/v1/work-orders");
    return (res.data ?? []).map(mapWorkOrder);
  },

  async getById(id: string): Promise<Antrean> {
    const res = await api.get<ApiWorkOrder>(`/api/v1/work-orders/${id}`);
    return mapWorkOrder(res.data);
  },

  async create(body: WorkOrderBody): Promise<Antrean> {
    const res = await api.post<ApiWorkOrder>("/api/v1/work-orders", body);
    return mapWorkOrder(res.data);
  },

  async update(id: string, body: Partial<WorkOrderBody>): Promise<Antrean> {
    const res = await api.put<ApiWorkOrder>(`/api/v1/work-orders/${id}`, body);
    return mapWorkOrder(res.data);
  },

  async updateStatus(id: string, status: Antrean["status"]): Promise<Antrean> {
    const res = await api.patch<ApiWorkOrder>(`/api/v1/work-orders/${id}/status`, {
      status: STATUS_MAP_REVERSE[status],
    });
    return mapWorkOrder(res.data);
  },

  async assignMechanic(id: string, mekanik: string): Promise<Antrean> {
    const res = await api.patch<ApiWorkOrder>(`/api/v1/work-orders/${id}/mechanic`, {
      mekanik,
    });
    return mapWorkOrder(res.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/work-orders/${id}`);
  },
};
