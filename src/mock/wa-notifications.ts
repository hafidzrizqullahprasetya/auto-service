export type WaNotifStatus = "sent" | "failed" | "pending";

export interface WaNotification {
  id: string;
  sparePartId: string;
  sparePartName: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  waNumber: string;
  messageBody: string;
  status: WaNotifStatus;
  sentAt?: string;
  createdAt: string;
}

export const MOCK_WA_NOTIFICATIONS: WaNotification[] = [
  {
    id: "notif1",
    sparePartId: "p3",
    sparePartName: "Kampas Rem Depan Brio",
    sku: "BRK-HD-01",
    currentStock: 5,
    minimumStock: 10,
    waNumber: "6281234567890",
    messageBody:
      "⚠️ *ALERT STOK MENIPIS*\n\n*Bengkel AutoService*\n\nItem: Kampas Rem Depan Brio (BRK-HD-01)\nStok saat ini: *5 pcs*\nBatas minimum: 10 pcs\n\nSegera lakukan restock untuk menghindari kehabisan stok.",
    status: "sent",
    sentAt: "2024-05-31T17:05:00Z",
    createdAt: "2024-05-31T17:05:00Z",
  },
  {
    id: "notif2",
    sparePartId: "p2",
    sparePartName: "Filter Oli Avanza/Xenia",
    sku: "FIL-AVZ-01",
    currentStock: 3,
    minimumStock: 5,
    waNumber: "6281234567890",
    messageBody:
      "⚠️ *ALERT STOK MENIPIS*\n\n*Bengkel AutoService*\n\nItem: Filter Oli Avanza/Xenia (FIL-AVZ-01)\nStok saat ini: *3 pcs*\nBatas minimum: 5 pcs\n\nSegera lakukan restock untuk menghindari kehabisan stok.",
    status: "sent",
    sentAt: "2024-06-10T09:30:00Z",
    createdAt: "2024-06-10T09:30:00Z",
  },
  {
    id: "notif3",
    sparePartId: "p5",
    sparePartName: "Busi NGK Iridium",
    sku: "BUS-NGK-IR",
    currentStock: 2,
    minimumStock: 8,
    waNumber: "6281234567890",
    messageBody:
      "⚠️ *ALERT STOK MENIPIS*\n\n*Bengkel AutoService*\n\nItem: Busi NGK Iridium (BUS-NGK-IR)\nStok saat ini: *2 pcs*\nBatas minimum: 8 pcs\n\nSegera lakukan restock untuk menghindari kehabisan stok.",
    status: "failed",
    createdAt: "2024-06-15T14:00:00Z",
  },
  {
    id: "notif4",
    sparePartId: "p3",
    sparePartName: "Kampas Rem Depan Brio",
    sku: "BRK-HD-01",
    currentStock: 5,
    minimumStock: 10,
    waNumber: "6281234567890",
    messageBody:
      "⚠️ *ALERT STOK MENIPIS*\n\n*Bengkel AutoService*\n\nItem: Kampas Rem Depan Brio (BRK-HD-01)\nStok saat ini: *5 pcs*\nBatas minimum: 10 pcs\n\nSegera lakukan restock.",
    status: "pending",
    createdAt: "2024-06-20T10:00:00Z",
  },
];

// Items yang stoknya di bawah minimum (untuk dashboard alert)
export const LOW_STOCK_ITEMS = [
  { id: "p3", sku: "BRK-HD-01", name: "Kampas Rem Depan Brio", stock: 5, minimumStock: 10 },
  { id: "p2", sku: "FIL-AVZ-01", name: "Filter Oli Avanza/Xenia", stock: 3, minimumStock: 5 },
  { id: "p5", sku: "BUS-NGK-IR", name: "Busi NGK Iridium", stock: 2, minimumStock: 8 },
];
