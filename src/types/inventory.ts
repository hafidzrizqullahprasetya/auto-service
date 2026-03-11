export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  categoryId?: number;
  categoryName?: string;
  category: "Part" | "Service" | "Oil";
  costPrice: number;   // harga modal
  price: number;       // harga jual
  stock?: number;
  minimumStock?: number;
  unit: string;        // pcs, liter, set, dll
  type: "Mobil" | "Motor" | "Umum";
  image?: string;
}

/** Alias for compatibility with existing imports */
export type Item = InventoryItem;
