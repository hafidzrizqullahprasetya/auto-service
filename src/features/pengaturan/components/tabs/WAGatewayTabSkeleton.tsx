import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "./SectionCard";

export function WAGatewayTabSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Bagian Atas: Koneksi (Full Width) */}
      <SectionCard title="Koneksi WhatsApp Web">
        <div className="flex flex-col gap-8 py-2 md:flex-row md:items-stretch lg:gap-12">
          {/* Sisi Kiri: Profil Bot / QR */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-gray-1 p-6 dark:border-dark-3 dark:bg-dark-2 md:w-60">
            <div className="flex flex-col items-center gap-3 w-full">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex flex-col items-center gap-1 w-full">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Status & Actions */}
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-px flex-1" />
              </div>
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-12 w-40 rounded-xl" />
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Bagian Bawah: Grid 2 Kolom */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Kolom Kiri: Form */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <SectionCard title="Pengaturan Bot & Notifikasi">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
              <div className="space-y-2 pt-4 border-t border-stroke dark:border-dark-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Template Notifikasi Layanan">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </SectionCard>
          
          <div className="flex justify-end">
            <Skeleton className="h-12 w-40 rounded-lg" />
          </div>
        </div>

        {/* Kolom Kanan: Log */}
        <div className="xl:col-span-5 flex flex-col">
          <SectionCard title="Log Notifikasi WA">
            <div className="space-y-3">
              <div className="flex justify-end">
                <Skeleton className="h-3 w-24" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-lg border border-stroke p-4 dark:border-dark-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-12 rounded" />
                  </div>
                  <Skeleton className="h-12 w-full rounded" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
