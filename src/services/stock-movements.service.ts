import { api } from "@/lib/api";
import { StockMovement } from "@/mock/stock-movements";

/**
 * API response type from backend
 * Backend returns camelCase or snake_case, adjust mapping as needed
 */
export interface ApiStockMovement {
  id: number;
  spare_part_id: number;
  spare_part_name?: string;
  sku?: string;
  /** Nested join from BE include({ spare_parts: { select: { name, sku } } }) */
  spare_parts?: { name?: string; sku?: string };
  type: "masuk" | "keluar" | "opname_adjustment";
  quantity_change: number;
  stock_before: number;
  stock_after: number;
  note?: string;
  reference_id?: string;
  reference_type?: "transaction" | "opname" | "manual";
  created_by?: string;
  created_at: string;
}

/** Map API StockMovement → FE StockMovement */
export function mapStockMovement(m: ApiStockMovement): StockMovement {
  return {
    id: m.id.toString(),
    sparePartId: m.spare_part_id.toString(),
    sparePartName: m.spare_parts?.name || m.spare_part_name || "Unknown",
    sku: m.spare_parts?.sku || m.sku || "—",
    type: m.type,
    quantityChange: m.quantity_change,
    stockBefore: m.stock_before,
    stockAfter: m.stock_after,
    note: m.note || "",
    referenceId: m.reference_id,
    referenceType: m.reference_type,
    createdBy: m.created_by || "System",
    createdAt: m.created_at,
  };
}

export const stockMovementService = {
  async stockIn(body: {
    spare_part_id: number;
    quantity: number;
    note?: string;
  }): Promise<void> {
    await api.post("/api/v1/stock/in", body);
  },

  async stockOut(body: {
    spare_part_id: number;
    quantity: number;
    note?: string;
  }): Promise<void> {
    await api.post("/api/v1/stock/out", body);
  },

  async getAll(params?: {
    sparePart_id?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<StockMovement[]> {
    const q = new URLSearchParams();
    if (params?.sparePart_id) q.set("spare_part_id", params.sparePart_id);
    if (params?.type) q.set("type", params.type);
    if (params?.start_date) q.set("start_date", params.start_date);
    if (params?.end_date) q.set("end_date", params.end_date);
    const qs = q.toString();
    const res = await api.get<ApiStockMovement[]>(
      `/api/v1/stock-movements${qs ? "?" + qs : ""}`,
    );
    return (res.data ?? []).map(mapStockMovement);
  },
};
