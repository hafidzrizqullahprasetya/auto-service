export interface Transaction {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  vehiclePlate: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "Cash" | "Transfer" | "E-Wallet" | "Card";
  type: "Service" | "Sparepart Only";
  paymentStatus: "Lunas" | "DP" | "Piutang";
  dpAmount?: number;
  taxPercentage: number;
}

export interface TransactionItem {
  id?: string;
  name: string;
  price: number;
  qty: number;
  subtotal?: number;
}
