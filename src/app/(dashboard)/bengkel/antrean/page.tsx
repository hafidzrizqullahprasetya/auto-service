"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { AntreanTable } from "@/components/Bengkel/AntreanTable";
import { KanbanBoard } from "@/components/Bengkel/KanbanBoard";
import { MOCK_ANTREAN, Antrean } from "@/mock/antrean";
import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AntreanPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [items, setItems] = useState<Antrean[]>(MOCK_ANTREAN);

  const handleStatusChange = (id: string, newStatus: Antrean["status"]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Breadcrumb pageName="Antrean Masuk" />
        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-stroke bg-white p-1 shadow-sm dark:border-dark-3 dark:bg-gray-dark self-start sm:self-auto">
          <button
            onClick={() => setView("kanban")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
              view === "kanban"
                ? "bg-primary text-white shadow-sm"
                : "text-dark-5 hover:text-dark dark:hover:text-white"
            )}
          >
            <LayoutGrid size={15} /> Kanban
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
              view === "table"
                ? "bg-primary text-white shadow-sm"
                : "text-dark-5 hover:text-dark dark:hover:text-white"
            )}
          >
            <LayoutList size={15} /> Tabel
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanBoard items={items} onStatusChange={handleStatusChange} />
      ) : (
        <AntreanTable />
      )}
    </div>
  );
}
