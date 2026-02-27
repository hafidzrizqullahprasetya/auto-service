"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

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
  isLoading?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_PAGE_SIZE = 10;
const SEARCH_INPUT_MAX_WIDTH = "max-w-[250px]";
const SEARCH_ICON_SIZE = 18;

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable,
  searchPlaceholder = "Cari...",
  pageSize = DEFAULT_PAGE_SIZE,
  title,
  description,
  primaryAction,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedFilter = useDebounce(globalFilter, SEARCH_DEBOUNCE_MS);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: debouncedFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  const totalRows = useMemo(
    () => table.getFilteredRowModel().rows.length,
    [table]
  );

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      {/* Header */}
      {(title || searchable || primaryAction) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-bold text-dark dark:text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {searchable && (
              <div className="relative">
                <Icons.Search
                  size={SEARCH_ICON_SIZE}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5"
                />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className={`${SEARCH_INPUT_MAX_WIDTH} pl-9`}
                />
              </div>
            )}

            {primaryAction && (
              <Button onClick={primaryAction.onClick} disabled={isLoading}>
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white [&>th]:text-center"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {totalRows > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group [&>td]:text-center"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-dark-5"
                  >
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-dark-5 dark:text-dark-6">
            Menampilkan {totalRows} dari {data.length} data
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </Button>

            <span className="text-sm font-medium text-dark dark:text-white">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!canNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
