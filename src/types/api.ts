// ===== Auth =====
export interface ApiUser {
  id: number;
  name: string;
  username: string;
  role: "owner" | "admin" | "kasir";
  phone?: string | null;
  is_active?: boolean;
}

export interface LoginResponse {
  token: string;
  refresh_token?: string;
  expires_in?: number;
  user: ApiUser;
}

// ===== Customers =====
export interface ApiCustomer {
  id: number;
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
  id: number;
  customer_id: number;
  plate_number: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  frame_number?: string | null;
}

// ===== Service Bundles =====
export interface ApiServiceBundleItem {
  id: number;
  bundle_id: number;
  task_name: string;
}

export interface ApiServiceBundle {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items: ApiServiceBundleItem[];
}

// ===== Work Order Checklist =====
export interface ApiWorkOrderChecklist {
  id: number;
  work_order_id: number;
  task_name: string;
  is_done: boolean;
  updated_at: string;
}

// ===== Categories =====
export interface ApiCategory {
  id: number;
  name: string;
  description?: string;
}

// ===== Spare Parts =====
export interface ApiSparePart {
  id: number;
  sku: string;
  name: string;
  category_id: number | null;
  category?: ApiCategory;
  cost_price: number | string;
  sell_price: number | string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  barcode_url?: string;
  deleted_at?: string;
}

// ===== Stock Movements =====
export interface ApiStockMovement {
  id: number;
  spare_part_id: number;
  spare_part?: ApiSparePart;
  type: "in" | "out";
  quantity: number;
  note?: string;
  created_at: string;
  user?: ApiUser;
}

// ===== Opname =====
export interface ApiOpname {
  id: number;
  session_name: string;
  status: "open" | "closed";
  created_at: string;
  closed_at?: string;
  items?: ApiOpnameItem[];
}

export interface ApiOpnameItem {
  id: number;
  opname_id: number;
  spare_part_id: number;
  spare_part?: ApiSparePart;
  system_stock: number;
  physical_count: number;
  difference: number;
}

// ===== Transactions =====
export interface ApiTransaction {
  id: number;
  invoice_number: string;
  transaction_date: string;
  customer_id: number | null;
  vehicle_id: number | null;
  customers?: ApiCustomer;
  vehicles?: ApiVehicle;
  transaction_items: ApiTransactionItem[];
  total_amount: number | string;
  paid_amount: number | string;
  payment_method: "cash" | "transfer" | "e_wallet" | "card";
  payment_status: "lunas" | "dp" | "piutang" | "belum_bayar";
  notes?: string;
  created_at: string;
}

export interface ApiTransactionItem {
  id: number;
  transaction_id: number;
  item_type: "spare_part" | "service";
  spare_part_id?: number;
  item_name: string;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
}

// ===== Work Orders (Antrean) =====
export interface ApiWorkOrder {
  id: number;
  customer_id: number | null;
  vehicle_id: number | null;
  customers?: ApiCustomer;
  vehicles?: ApiVehicle;
  layanan: string;
  keluhan?: string;
  complaint_log?: string | null;
  estimasi_biaya?: number | string;
  estimasi_selesai?: string;
  menginap?: boolean;
  status: "menunggu" | "dikerjakan" | "menunggu_sparepart" | "selesai";
  mekanik?: string;
  waktu_masuk?: string;
  created_at: string;
  service_bundle_id?: number | null;
  service_bundles?: ApiServiceBundle | null;
  checklists?: ApiWorkOrderChecklist[];
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
  open_time?: string;
  close_time?: string;
  operational_days?: string;
  tax_percentage?: number;
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
