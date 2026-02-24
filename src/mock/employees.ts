export interface Employee {
  id: string;
  name: string;
  role: "Mekanik Senior" | "Mekanik" | "Admin" | "Service Advisor" | "Helper";
  status: "Aktif" | "Cuti" | "Off";
  joinDate: string;
  totalTasks: number;
  rating: number;
  phone: string;
  avatar?: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp1",
    name: "Suryo Atmojo",
    role: "Mekanik Senior",
    status: "Aktif",
    joinDate: "2023-01-10",
    totalTasks: 452,
    rating: 4.9,
    phone: "0812-3456-XXXX",
  },
  {
    id: "emp2",
    name: "Budi Setiadi",
    role: "Mekanik",
    status: "Aktif",
    joinDate: "2023-06-15",
    totalTasks: 215,
    rating: 4.7,
    phone: "0856-7890-XXXX",
  },
  {
    id: "emp3",
    name: "Agus Prasetyo",
    role: "Mekanik",
    status: "Off",
    joinDate: "2023-08-20",
    totalTasks: 180,
    rating: 4.5,
    phone: "0813-1122-XXXX",
  },
  {
    id: "emp4",
    name: "Larasati",
    role: "Admin",
    status: "Aktif",
    joinDate: "2023-02-01",
    totalTasks: 0,
    rating: 5.0,
    phone: "0819-3344-XXXX",
  },
  {
    id: "emp5",
    name: "Riko Simanjuntak",
    role: "Service Advisor",
    status: "Aktif",
    joinDate: "2023-03-12",
    totalTasks: 120,
    rating: 4.8,
    phone: "0812-9988-XXXX",
  }
];
