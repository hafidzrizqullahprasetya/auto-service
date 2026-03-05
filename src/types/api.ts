// ===== Auth =====
export interface ApiUser {
  id: string;
  name: string;
  username: string;
  role: "owner" | "admin" | "kasir";
  is_active?: boolean;
}

export interface LoginResponse {
  token: string;
  expires_in?: number;
  user: ApiUser;
}

// ===== Customers =====
export interface ApiCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  total_visits?: number;
  total_spent?: number;
  last_visit?: string;
  vehicles?: ApiVehicle[];
  deleted_at?: string;
}

// ===== Vehicles =====
export interface ApiVehicle {
  id: string;
  customer_id: string;
  plate_number: string;
  type: string;
  brand: string;
  model: string;
  year: number;
}

// ===== Categories =====
export interface ApiCategory {
  id: string;
  name: string;
  description?: string;
}

// ===== Spare Parts =====
export interface ApiSparePart {
  id: string;
  sku: string;
  name: string;
  category_id: string;
  category?: ApiCategory;
  cost_price: number;
  sell_price: number;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  barcode_url?: string;
  deleted_at?: string;
}

// ===== Stock Movements =====
export interface ApiStockMovement {
  id: string;
  spare_part_id: string;
  spare_part?: ApiSparePart;
  type: "in" | "out";
  quantity: number;
  note?: string;
  created_at: string;
  user?: ApiUser;
}

// ===== Opname =====
export interface ApiOpname {
  id: string;
  session_name: string;
  status: "open" | "closed";
  created_at: string;
  closed_at?: string;
  items?: ApiOpnameItem[];
}

export interface ApiOpnameItem {
  id: string;
  opname_id: string;
  spare_part_id: string;
  spare_part?: ApiSparePart;
  system_stock: number;
  physical_count: number;
  difference: number;
}

// ===== Transactions =====
export interface ApiTransaction {
  id: string;
  invoice_number: string;
  transaction_date: string;
  customer_id: string;
  vehicle_id: string;
  customer?: ApiCustomer;
  vehicle?: ApiVehicle;
  items: ApiTransactionItem[];
  subtotal: number;
  tax: number;
  grand_total: number;
  payment_method: "cash" | "transfer" | "e_wallet" | "card";
  payment_status: "lunas" | "dp" | "piutang";
  dp_amount?: number;
  notes?: string;
}

export interface ApiTransactionItem {
  id: string;
  item_type: "spare_part" | "service";
  spare_part_id?: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// ===== Work Orders (Antrean) =====
export interface ApiWorkOrder {
  id: string;
  customer_id: string;
  vehicle_id: string;
  customer?: ApiCustomer;
  vehicle?: ApiVehicle;
  layanan: string;
  keluhan?: string;
  estimasi_biaya?: number;
  estimasi_selesai?: string;
  menginap?: boolean;
  status: "menunggu" | "dikerjakan" | "menunggu_sparepart" | "selesai";
  mekanik?: string;
  waktu_masuk?: string;
  created_at: string;
}

// ===== Reports =====
export interface ApiRevenueDataPoint {
  label: string;
  total: number;
  services: number;
  parts: number;
}

export interface ApiRevenueReport {
  period: string;
  total: number;
  services: number;
  parts: number;
  count: number;
  data: ApiRevenueDataPoint[];
}

export interface ApiTopProduct {
  spare_part_id: string;
  name: string;
  quantity_sold: number;
  revenue: number;
}

export interface ApiLowStockItem {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}

// ===== Settings =====
export interface ApiSettings {
  name: string;
  address?: string;
  phone?: string;
  wa_gateway_token?: string;
  wa_target_number?: string;
}

// ===== WA Notifications =====
export interface ApiWaNotification {
  id: string;
  type: string;
  recipient: string;
  message: string;
  status: "sent" | "failed" | "pending";
  sent_at?: string;
  error?: string;
}

export interface ApiWaStatus {
  connected: boolean;
  phone?: string;
  uptime?: number;
}
