import { api } from "@/lib/api";
import { PurchaseOrder } from "@/types/purchase-order";

export const purchaseOrdersService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    try {
      const res = await api.get<PurchaseOrder[]>("/inventory/purchase-orders");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch purchase orders", err);
      return [];
    }
  },
};
