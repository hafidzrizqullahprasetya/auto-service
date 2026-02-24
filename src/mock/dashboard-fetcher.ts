export const getWorkshopOverview = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    activeQueue: {
      value: 12,
      growth: 15,
      isUp: true
    },
    completedTasks: {
      value: 45,
      growth: 8,
      isUp: true
    },
    dailyRevenue: {
      value: "Rp 4.5M",
      growth: 12,
      isUp: true
    },
    pendingSpareparts: {
      value: 3,
      growth: 5,
      isUp: false
    }
  };
};
