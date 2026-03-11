import { Icons } from "@/components/Icons";
import { Antrean } from "@/types/antrean";
import { StatCard } from "@/features/shared";

interface QueueSummaryProps {
  items: Antrean[];
}

export function QueueSummary({ items }: QueueSummaryProps) {
  const stats = [
    {
      label: "Menunggu",
      value: items.filter((i) => i.status === "Menunggu").length,
      icon: <Icons.Pending size={24} />,
      color: "text-red",
      bg: "bg-red/10",
      suffix: "Unit"
    },
    {
      label: "Dikerjakan",
      value: items.filter((i) => i.status === "Dikerjakan").length,
      icon: <Icons.Repair size={24} />,
      color: "text-primary",
      bg: "bg-primary/10",
      suffix: "Unit"
    },
    {
      label: "Sparepart",
      value: items.filter((i) => i.status === "Menunggu Sparepart").length,
      icon: <Icons.Inventory size={24} />,
      color: "text-warning",
      bg: "bg-warning/10",
      suffix: "Unit"
    },
    {
      label: "Selesai",
      value: items.filter((i) => i.status === "Selesai").length,
      icon: <Icons.Success size={24} />,
      color: "text-green",
      bg: "bg-green/10",
      suffix: "Unit"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
