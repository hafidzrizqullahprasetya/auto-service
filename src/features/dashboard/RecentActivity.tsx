"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { api } from "@/lib/api";

dayjs.extend(relativeTime);
dayjs.locale("id");

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

export function RecentActivity({ className }: { className?: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await api.get<ActivityItem[]>("/reports/recent-activities");
        setActivities(res.data || []);
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <div className={cn(
      "col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5",
      className
    )}>
      <h2 className="mb-5.5 px-7.5 text-lg font-bold text-dark dark:text-white">
        Aktivitas Bengkel
      </h2>

      <div className="px-7.5">
        <div className="space-y-6">
          {loading ? (
             Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                   <div className="h-10 w-10 shrink-0 rounded-full bg-gray-2 dark:bg-dark-3" />
                   <div className="flex-1 space-y-2">
                       <div className="h-3 w-1/3 bg-gray-2 dark:bg-dark-3 rounded" />
                       <div className="h-2 w-full bg-gray-2 dark:bg-dark-3 rounded" />
                   </div>
                </div>
             ))
          ) : activities.length === 0 ? (
             <p className="text-center py-8 text-sm text-dark-5">Belum ada aktivitas</p>
          ) : activities.map((activity) => {
            const IconComp = (Icons as any)[activity.icon] || Icons.Search;
            return (
              <div key={activity.id} className="flex gap-4">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  activity.color
                )}>
                  <IconComp size={16} />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-dark dark:text-white">
                      {activity.title}
                    </h4>
                    <span className="text-[10px] font-medium text-dark-5 dark:text-dark-6">
                      {dayjs(activity.time).fromNow()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-dark-4 dark:text-dark-6">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-8 flex w-full items-center justify-center rounded-md border border-stroke py-2 text-sm font-bold text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white transition-all">
          Lihat Semua Aktivitas
        </button>
      </div>
    </div>
  );
}
