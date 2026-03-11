import { api } from "@/lib/api";

export interface DashboardStats {
  activeQueue: { value: number; growth: number; isUp: boolean };
  completedTasks: { value: number; growth: number; isUp: boolean };
  dailyRevenue: { value: string; growth: number; isUp: boolean };
  pendingSpareparts: { value: number; growth: number; isUp: boolean };
}

export const dashboardService = {
  getOverview: async (): Promise<DashboardStats> => {
    try {
      const res = await api.get<DashboardStats>("/reports/dashboard-stats");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      // Fallback to empty values if API fails
      return {
        activeQueue: { value: 0, growth: 0, isUp: true },
        completedTasks: { value: 0, growth: 0, isUp: true },
        dailyRevenue: { value: "Rp 0", growth: 0, isUp: true },
        pendingSpareparts: { value: 0, growth: 0, isUp: true }
      };
    }
  },
};
