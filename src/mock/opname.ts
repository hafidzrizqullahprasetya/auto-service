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

export const MOCK_OPNAMES: StockOpname[] = [
  {
    id: "opname1",
    sessionName: "Stok Opname Mei 2024",
    status: "closed",
    openedBy: "Admin",
    openedAt: "2024-05-31T08:00:00Z",
    closedAt: "2024-05-31T17:00:00Z",
    totalItems: 4,
    totalDifference: -2,
    items: [
      {
        id: "oi1",
        sparePartId: "p1",
        sparePartName: "Oli Shell Helix HX7 1L",
        sku: "OL-SMX-1L",
        systemStock: 20,
        physicalCount: 20,
        difference: 0,
        note: "",
      },
      {
        id: "oi2",
        sparePartId: "p2",
        sparePartName: "Filter Oli Avanza/Xenia",
        sku: "FIL-AVZ-01",
        systemStock: 14,
        physicalCount: 14,
        difference: 0,
        note: "",
      },
      {
        id: "oi3",
        sparePartId: "p3",
        sparePartName: "Kampas Rem Depan Brio",
        sku: "BRK-HD-01",
        systemStock: 7,
        physicalCount: 5,
        difference: -2,
        note: "Kemungkinan tercecer atau lupa catat keluar",
      },
      {
        id: "oi4",
        sparePartId: "p4",
        sparePartName: "Oli MPX2 0.8L",
        sku: "OL-MPX-MTR",
        systemStock: 50,
        physicalCount: 50,
        difference: 0,
        note: "",
      },
    ],
  },
];

// Mock untuk sesi opname yang sedang berjalan (open)
export const MOCK_OPEN_OPNAME: StockOpname = {
  id: "opname2",
  sessionName: "Stok Opname Juni 2024",
  status: "open",
  openedBy: "Admin",
  openedAt: "2024-06-28T08:00:00Z",
  totalItems: 6,
  totalDifference: 0,
  items: [
    {
      id: "oi5",
      sparePartId: "p1",
      sparePartName: "Oli Shell Helix HX7 1L",
      sku: "OL-SMX-1L",
      systemStock: 20,
      physicalCount: 0, // belum diisi
      difference: 0,
      note: "",
    },
    {
      id: "oi6",
      sparePartId: "p2",
      sparePartName: "Filter Oli Avanza/Xenia",
      sku: "FIL-AVZ-01",
      systemStock: 14,
      physicalCount: 0,
      difference: 0,
      note: "",
    },
    {
      id: "oi7",
      sparePartId: "p3",
      sparePartName: "Kampas Rem Depan Brio",
      sku: "BRK-HD-01",
      systemStock: 5,
      physicalCount: 0,
      difference: 0,
      note: "",
    },
    {
      id: "oi8",
      sparePartId: "p4",
      sparePartName: "Oli MPX2 0.8L",
      sku: "OL-MPX-MTR",
      systemStock: 50,
      physicalCount: 0,
      difference: 0,
      note: "",
    },
  ],
};
