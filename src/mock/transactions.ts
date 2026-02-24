export interface Transaction {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  vehiclePlate: string;
  items: { name: string; price: number; qty: number }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "Cash" | "Transfer" | "E-Wallet" | "Card";
  type: "Service" | "Sparepart Only";
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    invoiceNo: "INV/20240524/001",
    date: "2024-05-24T09:30:00Z",
    customerName: "Budi Santoso",
    vehiclePlate: "B 1234 ABC",
    items: [
      { name: "Oli Shell Helix HX7 1L", price: 95000, qty: 4 },
      { name: "Filter Oli Avanza", price: 35000, qty: 1 },
      { name: "Jasa Ganti Oli Mobil", price: 50000, qty: 1 }
    ],
    subtotal: 465000,
    tax: 51150,
    total: 516150,
    paymentMethod: "Cash",
    type: "Service"
  },
  {
    id: "tx2",
    invoiceNo: "INV/20240524/002",
    date: "2024-05-24T11:45:00Z",
    customerName: "Ani Wijaya",
    vehiclePlate: "F 5678 XY",
    items: [
      { name: "Service Rutin 10.000km", price: 350000, qty: 1 },
      { name: "Busi Denso Iridium", price: 125000, qty: 4 }
    ],
    subtotal: 850000,
    tax: 93500,
    total: 943500,
    paymentMethod: "Transfer",
    type: "Service"
  },
  {
    id: "tx3",
    invoiceNo: "INV/20240524/003",
    date: "2024-05-24T14:20:00Z",
    customerName: "Agus Salim",
    vehiclePlate: "B 777 VIX",
    items: [
      { name: "Oli MPX2 0.8L", price: 55000, qty: 1 }
    ],
    subtotal: 55000,
    tax: 6050,
    total: 61050,
    paymentMethod: "E-Wallet",
    type: "Sparepart Only"
  }
];
