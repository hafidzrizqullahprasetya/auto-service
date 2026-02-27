export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  vehicles: string[]; // List of plate numbers
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Budi Santoso",
    phone: "0812-3456-7890",
    address: "Jl. Merdeka No. 10, Jakarta",
    totalVisits: 8,
    totalSpent: 4500000,
    lastVisit: "2024-05-24",
    vehicles: ["B 1234 ABC", "B 9999 XYZ"]
  },
  {
    id: "c2",
    name: "Ani Wijaya",
    phone: "0856-7890-1234",
    address: "Perum Indah Blok C/12, Bogor",
    totalVisits: 3,
    totalSpent: 1200000,
    lastVisit: "2024-05-20",
    vehicles: ["F 5678 XY"]
  },
  {
    id: "c3",
    name: "Agus Salim",
    phone: "0813-1122-3344",
    address: "Jl. Sudirman Gg. Kelinci, Jakarta",
    totalVisits: 12,
    totalSpent: 8900000,
    lastVisit: "2024-05-24",
    vehicles: ["B 777 VIX"]
  },
  {
    id: "c4",
    name: "Siska Putri",
    phone: "0819-0011-2233",
    address: "Apartemen Medit Tower A, Jakarta",
    totalVisits: 1,
    totalSpent: 350000,
    lastVisit: "2024-02-15",
    vehicles: ["B 2024 SP"]
  }
];
