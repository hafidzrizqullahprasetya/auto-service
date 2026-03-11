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
