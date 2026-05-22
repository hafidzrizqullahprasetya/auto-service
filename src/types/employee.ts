export interface Employee {
  id: string;
  name: string;
  username: string;
  role: "Owner" | "Admin" | "Kasir" | "Mekanik";
  status: "Aktif" | "Cuti" | "Off";
  joinDate: string;
  totalTasks: number;
  rating: number;
  phone: string;
  avatar?: string;
}
