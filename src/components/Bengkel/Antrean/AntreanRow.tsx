import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Antrean } from "@/mock/antrean";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { ActionButton } from "@/components/Bengkel/shared";

interface AntreanRowProps {
  item: Antrean;
}

export function AntreanRow({ item }: AntreanRowProps) {
  const getStatusVariant = (status: Antrean["status"]) => {
    switch (status) {
      case "Selesai": return "success";
      case "Menunggu": return "danger";
      case "Dikerjakan": return "secondary";
      case "Menunggu Sparepart": return "warning";
      default: return "primary";
    }
  };

  return (
    <TableRow className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-2 text-dark dark:text-white group-hover:bg-primary group-hover:text-white transition-all">
            {item.tipe === "Mobil" ? <Icons.KendaraanMobil size={20} /> : <Icons.KendaraanMotor size={20} />}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-dark dark:text-white text-base">
              {item.noPolisi}
            </span>
            <Badge 
              variant={item.tipe === "Mobil" ? "info" : "secondary"} 
              className="mt-0.5 text-[8px] px-1.5 py-0"
            >
              {item.tipe}
            </Badge>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-left font-medium">
        {item.kendaraan}
      </TableCell>

      <TableCell className="text-left">
        {item.pelanggan}
      </TableCell>

      <TableCell className="text-left">
        <p className="text-sm font-medium text-dark-4 dark:text-dark-6">{item.layanan}</p>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2 text-dark dark:text-white text-sm tabular-nums px-4 justify-start">
          <Icons.Pending size={14} className="text-dark-5" />
          {dayjs(item.waktuMasuk).format("HH:mm")}
        </div>
      </TableCell>

      <TableCell className="text-center">
        <Badge variant={getStatusVariant(item.status)}>
          {item.status}
        </Badge>
      </TableCell>

      <TableCell className="text-right pr-4">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionButton 
            icon={<Icons.Print size={18} />} 
            variant="primary" 
            title="Cetak SPK" 
          />
          <ActionButton 
            icon={<Icons.Repair size={18} />} 
            variant="secondary" 
            title="Update Status" 
          />
          <ActionButton 
            icon={<Icons.Delete size={18} />} 
            variant="danger" 
            title="Batalkan" 
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
