import { Icons } from "@/components/Icons";
import { useTransactions } from "@/hooks/useTransactions";
import { StatCard } from "@/features/shared";
import { TransactionSummarySkeleton } from "./TransactionSummarySkeleton";

export function TransactionSummary() {
  const { data: transactions, loading } = useTransactions();

  if (loading) return <TransactionSummarySkeleton />;

  const totalRevenue = transactions.reduce((a, t) => a + t.total, 0);
  const totalTax = transactions.reduce((a, t) => a + (t.tax || 0), 0);
  const totalSubtotal = totalRevenue - totalTax;
  const txCount = transactions.length;

  const stats = [
    {
      label: "Total Pendapatan",
      value: totalRevenue,
      icon: <Icons.Kasir size={24} />,
      color: "text-secondary",
      bg: "bg-secondary/10",
      isMoney: true,
    },
    {
      label: "Nilai Sebelum Pajak",
      value: totalSubtotal,
      icon: <Icons.Chart size={24} />,
      color: "text-primary",
      bg: "bg-primary/10",
      isMoney: true,
    },
    {
      label: "Total PPN (11%)",
      value: totalTax,
      icon: <Icons.Tag size={24} />,
      color: "text-warning",
      bg: "bg-warning/10",
      isMoney: true,
    },
    {
      label: "Volume Transaksi",
      value: txCount,
      icon: <Icons.Print size={24} />,
      color: "text-success",
      bg: "bg-success/10",
      suffix: "Nota",
      isMoney: false,
    },
  ];

  return (
    <div className="hidden sm:grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
