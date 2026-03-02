"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { AntreanTable, KanbanBoard, AntreanFormModal } from "@/components/Bengkel/Antrean";
import { MOCK_ANTREAN, Antrean } from "@/mock/antrean";
import { LayoutGrid, LayoutList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import dayjs from "dayjs";

type ViewType = "kanban" | "table";

export default function AntreanPage() {
  const [activeView, setActiveView] = useState<ViewType>("kanban");
  const [items, setItems] = useState<Antrean[]>(MOCK_ANTREAN);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = (id: string, newStatus: Antrean["status"]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleMechanicAssign = (id: string, mekanik: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, mekanik } : item))
    );
  };

  const TABS = [
    { id: "kanban" as ViewType, label: "Kanban Board", icon: LayoutGrid },
    { id: "table" as ViewType, label: "Tabel Antrean", icon: LayoutList },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Manajemen Antrean" />

      {/* Grid Summary - Mengikuti style dashboard/kasir */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Menunggu", count: items.filter(i => i.status === "Menunggu").length, icon: Icons.Pending },
          { label: "Dikerjakan", count: items.filter(i => i.status === "Dikerjakan").length, icon: Icons.Repair },
          { label: "Sparepart", count: items.filter(i => i.status === "Menunggu Sparepart").length, icon: Icons.Inventory },
          { label: "Selesai", count: items.filter(i => i.status === "Selesai").length, icon: Icons.Success },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-4 rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark lg:gap-6">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-2 dark:text-blue-400">
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-dark dark:text-white leading-none">{s.count}</p>
              <p className="mt-1 text-xs font-medium text-dark-5 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation & Action */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl border border-stroke bg-white p-1 dark:border-dark-3 dark:bg-gray-dark w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
                activeView === id
                  ? "bg-secondary text-white"
                  : "text-dark-5 hover:text-dark dark:hover:text-white"
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-secondary px-6 text-sm font-bold text-white shadow-lg shadow-secondary/10 hover:bg-opacity-90"
        >
          <Plus size={18} />
          Entry Antrean Baru
        </button>
      </div>

      {/* Main Content Area */}
      {activeView === "kanban" ? (
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
          <KanbanBoard
            items={items}
            onStatusChange={handleStatusChange}
            onMechanicAssign={handleMechanicAssign}
          />
        </div>
      ) : (
        <AntreanTable data={items} />
      )}

      {showModal && (
        <AntreanFormModal
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            console.log("New queue entry:", data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
