import { api } from "@/lib/api";
import { PurchaseOrder } from "@/types/purchase-order";

export interface CreatePOItem {
  sku: string;
  nama: string;
  qty: number;
  hargaSatuan: number;
  spare_part_id?: number | null;
}

export interface CreatePOBody {
  noPO: string;
  tanggal: string;
  supplier: string;
  estimasiTiba?: string | null;
  catatan?: string;
  items: CreatePOItem[];
}

export const purchaseOrdersService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    try {
      const res = await api.get<PurchaseOrder[]>("/api/v1/inventory/purchase-orders");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch purchase orders", err);
      return [];
    }
  },

  create: async (body: CreatePOBody): Promise<PurchaseOrder> => {
    const res = await api.post<PurchaseOrder>("/api/v1/inventory/purchase-orders", body);
    return res.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/api/v1/inventory/purchase-orders/${id}`);
  },
};
