import { api } from "@/lib/api";
import { ApiTransaction } from "@/types/api";
import { Transaction } from "@/mock/transactions";

const PAYMENT_METHOD_MAP: Record<
  ApiTransaction["payment_method"],
  Transaction["paymentMethod"]
> = {
  cash: "Cash",
  transfer: "Transfer",
  e_wallet: "E-Wallet",
  card: "Card",
};

const PAYMENT_STATUS_MAP: Record<
  ApiTransaction["payment_status"],
  Transaction["paymentStatus"]
> = {
  lunas: "Lunas",
  dp: "DP",
  piutang: "Piutang",
};

/** Map BE ApiTransaction → FE Transaction */
export function mapTransaction(tx: ApiTransaction): Transaction {
  const hasService = tx.items.some((i) => i.item_type === "service");
  return {
    id: tx.id,
    invoiceNo: tx.invoice_number,
    date: tx.transaction_date,
    customerName: tx.customer?.name ?? "",
    vehiclePlate: tx.vehicle?.plate_number ?? "",
    items: tx.items.map((i) => ({
      name: i.item_name,
      price: i.unit_price,
      qty: i.quantity,
    })),
    subtotal: tx.subtotal,
    tax: tx.tax,
    total: tx.grand_total,
    paymentMethod: PAYMENT_METHOD_MAP[tx.payment_method] ?? "Cash",
    type: hasService ? "Service" : "Sparepart Only",
    paymentStatus: PAYMENT_STATUS_MAP[tx.payment_status] ?? "Lunas",
    dpAmount: tx.dp_amount,
  };
}

export interface TransactionItemBody {
  item_type: "spare_part" | "service";
  spare_part_id?: string;
  item_name: string;
  quantity: number;
  unit_price: number;
}

export interface TransactionBody {
  customer_id: string;
  vehicle_id: string;
  transaction_date: string;
  payment_method: ApiTransaction["payment_method"];
  notes?: string;
  items: TransactionItemBody[];
}

export const transactionsService = {
  async getAll(): Promise<Transaction[]> {
    const res = await api.get<ApiTransaction[]>("/transactions");
    return (res.data ?? []).map(mapTransaction);
  },

  async getById(id: string): Promise<Transaction> {
    const res = await api.get<ApiTransaction>(`/transactions/${id}`);
    return mapTransaction(res.data);
  },

  async create(body: TransactionBody): Promise<Transaction> {
    const res = await api.post<ApiTransaction>("/transactions", body);
    return mapTransaction(res.data);
  },

  async updatePayment(
    id: string,
    payment: {
      payment_status: ApiTransaction["payment_status"];
      dp_amount?: number;
    },
  ): Promise<Transaction> {
    const res = await api.patch<ApiTransaction>(
      `/transactions/${id}/payment`,
      payment,
    );
    return mapTransaction(res.data);
  },
};
