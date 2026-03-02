import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

const ACTIVITIES = [
  {
    id: 1,
    type: "service",
    title: "Servis Selesai",
    description: "Toyota Avanza B 1234 ABC telah selesai dikerjakan oleh Suryo.",
    time: "10 menit yang lalu",
    icon: <Icons.Success size={16} />,
    color: "bg-green/10 text-green",
  },
  {
    id: 2,
    type: "inventory",
    title: "Stok Menipis",
    description: "Stok Oli Shell Helix HX7 sisa 5 botol. Segera restock!",
    time: "1 jam yang lalu",
    icon: <Icons.Warning size={16} />,
    color: "bg-red/10 text-red",
  },
  {
    id: 3,
    type: "customer",
    title: "Pelanggan Baru",
    description: "Siska Putri telah terdaftar sebagai pelanggan baru.",
    time: "3 jam yang lalu",
    icon: <Icons.Pelanggan size={16} />,
    color: "bg-primary/10 text-primary",
  },
  {
    id: 4,
    type: "payment",
    title: "Pembayaran Diterima",
    description: "Invoice #INV/20240524/002 telah dibayar lunas via Transfer.",
    time: "5 jam yang lalu",
    icon: <Icons.Cash size={16} />,
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: 5,
    type: "queue",
    title: "Antrean Masuk",
    description: "Honda Vario F 2024 VIX baru saja masuk ke antrean.",
    time: "Kemarin",
    icon: <Icons.Antrean size={16} />,
    color: "bg-blue/10 text-blue",
  },
];

export function RecentActivity({ className }: { className?: string }) {
  return (
    <div className={cn(
      "col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5",
      className
    )}>
      <h2 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white">
        Aktivitas Bengkel
      </h2>

      <div className="px-7.5">
        <div className="space-y-6">
          {ACTIVITIES.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                activity.color
              )}>
                {activity.icon}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-dark dark:text-white">
                    {activity.title}
                  </h4>
                  <span className="text-[10px] font-medium text-dark-5 dark:text-dark-6">
                    {activity.time}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-dark-4 dark:text-dark-6">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-8 flex w-full items-center justify-center rounded-md border border-stroke py-2 text-sm font-bold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white transition-all">
          Lihat Semua Aktivitas
        </button>
      </div>
    </div>
  );
}
