export interface Item {
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

export const MOCK_ITEMS: Item[] = [
  {
    id: "p1",
    sku: "OL-SMX-1L",
    name: "Oli Shell Helix HX7 1L",
    category: "Oil",
    costPrice: 72000,
    price: 95000,
    stock: 20,
    minimumStock: 10,
    unit: "liter",
    type: "Mobil",
  },
  {
    id: "p2",
    sku: "FIL-AVZ-01",
    name: "Filter Oli Avanza/Xenia",
    category: "Part",
    costPrice: 22000,
    price: 35000,
    stock: 3,
    minimumStock: 5,
    unit: "pcs",
    type: "Mobil",
  },
  {
    id: "p3",
    sku: "BRK-HD-01",
    name: "Kampas Rem Depan Brio",
    category: "Part",
    costPrice: 180000,
    price: 250000,
    stock: 5,
    minimumStock: 10,
    unit: "set",
    type: "Mobil",
  },
  {
    id: "p5",
    sku: "BUS-NGK-IR",
    name: "Busi NGK Iridium",
    category: "Part",
    costPrice: 85000,
    price: 125000,
    stock: 2,
    minimumStock: 8,
    unit: "pcs",
    type: "Mobil",
  },
  {
    id: "s1",
    sku: "SVC-LB-MBL",
    name: "Jasa Ganti Oli Mobil",
    category: "Service",
    costPrice: 0,
    price: 50000,
    unit: "jasa",
    type: "Mobil",
  },
  {
    id: "s2",
    sku: "SVC-TUNE-MTR",
    name: "Jasa Tune Up Motor",
    category: "Service",
    costPrice: 0,
    price: 75000,
    unit: "jasa",
    type: "Motor",
  },
  {
    id: "p4",
    sku: "OL-MPX-MTR",
    name: "Oli MPX2 0.8L",
    category: "Oil",
    costPrice: 40000,
    price: 55000,
    stock: 50,
    minimumStock: 15,
    unit: "liter",
    type: "Motor",
  },
  {
    id: "p6",
    sku: "FIL-UD-MTR",
    name: "Filter Udara Motor Vario",
    category: "Part",
    costPrice: 28000,
    price: 45000,
    stock: 12,
    minimumStock: 5,
    unit: "pcs",
    type: "Motor",
  },
];
