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
      const res = await api.get<any>("/reports/dashboard-stats");
      const data = res.data;
      if (typeof data.dailyRevenue?.value === 'string') {
        data.dailyRevenue.value = stripFormatting(data.dailyRevenue.value);
      }

      return data;
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
