export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  vehicles: string[]; 
}
