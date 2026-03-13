import { api } from "@/lib/api";
import { ApiTransaction, ApiSettings } from "@/types/api";
import { Transaction } from "@/types/transaction";
import { settingsService } from "./settings.service";

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
export function mapTransaction(tx: ApiTransaction, taxRate: number = 11): Transaction {
  const items = tx.transaction_items ?? [];
  const taxFactor = 1 + (taxRate / 100);
  const totalAmount = Number(tx.total_amount);
  const subtotalValue = Math.round(totalAmount / taxFactor);
  
  const hasService = items.some(
    (i: any) => 
      i.item_type === "service" || 
      i.item_type === "jasa" || 
      i.item_name.toLowerCase().includes("service") ||
      i.item_name.toLowerCase().includes("jasa")
  );
  
  return {
    id: tx.id.toString(),
    invoiceNo: tx.invoice_number,
    date: tx.created_at || tx.transaction_date,
    customerName: tx.customers?.name ?? "Pelanggan",
    customerPhone: tx.customers?.phone ?? "",
    vehiclePlate: tx.vehicles?.plate_number ?? "Tanpa Plat",
    items: items.map((i) => ({
      name: i.item_name,
      price: Number(i.unit_price),
      qty: i.quantity,
    })),
    subtotal: subtotalValue,
    tax: totalAmount - subtotalValue,
    total: totalAmount,
    taxPercentage: taxRate,
    paymentMethod: PAYMENT_METHOD_MAP[tx.payment_method] ?? "Cash",
    type: hasService ? "Service" : "Sparepart Only",
    paymentStatus: PAYMENT_STATUS_MAP[tx.payment_status] ?? "Lunas",
    dpAmount: Number(tx.paid_amount),
  };
}

export interface TransactionItemBody {
  item_type: "spare_part" | "service";
  spare_part_id?: number;
  item_name: string;
  quantity: number;
  unit_price: number;
}

export interface TransactionBody {
  customer_id: number;
  vehicle_id: number;
  transaction_date: string;
  payment_method: ApiTransaction["payment_method"];
  notes?: string;
  items: TransactionItemBody[];
}

export const transactionsService = {
  async getAll(): Promise<Transaction[]> {
    const [settings, res] = await Promise.all([
      settingsService.get(),
      api.get<ApiTransaction[]>("/api/v1/transactions")
    ]);
    const taxRate = Number(settings?.tax_percentage ?? 11);
    return (res.data ?? []).map((tx) => mapTransaction(tx, taxRate));
  },

  async getById(id: string): Promise<Transaction> {
    const [settings, res] = await Promise.all([
      settingsService.get(),
      api.get<ApiTransaction>(`/api/v1/transactions/${id}`)
    ]);
    const taxRate = Number(settings?.tax_percentage ?? 11);
    return mapTransaction(res.data, taxRate);
  },

  async create(body: TransactionBody): Promise<Transaction> {
    const [settings, res] = await Promise.all([
      settingsService.get(),
      api.post<ApiTransaction>("/api/v1/transactions", body)
    ]);
    const taxRate = Number(settings?.tax_percentage ?? 11);
    return mapTransaction(res.data, taxRate);
  },

  async updatePayment(
    id: string,
    payment: {
      payment_status: ApiTransaction["payment_status"];
      dp_amount?: number;
    },
  ): Promise<Transaction> {
    const [settings, res] = await Promise.all([
      settingsService.get(),
      api.patch<ApiTransaction>(
        `/api/v1/transactions/${id}/payment`,
        payment,
      )
    ]);
    const taxRate = Number(settings?.tax_percentage ?? 11);
    return mapTransaction(res.data, taxRate);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/transactions/${id}`);
  },
};
