import { api } from "@/lib/api";
import { StockOpname, OpnameItem } from "@/types/opname";

/**
 * API response types from backend
 */
export interface ApiOpnameItem {
  id: number;
  opname_id: number;
  spare_part_id: number;
  spare_part_name?: string;
  sku?: string;
  system_stock: number;
  physical_count?: number;
  difference?: number;
  note?: string;
}

export interface ApiStockOpname {
  id: number;
  session_name: string;
  status: "open" | "closed";
  opened_by?: string;
  opened_at: string;
  closed_at?: string;
  items?: ApiOpnameItem[];
  total_items?: number;
  total_difference?: number;
}

/** Map API OpnameItem → FE OpnameItem */
export function mapOpnameItem(item: ApiOpnameItem): OpnameItem {
  const physicalCount = item.physical_count ?? item.system_stock;
  const difference =
    item.difference !== undefined
      ? item.difference
      : physicalCount - item.system_stock;
  return {
    id: item.id.toString(),
    sparePartId: item.spare_part_id.toString(),
    sparePartName: item.spare_part_name || "Unknown",
    sku: item.sku || "—",
    systemStock: item.system_stock,
    physicalCount,
    difference,
    note: item.note || "",
  };
}

/** Map API StockOpname → FE StockOpname */
export function mapStockOpname(o: ApiStockOpname): StockOpname {
  const items = (o.items ?? []).map(mapOpnameItem);
  const totalDifference = items.reduce((sum, i) => sum + i.difference, 0);
  return {
    id: o.id.toString(),
    sessionName: o.session_name,
    status: o.status,
    openedBy: o.opened_by || "System",
    openedAt: o.opened_at,
    closedAt: o.closed_at,
    items,
    totalItems: o.total_items ?? items.length,
    totalDifference: o.total_difference ?? totalDifference,
  };
}

export interface CreateOpnameBody {
  session_name: string;
  opened_by?: string;
}

export interface AddOpnameItemBody {
  spare_part_id: number;
  physical_count?: number;
  note?: string;
}

export interface UpdateOpnameItemBody {
  physical_count?: number;
  note?: string;
}

export const opnameService = {
  async getAll(): Promise<StockOpname[]> {
    const res = await api.get<ApiStockOpname[]>("/api/v1/opnames");
    return (res.data ?? []).map(mapStockOpname);
  },

  async getById(id: string): Promise<StockOpname> {
    const res = await api.get<ApiStockOpname>(`/api/v1/opnames/${id}`);
    return mapStockOpname(res.data);
  },

  async create(body: CreateOpnameBody): Promise<StockOpname> {
    const res = await api.post<ApiStockOpname>("/api/v1/opnames", body);
    return mapStockOpname(res.data);
  },

  async addItem(
    opnameId: string,
    body: AddOpnameItemBody,
  ): Promise<OpnameItem> {
    const res = await api.post<ApiOpnameItem>(
      `/api/v1/opnames/${opnameId}/items`,
      body,
    );
    return mapOpnameItem(res.data);
  },

  async updateItem(
    opnameId: string,
    itemId: string,
    body: UpdateOpnameItemBody,
  ): Promise<OpnameItem> {
    const res = await api.put<ApiOpnameItem>(
      `/api/v1/opnames/${opnameId}/items/${itemId}`,
      body,
    );
    return mapOpnameItem(res.data);
  },

  async closeOpname(opnameId: string): Promise<StockOpname> {
    const res = await api.post<ApiStockOpname>(
      `/api/v1/opnames/${opnameId}/close`,
      {},
    );
    return mapStockOpname(res.data);
  },
};
