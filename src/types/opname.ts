export type OpnameStatus = "open" | "closed";

export interface OpnameItem {
  id: string;
  sparePartId: string;
  sparePartName: string;
  sku: string;
  systemStock: number;
  physicalCount: number;
  difference: number; // physicalCount - systemStock
  note: string;
}

export interface StockOpname {
  id: string;
  sessionName: string;
  status: OpnameStatus;
  openedBy: string;
  openedAt: string;
  closedAt?: string;
  items: OpnameItem[];
  totalItems: number;
  totalDifference: number;
}
