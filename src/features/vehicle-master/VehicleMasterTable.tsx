"use client";

import { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Icons } from "@/components/Icons";
import { vehicleMasterService, VehicleMaster } from "@/services/vehicle-master.service";
import { ActionButton } from "@/features/shared";
import { Notify } from "@/utils/notify";

export function VehicleMasterTable() {
  const [data, setData] = useState<VehicleMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMasters = async () => {
    setIsLoading(true);
    try {
      const masters = await vehicleMasterService.getAll();
      setData(masters);
    } catch (err) {
      Notify.alert("Error", "Gagal memuat data master kendaraan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  const columns = useMemo<ColumnDef<VehicleMaster>[]>(
    () => [
      {
        accessorKey: "brand",
        header: "Merk / Brand",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white">
              <Icons.Tag size={20} />
            </div>
            <span className="text-sm font-bold uppercase text-dark dark:text-white">
              {row.original.brand}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "model",
        header: "Model Unit",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
            {row.original.model}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Ditambahkan Pada",
        cell: ({ row }) => (
          <span className="text-xs text-dark-5">
            {new Date(row.original.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Opsi</div>,
        cell: () => (
          <div className="flex w-full items-center justify-center gap-2">
            <ActionButton
              icon={<Icons.Edit size={16} />}
              variant="edit"
              onClick={() => Notify.toast("Fitur edit master data di menu utama segera hadir")}
              title="Edit"
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchable={["brand", "model"]}
      searchPlaceholder="Cari merk atau model..."
      title="Master Data Kendaraan"
      description="Daftar merk dan model kendaraan yang terdaftar dalam sistem"
      pageSize={10}
      primaryAction={{
        label: "Refresh Data",
        onClick: fetchMasters,
      }}
    />
  );
}
