export interface ServiceRecord {
  id: string;
  date: string;
  km: number;
  serviceType: string;
  items: string[];
  cost: number;
  mechanic: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  type: "Mobil" | "Motor";
  year: number;
  color: string;
  ownerId: string;
  ownerName?: string;
  frame_number?: string | null;
  lastServiceKm: number;
  serviceHistory: ServiceRecord[];
}
