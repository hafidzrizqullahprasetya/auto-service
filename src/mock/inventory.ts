export interface Item {
  id: string;
  sku: string;
  name: string;
  category: "Part" | "Service" | "Oil";
  price: number;
  stock?: number;
  type: "Mobil" | "Motor" | "Umum";
  image?: string;
}

export const MOCK_ITEMS: Item[] = [
  {
    id: "p1",
    sku: "OL-SMX-1L",
    name: "Oli Shell Helix HX7 1L",
    category: "Oil",
    price: 95000,
    stock: 24,
    type: "Mobil",
  },
  {
    id: "p2",
    sku: "FIL-AVZ-01",
    name: "Filter Oli Avanza/Xenia",
    category: "Part",
    price: 35000,
    stock: 15,
    type: "Mobil",
  },
  {
    id: "p3",
    sku: "BRK-HD-01",
    name: "Kampas Rem Depan Brio",
    category: "Part",
    price: 250000,
    stock: 5,
    type: "Mobil",
  },
  {
    id: "s1",
    sku: "SVC-LB-MBL",
    name: "Jasa Ganti Oli Mobil",
    category: "Service",
    price: 50000,
    type: "Mobil",
  },
  {
    id: "s2",
    sku: "SVC-TUNE-MTR",
    name: "Jasa Tune Up Motor",
    category: "Service",
    price: 75000,
    type: "Motor",
  },
  {
    id: "p4",
    sku: "OL-MPX-MTR",
    name: "Oli MPX2 0.8L",
    category: "Oil",
    price: 55000,
    stock: 50,
    type: "Motor",
  },
];
