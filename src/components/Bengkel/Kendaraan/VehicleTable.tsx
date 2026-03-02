"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_VEHICLES, Vehicle } from "@/mock/vehicles";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/components/Bengkel/shared";
import { ServiceHistoryModal } from "@/components/Bengkel/shared";
import { VehicleFormModal } from "@/components/Bengkel/Kendaraan";

export function VehicleTable() {
  const [historyVehicle, setHistoryVehicle] = useState<Vehicle | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        id: "no",
        header: () => <div className="text-center">No.</div>,
        cell: ({ row }) => (
          <div className="text-center font-bold text-dark-5">
            {row.index + 1}
          </div>
        ),
        size: 50,
      },
      {
        accessorKey: "plateNumber",
        header: "No. Polisi",
        cell: ({ row }) => {
          const v = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-3 text-dark dark:text-white border border-stroke dark:border-dark-4">
                {v.type === "Mobil" ? (
                  <Icons.KendaraanMobil size={22} />
                ) : (
                  <Icons.KendaraanMotor size={22} />
                )}
              </div>
              <span className="font-black text-dark dark:text-white text-lg tracking-widest uppercase leading-none">
                {v.plateNumber}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "brand",
        header: "Unit / Merk",
        cell: ({ row }) => {
          const v = row.original;
          return (
            <div className="flex flex-col">
              <p className="font-bold text-sm text-dark dark:text-white uppercase tracking-tight">
                {v.brand} {v.model}
              </p>
              <span className="text-[10px] font-bold text-dark-5 uppercase tracking-wider">{v.color}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "ownerId",
        header: () => <div className="text-center">Pemilik</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-black py-0.5 px-2 bg-gray-2 dark:bg-dark-3 rounded text-dark-5 border border-stroke uppercase tracking-tighter">
              ID: {row.original.ownerId}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "year",
        header: () => <div className="text-center">Tahun</div>,
        cell: ({ row }) => (
          <div className="text-center font-black text-dark dark:text-white">
            {row.original.year}
          </div>
        ),
      },
      {
        accessorKey: "lastServiceKm",
        header: "Odo Terakhir",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm font-black text-secondary">
            <Icons.Repair size={14} />
            {row.original.lastServiceKm.toLocaleString()} <span className="text-[9px] uppercase font-bold text-dark-5">KM</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Opsi</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <ActionButton
              onClick={() => setHistoryVehicle(row.original)}
              variant="secondary"
              icon={<Icons.History size={14} />}
              label="Riwayat"
            />
            <ActionButton
              icon={<Icons.Settings size={16} />}
              variant="outline"
              onClick={() => setEditVehicle(row.original)}
              title="Edit Kendaraan"
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={MOCK_VEHICLES}
        searchable={["plateNumber", "brand", "model"]}
        searchPlaceholder="Cari plat nomor atau merk..."
        title="Data Kendaraan & Service Book"
        description="Daftar seluruh kendaraan pelanggan beserta riwayat servis"
        primaryAction={{
          label: "Registrasi Baru",
          onClick: () => setShowRegModal(true),
        }}
      />

      {historyVehicle && (
        <ServiceHistoryModal
          noPolisi={historyVehicle.plateNumber}
          kendaraan={`${historyVehicle.brand} ${historyVehicle.model}`}
          onClose={() => setHistoryVehicle(null)}
        />
      )}

      {(showRegModal || editVehicle) && (
        <VehicleFormModal
          mode={editVehicle ? "edit" : "create"}
          initialData={editVehicle || undefined}
          onClose={() => {
            setShowRegModal(false);
            setEditVehicle(null);
          }}
          onSave={(data) => {
            console.log("Saving:", data);
            setShowRegModal(false);
            setEditVehicle(null);
          }}
        />
      )}
    </>
  );
}
