"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_VEHICLES, Vehicle } from "@/mock/vehicles";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/Bengkel/shared";
import { ServiceBookModal } from "@/components/Bengkel/shared";
import { ServiceHistoryModal } from "@/components/Bengkel/shared";
import { ActionButton } from "@/components/Bengkel/shared";
import { TableToolbar } from "@/components/Bengkel/shared";
import { VehicleFormModal } from "@/components/Bengkel/Kendaraan";

export function VehicleTable() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [historyVehicle, setHistoryVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegModal, setShowRegModal] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_VEHICLES.filter(vehicle => 
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <TableToolbar 
        title="Data Kendaraan & Service Book"
        description="Daftar seluruh kendaraan pelanggan beserta riwayat servis digital"
        onSearch={setSearchTerm}
        searchPlaceholder="Cari plat nomor atau merk..."
        primaryAction={{
          label: "Registrasi Baru",
          onClick: () => setShowRegModal(true),
        }}
      />

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="font-bold text-left">No. Polisi</TableHead>
              <TableHead className="min-w-[180px] font-bold text-left">Merk / Model</TableHead>
              <TableHead className="font-bold text-left">Pemilik</TableHead>
              <TableHead className="font-bold text-center px-4">Tahun</TableHead>
              <TableHead className="font-bold text-left px-4">Odo Terakhir</TableHead>
              <TableHead className="text-right font-bold pr-4">Opsi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((vehicle) => (
                <TableRow key={vehicle.id} className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group">
                  <TableCell className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-2 text-dark dark:text-white group-hover:bg-primary group-hover:text-white transition-all">
                        {vehicle.type === "Mobil" ? <Icons.KendaraanMobil size={20} /> : <Icons.KendaraanMotor size={20} />}
                      </div>
                      <span className="font-black text-dark dark:text-white text-base tracking-wider uppercase">
                        {vehicle.plateNumber}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-left">
                    <div className="flex flex-col">
                      <p className="font-bold text-dark dark:text-white">{vehicle.brand} {vehicle.model}</p>
                      <span className="text-[10px] text-dark-5 font-medium">{vehicle.color}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Icons.Pelanggan size={12} className="text-secondary" />
                      </div>
                      <span className="text-sm font-medium text-dark-4 dark:text-dark-6">ID: {vehicle.ownerId}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <span className="text-sm font-medium text-dark dark:text-white">{vehicle.year}</span>
                  </TableCell>

                  <TableCell className="text-left px-4">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-dark dark:text-white">
                      <Icons.Repair size={14} className="text-secondary" />
                      {vehicle.lastServiceKm.toLocaleString()} KM
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <ActionButton 
                        onClick={() => setHistoryVehicle(vehicle)}
                        variant="secondary"
                        icon={<Icons.History size={14} />}
                        label="Riwayat"
                      />
                      <ActionButton 
                        icon={<Icons.Settings size={16} />} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={6} className="text-center py-10 text-dark-5">
                  Data tidak ditemukan
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedVehicle && (
        <ServiceBookModal 
          plateNumber={selectedVehicle.plateNumber}
          history={selectedVehicle.serviceHistory}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {historyVehicle && (
        <ServiceHistoryModal
          noPolisi={historyVehicle.plateNumber}
          kendaraan={`${historyVehicle.brand} ${historyVehicle.model}`}
          onClose={() => setHistoryVehicle(null)}
        />
      )}

      {showRegModal && (
        <VehicleFormModal 
          onClose={() => setShowRegModal(false)}
          onSave={(data) => {
            console.log("Saving new vehicle:", data);
            setShowRegModal(false);
          }}
        />
      )}
    </div>
  );
}

