import { Icons } from "@/components/Icons";
import { useTransactions } from "@/hooks/useTransactions";
import { useSettings } from "@/hooks/useSettings";
import { StatCard } from "@/features/shared";
import { TransactionSummarySkeleton } from "./TransactionSummarySkeleton";

export function TransactionSummary() {
  const { data: transactions, loading: loadingTransactions } = useTransactions();
  const { data: settings, loading: loadingSettings } = useSettings();

  if (loadingTransactions || loadingSettings) return <TransactionSummarySkeleton />;

  const totalRevenue = transactions.reduce((a, t) => a + (t.total || 0), 0);
  const totalTax = transactions.reduce((a, t) => a + (t.tax || 0), 0);
  const totalSubtotal = transactions.reduce((a, t) => a + (t.subtotal || 0), 0);
  const txCount = transactions.length;
  const taxRate = settings?.tax_percentage ?? 11;

  const stats = [
    {
      label: "Total Pendapatan",
      value: totalRevenue,
      icon: <Icons.Kasir size={24} />,
      color: "text-slate-600",
      bg: "bg-slate-100",
      isMoney: true,
    },
    {
      label: "Nilai Sebelum Pajak",
      value: totalSubtotal,
      icon: <Icons.Chart size={24} />,
      color: "text-slate-600",
      bg: "bg-slate-100",
      isMoney: true,
    },
    {
      label: `Total PPN (${taxRate}%)`,
      value: totalTax,
      icon: <Icons.Tag size={24} />,
      color: "text-slate-600",
      bg: "bg-slate-100",
      isMoney: true,
    },
    {
      label: "Volume Transaksi",
      value: txCount,
      icon: <Icons.Print size={24} />,
      color: "text-slate-600",
      bg: "bg-slate-100",
      suffix: "Nota",
      isMoney: false,
    },
  ];

  return (
    <div className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
