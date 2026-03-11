import { api } from "@/lib/api";

export const getWorkshopOverview = async () => {
  try {
    const res = await api.get<any>("/reports/dashboard-stats");
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
};
