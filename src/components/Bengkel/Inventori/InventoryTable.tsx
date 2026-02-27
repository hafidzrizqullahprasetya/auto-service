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
import { MOCK_ITEMS, Item } from "@/mock/inventory";
import { formatNumber } from "@/lib/format-number";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { BarcodeLabelModal } from "@/components/Bengkel/shared";
import { ActionButton } from "@/components/Bengkel/shared";
import { TableToolbar } from "@/components/Bengkel/shared";
import { InventoryFormModal } from "@/components/Bengkel/Inventori";

import { InventorySummary } from "./InventorySummary";

export function InventoryTable() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_ITEMS.filter(item => 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <InventorySummary />
      
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <TableToolbar 
        title="Inventori Sparepart & Jasa"
        description="Kelola stok, harga, dan cetak barcode sparepart"
        onSearch={setSearchTerm}
        searchPlaceholder="Cari SKU atau nama item..."
        primaryAction={{
          label: "Tambah Item Baru",
          onClick: () => setShowAddModal(true),
        }}
        filterActions={
          <ActionButton variant="outline" label="Rekap Stok" icon={<Icons.Print size={16} />} />
        }
      />

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="font-bold text-left px-4">SKU / Barcode</TableHead>
              <TableHead className="min-w-[200px] font-bold text-left px-4">Nama Item</TableHead>
              <TableHead className="font-bold text-center px-4">Kategori</TableHead>
              <TableHead className="font-bold text-left px-4">Harga</TableHead>
              <TableHead className="font-bold text-center px-4">Stok</TableHead>
              <TableHead className="font-bold text-center px-4">Tipe</TableHead>
              <TableHead className="text-right font-bold pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group">
                  <TableCell className="px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-dark dark:text-white bg-gray-2 dark:bg-dark-2 px-2 py-1 rounded">
                        {item.sku}
                      </span>
                      {item.category !== "Service" && (
                         <ActionButton 
                          onClick={() => setSelectedItem(item)}
                          variant="primary"
                          size="sm"
                          icon={<Icons.Print size={14} />}
                          className="opacity-0 group-hover:opacity-100"
                          title="Generate Barcode"
                         />
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4">
                    <p className="font-medium text-dark dark:text-white">{item.name}</p>
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <Badge variant={item.category === "Service" ? "warning" : "primary"}>
                      {item.category}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4">
                    <p className="font-bold text-secondary">Rp {formatNumber(item.price)}</p>
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <p className={cn(
                      "font-medium",
                      item.stock && item.stock < 10 ? "text-red" : "text-dark dark:text-white"
                    )}>
                      {item.stock ?? "-"}
                    </p>
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <Badge variant="info" outline className="text-[10px] py-0.5">
                      {item.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-4 text-sm">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionButton variant="primary" label="Edit" />
                      <ActionButton variant="danger" label="Hapus" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={7} className="text-center py-10 text-dark-5">
                  Data tidak ditemukan
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <BarcodeLabelModal 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showAddModal && (
        <InventoryFormModal 
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log("Saving new item:", data);
            setShowAddModal(false);
          }}
        />
      )}
      </div>
    </div>
  );
}

