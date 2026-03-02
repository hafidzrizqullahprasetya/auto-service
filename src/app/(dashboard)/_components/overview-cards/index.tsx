import { getWorkshopOverview } from "@/mock/dashboard-fetcher";
import { StatCard } from "@/components/Bengkel/Dashboard/StatCard";
import { Icons } from "@/components/Icons";

export async function OverviewCardsGroup() {
  const data = await getWorkshopOverview();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <StatCard
        title="Antrean Aktif"
        value={data.activeQueue.value}
        icon={<Icons.Antrean size={24} />}
        growth={{
          value: data.activeQueue.growth,
          isUp: data.activeQueue.isUp
        }}
      />

      <StatCard
        title="Kendaraan Selesai"
        value={data.completedTasks.value}
        icon={<Icons.Success size={24} />}
        growth={{
          value: data.completedTasks.growth,
          isUp: data.completedTasks.isUp
        }}
      />

      <StatCard
        title="Pendapatan Hari Ini"
        value={data.dailyRevenue.value}
        icon={<Icons.Cash size={24} />}
        growth={{
          value: data.dailyRevenue.growth,
          isUp: data.dailyRevenue.isUp
        }}
      />

      <StatCard
        title="Menunggu Sparepart"
        value={data.pendingSpareparts.value}
        icon={<Icons.Inventory size={24} />}
        growth={{
          value: data.pendingSpareparts.growth,
          isUp: data.pendingSpareparts.isUp
        }}
      />
    </div>
  );
}
