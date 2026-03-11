import { StatCard } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { StockMovement } from "@/types/stock-movement";

interface StockSummaryProps {
  movements: StockMovement[];
  loading?: boolean;
}

export function StockSummary({ movements, loading = false }: StockSummaryProps) {
  const totalMasuk = movements
    .filter((m) => m.type === "masuk")
    .reduce((s, m) => s + m.quantityChange, 0);
  const totalKeluar = movements
    .filter((m) => m.type === "keluar")
    .reduce((s, m) => s + Math.abs(m.quantityChange), 0);

  const stats = [
    {
      label: "Total Masuk",
      value: totalMasuk,
      suffix: "unit",
      icon: <Icons.ArrowUp size={20} />,
    },
    {
      label: "Total Keluar",
      value: totalKeluar,
      suffix: "unit",
      icon: <Icons.ArrowDown size={20} />,
    },
    {
      label: "Total Transaksi",
      value: movements.length,
      suffix: "entri",
      icon: <Icons.History size={20} />,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {stats.map(({ label, value, suffix, icon }) => (
        <StatCard
          key={label}
          label={label}
          value={value}
          suffix={suffix}
          icon={icon}
          loading={loading}
          variant="horizontal"
        />
      ))}
    </div>
  );
}
