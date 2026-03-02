export type MovementType = "masuk" | "keluar" | "opname_adjustment";

export interface StockMovement {
  id: string;
  sparePartId: string;
  sparePartName: string;
  sku: string;
  type: MovementType;
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  note: string;
  referenceId?: string;
  referenceType?: "transaction" | "opname" | "manual";
  createdBy: string;
  createdAt: string;
}

export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: "mv1",
    sparePartId: "p1",
    sparePartName: "Oli Shell Helix HX7 1L",
    sku: "OL-SMX-1L",
    type: "masuk",
    quantityChange: 24,
    stockBefore: 0,
    stockAfter: 24,
    note: "Restock awal dari Supplier Mega Motor",
    referenceType: "manual",
    createdBy: "Admin",
    createdAt: "2024-05-01T08:00:00Z",
  },
  {
    id: "mv2",
    sparePartId: "p1",
    sparePartName: "Oli Shell Helix HX7 1L",
    sku: "OL-SMX-1L",
    type: "keluar",
    quantityChange: -4,
    stockBefore: 24,
    stockAfter: 20,
    note: "Dipakai untuk servis B 1234 ABC",
    referenceId: "tx1",
    referenceType: "transaction",
    createdBy: "Kasir",
    createdAt: "2024-05-24T09:30:00Z",
  },
  {
    id: "mv3",
    sparePartId: "p2",
    sparePartName: "Filter Oli Avanza/Xenia",
    sku: "FIL-AVZ-01",
    type: "masuk",
    quantityChange: 15,
    stockBefore: 0,
    stockAfter: 15,
    note: "Restock dari Supplier ABC Sparepart",
    referenceType: "manual",
    createdBy: "Admin",
    createdAt: "2024-05-01T08:00:00Z",
  },
  {
    id: "mv4",
    sparePartId: "p2",
    sparePartName: "Filter Oli Avanza/Xenia",
    sku: "FIL-AVZ-01",
    type: "keluar",
    quantityChange: -1,
    stockBefore: 15,
    stockAfter: 14,
    note: "Dipakai untuk servis B 1234 ABC",
    referenceId: "tx1",
    referenceType: "transaction",
    createdBy: "Kasir",
    createdAt: "2024-05-24T09:30:00Z",
  },
  {
    id: "mv5",
    sparePartId: "p3",
    sparePartName: "Kampas Rem Depan Brio",
    sku: "BRK-HD-01",
    type: "opname_adjustment",
    quantityChange: -2,
    stockBefore: 7,
    stockAfter: 5,
    note: "Penyesuaian opname Mei 2024 — selisih fisik kurang 2",
    referenceId: "opname1",
    referenceType: "opname",
    createdBy: "Admin",
    createdAt: "2024-05-31T17:00:00Z",
  },
  {
    id: "mv6",
    sparePartId: "p4",
    sparePartName: "Oli MPX2 0.8L",
    sku: "OL-MPX-MTR",
    type: "masuk",
    quantityChange: 50,
    stockBefore: 0,
    stockAfter: 50,
    note: "Stok awal dari gudang pusat",
    referenceType: "manual",
    createdBy: "Admin",
    createdAt: "2024-05-01T08:00:00Z",
  },
];
