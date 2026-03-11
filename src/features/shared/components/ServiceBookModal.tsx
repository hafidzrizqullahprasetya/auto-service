import { Icons } from "@/components/Icons";
import { ServiceRecord } from "@/types/vehicle";
import { formatNumber } from "@/utils/format-number";
import dayjs from "dayjs";

interface ServiceBookModalProps {
  plateNumber: string;
  history: ServiceRecord[];
  onClose: () => void;
}

export function ServiceBookModal({ plateNumber, history, onClose }: ServiceBookModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-dark border border-stroke dark:border-dark-3 flex flex-col translate-y-0 opacity-100 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke p-5 dark:border-dark-3 bg-gray-50 dark:bg-dark-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icons.History size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark dark:text-white">
                Buku Servis Digital
              </h3>
              <p className="text-sm font-medium text-dark-5 dark:text-dark-6 uppercase tracking-wider">
                Unit: <span className="text-secondary font-black">{plateNumber}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
          >
            <Icons.Plus size={24} className="rotate-45" />
          </button>
        </div>

        {/* Content - Timeline Style */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {history.length > 0 ? (
            history.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()).map((record, index) => (
              <div key={record.id} className="relative pl-8">
                {/* Timeline connector */}
                {index !== history.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-32px] w-[2px] bg-stroke dark:bg-dark-3" />
                )}
                
                {/* Dot */}
                <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white dark:border-gray-dark bg-secondary z-10" />

                <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-dark-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div>
                      <span className="text-xs font-bold text-dark-5 dark:text-dark-6 bg-gray-2 dark:bg-dark-3 px-2 py-0.5 rounded">
                        {dayjs(record.date).format("DD MMM YYYY")}
                      </span>
                      <h4 className="mt-1 text-base font-black text-dark dark:text-white uppercase">
                        {record.serviceType}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-secondary">
                        Rp {formatNumber(record.cost)}
                      </p>
                      <p className="text-[10px] font-medium text-dark-5">
                        ODO: <span className="text-dark dark:text-white">{record.km.toLocaleString()} KM</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {record.items.map(item => (
                      <span key={item} className="text-[10px] bg-primary/5 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-medium">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-dark-5 border-t border-stroke dark:border-dark-3 pt-3">
                    <div className="flex items-center gap-1">
                      <Icons.Karyawan size={12} />
                      Mekanik: <span className="font-bold text-dark dark:text-white ml-0.5">{record.mechanic}</span>
                    </div>
                    {record.notes && (
                      <div className="flex items-center gap-1">
                        <Icons.Warning size={12} className="text-orange-500" />
                        Catatan: <span className="italic">{record.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <Icons.History size={64} />
              <p className="mt-4 font-bold">Belum ada riwayat servis untuk unit ini.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stroke p-5 dark:border-dark-3 bg-gray-50 dark:bg-dark-2 flex justify-end">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-md border border-stroke bg-white px-5 py-2 text-sm font-bold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition-all active:scale-95"
          >
            <Icons.Print size={16} />
            Cetak Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}
