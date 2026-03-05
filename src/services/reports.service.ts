import { api } from "@/lib/api";
import { ApiRevenueReport, ApiTopProduct, ApiLowStockItem } from "@/types/api";

export const reportsService = {
  async getRevenue(params?: {
    period?: "daily" | "monthly";
    date?: string;
  }): Promise<ApiRevenueReport> {
    const q = new URLSearchParams();
    if (params?.period) q.set("period", params.period);
    if (params?.date) q.set("date", params.date);
    const qs = q.toString();
    const res = await api.get<ApiRevenueReport>(
      `/reports/revenue${qs ? "?" + qs : ""}`,
    );
    return res.data;
  },

  async getTopProducts(): Promise<ApiTopProduct[]> {
    const res = await api.get<ApiTopProduct[]>("/reports/top-products");
    return res.data ?? [];
  },

  async getLowStock(): Promise<ApiLowStockItem[]> {
    const res = await api.get<ApiLowStockItem[]>("/reports/low-stock");
    return res.data ?? [];
  },
};
