import { api } from "@/lib/api";
import { ApiSparePart, ApiCategory } from "@/types/api";
import { Item } from "@/types/inventory";

export function mapSparePart(sp: ApiSparePart): Item {
  const catName = sp.category?.name?.toLowerCase() ?? "";
  let category: Item["category"] = "Part";
  if (
    catName.includes("oli") ||
    catName.includes("oil") ||
    catName.includes("minyak")
  ) {
    category = "Oil";
  } else if (
    catName.includes("jasa") ||
    catName.includes("service") ||
    catName.includes("servis")
  ) {
    category = "Service";
  }

  return {
    id: sp.id.toString(),
    sku: sp.sku,
    name: sp.name,
    categoryId: sp.category_id ?? undefined,
    categoryName: sp.category?.name,
    category,
    costPrice: Number(sp.cost_price),
    price: Number(sp.sell_price),
    stock: sp.current_stock,
    minimumStock: sp.minimum_stock,
    unit: sp.unit,
    type: "Umum",
  };
}

/** Map FE Item → BE create body */
export interface SparePartBody {
  category_id: number | null;
  name: string;
  cost_price: number;
  sell_price: number;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}

export const inventoryService = {
  async getAll(params?: {
    category_id?: string;
    search?: string;
    low_stock?: boolean;
  }): Promise<Item[]> {
    const q = new URLSearchParams();
    if (params?.category_id) q.set("category_id", params.category_id);
    if (params?.search) q.set("search", params.search);
    if (params?.low_stock) q.set("low_stock", "true");
    const qs = q.toString();
    const res = await api.get<ApiSparePart[]>(
      `/api/v1/spare-parts${qs ? "?" + qs : ""}`,
    );
    return (res.data ?? []).map(mapSparePart);
  },

  async create(body: SparePartBody): Promise<Item> {
    const res = await api.post<ApiSparePart>("/api/v1/spare-parts", body);
    return mapSparePart(res.data);
  },

  async update(id: string, body: Partial<SparePartBody>): Promise<Item> {
    const res = await api.put<ApiSparePart>(`/api/v1/spare-parts/${id}`, body);
    return mapSparePart(res.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/spare-parts/${id}`);
  },

  /** Get raw spare part by id (with stock history) */
  async getById(id: string): Promise<ApiSparePart> {
    const res = await api.get<ApiSparePart>(`/api/v1/spare-parts/${id}`);
    return res.data;
  },

  async getCategories(): Promise<ApiCategory[]> {
    const res = await api.get<ApiCategory[]>("/api/v1/categories");
    return res.data ?? [];
  },

  async createCategory(name: string): Promise<ApiCategory> {
    const res = await api.post<ApiCategory>("/api/v1/categories", { name });
    return res.data;
  },
};
