"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/Icons";
import React, { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "danger" | "outline" | "primary";
  };
  /** Slot node tambahan di toolbar (misal: ExcelButtons) */
  extraActions?: React.ReactNode;
  isLoading?: boolean;
  borderless?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_PAGE_SIZE = 10;

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable,
  searchPlaceholder = "Cari...",
  pageSize = DEFAULT_PAGE_SIZE,
  title,
  description,
  primaryAction,
  secondaryAction,
  extraActions,
  isLoading = false,
  borderless = false,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedFilter = useDebounce(globalFilter, SEARCH_DEBOUNCE_MS);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: debouncedFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const totalRows = useMemo(
    () => table.getFilteredRowModel().rows.length,
    [table],
  );
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div
      className={cn(
        "width-full flex flex-col overflow-hidden",
        !borderless
          ? "rounded-2xl border border-stroke bg-white shadow-sm"
          : "bg-transparent",
      )}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      {(title ||
        searchable ||
        primaryAction ||
        secondaryAction ||
        extraActions) && (
        <div className="flex flex-col gap-4 border-b border-stroke px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-bold tracking-tight text-dark">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs font-medium text-dark-5">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <Icons.Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-5"
                />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="h-11 w-full min-w-[280px] rounded-xl border border-stroke bg-gray-1/50 pl-11 pr-4 text-sm text-dark outline-none placeholder:text-dark-5 focus:border-dark focus:bg-white"
                />
              </div>
            )}

            {/* Extra actions slot (e.g. ExcelButtons) */}
            {extraActions}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold",
                    secondaryAction.variant === "danger"
                      ? "border-red/20 bg-red-50 text-red hover:bg-red hover:text-white"
                      : "border-stroke bg-white text-dark-5 hover:border-dark hover:text-dark",
                  )}
                >
                  {secondaryAction.label}
                </button>
              )}

              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className="flex h-11 items-center gap-2 rounded-xl bg-dark px-5 text-sm font-bold text-white hover:bg-dark/90"
                >
                  <Plus size={16} />
                  {primaryAction.label}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-stroke bg-gray-2/30 [&>th]:px-8 [&>th]:py-5"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="group/th text-xs font-bold text-dark-5">
                      <div className="relative flex min-h-[14px] items-center">
                        <div className="w-full">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="h-[84px] border-b border-stroke bg-white"
                >
                  {columns.map((_, colIndex) => (
                    <TableCell key={`col-${colIndex}`} className="px-8 py-0">
                      <Skeleton height={20} className="w-full max-w-[80%] rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-stroke bg-gray-2/30 [&>th]:px-8 [&>th]:py-5"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "group/th text-xs font-bold text-dark-5 transition-colors",
                        header.column.getCanSort() &&
                          "cursor-pointer select-none hover:text-dark",
                      )}
                      onClick={header.column.getToggleSortingHandler?.()}
                    >
                      <div className="relative flex min-h-[14px] items-center">
                        <div className="w-full">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </div>
                        {header.column.getCanSort() &&
                          !header.column.id.includes("actions") &&
                          !header.column.id.includes("no") && (
                            <div className="absolute -right-4 top-1/2 flex -translate-y-1/2 items-center justify-center">
                              {{
                                asc: (
                                  <Icons.ArrowUp
                                    size={12}
                                    className="text-dark"
                                  />
                                ),
                                desc: (
                                  <Icons.ArrowDown
                                    size={12}
                                    className="text-dark"
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? (
                                <Icons.ChevronDown
                                  size={12}
                                  className="opacity-30 group-hover/th:opacity-100"
                                />
                              )}
                            </div>
                          )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {totalRows > 0 ? (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "group h-[84px] border-b border-stroke hover:bg-gray-2/50",
                      i % 2 === 0 ? "bg-white" : "bg-gray-2/20",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-8 py-0">
                        <div className="flex h-full items-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[300px] text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-1">
                        <Icons.Search
                          size={32}
                          className="text-dark-5 opacity-20"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-dark">
                          Data Tidak Ditemukan
                        </p>
                        <p className="text-xs text-dark-5">
                          Coba sesuaikan kata kunci atau filter pencarian Anda
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke px-8 py-5">
          <p className="text-xs font-medium text-dark-5">
            Menampilkan <span className="font-bold text-dark">{totalRows}</span>{" "}
            dari <span className="font-bold text-dark">{data.length}</span> data
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark active:scale-90 disabled:opacity-20"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="mx-2 flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-xs font-bold text-dark-5/40">
                        •••
                      </span>
                    )}
                    <button
                      onClick={() => table.setPageIndex(page - 1)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all active:scale-90",
                        currentPage === page
                          ? "bg-dark text-white"
                          : "text-dark-5 hover:bg-gray-1 hover:text-dark",
                      )}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark active:scale-90 disabled:opacity-20"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
