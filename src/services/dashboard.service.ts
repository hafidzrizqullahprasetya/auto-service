import { api } from "@/lib/api";
import { stripFormatting } from "@/utils/format-number";

export interface DashboardStats {
  activeQueue: { value: number; growth: number; isUp: boolean };
  completedTasks: { value: number; growth: number; isUp: boolean };
  dailyRevenue: { value: number; growth: number; isUp: boolean };
  pendingSpareparts: { value: number; growth: number; isUp: boolean };
}

export const dashboardService = {
  getOverview: async (): Promise<DashboardStats> => {
    try {
      const res = await api.get<any>("/reports/dashboard-stats", true);
      const data = res?.data;
      if (!data) {
        throw new Error("No dashboard data returned");
      }

      const activeQueue = {
        value: Number(data.activeQueue?.value ?? 0),
        growth: Number(data.activeQueue?.growth ?? 0),
        isUp: Boolean(data.activeQueue?.isUp ?? true),
      };

      const completedTasks = {
        value: Number(data.completedTasks?.value ?? 0),
        growth: Number(data.completedTasks?.growth ?? 0),
        isUp: Boolean(data.completedTasks?.isUp ?? true),
      };

      let rawRevenue = data.dailyRevenue?.value ?? 0;
      if (typeof rawRevenue === "string") {
        rawRevenue = stripFormatting(rawRevenue);
      }
      const dailyRevenue = {
        value: Number(rawRevenue),
        growth: Number(data.dailyRevenue?.growth ?? 0),
        isUp: Boolean(data.dailyRevenue?.isUp ?? true),
      };

      const pendingSpareparts = {
        value: Number(data.pendingSpareparts?.value ?? 0),
        growth: Number(data.pendingSpareparts?.growth ?? 0),
        isUp: Boolean(data.pendingSpareparts?.isUp ?? true),
      };

      return {
        activeQueue,
        completedTasks,
        dailyRevenue,
        pendingSpareparts,
      };
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      return {
        activeQueue: { value: 0, growth: 0, isUp: true },
        completedTasks: { value: 0, growth: 0, isUp: true },
        dailyRevenue: { value: 0, growth: 0, isUp: true },
        pendingSpareparts: { value: 0, growth: 0, isUp: true }
      };
    }
  },
};
