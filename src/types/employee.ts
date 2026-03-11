export interface Employee {
  id: string;
  name: string;
  role: "Owner" | "Admin" | "Kasir";
  status: "Aktif" | "Cuti" | "Off";
  joinDate: string;
  totalTasks: number;
  rating: number;
  phone: string;
  avatar?: string;
}
