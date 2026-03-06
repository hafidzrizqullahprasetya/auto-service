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
  lastServiceKm: number;
  serviceHistory: ServiceRecord[];
}

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "v1",
    plateNumber: "B 1234 ABC",
    brand: "Toyota",
    model: "Avanza G AT",
    type: "Mobil",
    year: 2021,
    color: "Silver Metallic",
    ownerId: "c1",
    lastServiceKm: 45000,
    serviceHistory: [
      {
        id: "s1",
        date: "2024-01-15",
        km: 40000,
        serviceType: "Servis Berkala 40k",
        items: ["Oli Mesin", "Filter Oli", "Cek Rem", "Rotasi Ban"],
        cost: 1250000,
        mechanic: "Suryo",
        notes: "Kondisi rem masih bagus 80%",
      },
      {
        id: "s2",
        date: "2024-05-10",
        km: 45000,
        serviceType: "Ganti Oli Rutin",
        items: ["Oli Mesin", "Filter Oli"],
        cost: 650000,
        mechanic: "Budi",
        notes: "Saran ganti ban depan 5000km lagi",
      },
    ],
  },
  {
    id: "v2",
    plateNumber: "F 5678 XY",
    brand: "Honda",
    model: "Brio E CVT",
    type: "Mobil",
    year: 2022,
    color: "Rally Red",
    ownerId: "c2",
    lastServiceKm: 15200,
    serviceHistory: [
      {
        id: "s3",
        date: "2024-03-20",
        km: 10000,
        serviceType: "Servis Berkala 10k",
        items: ["Oli Mesin", "Filter Oli", "Busi"],
        cost: 850000,
        mechanic: "Suryo",
      },
    ],
  },
  {
    id: "v3",
    plateNumber: "B 777 VIX",
    brand: "Yamaha",
    model: "Vixion R",
    type: "Motor",
    year: 2020,
    color: "Matte Blue",
    ownerId: "c3",
    lastServiceKm: 28000,
    serviceHistory: [
      {
        id: "s4",
        date: "2024-04-05",
        km: 25000,
        serviceType: "Servis Besar",
        items: ["Oli", "Filter Udara", "Radiator Coolant", "Rantai"],
        cost: 450000,
        mechanic: "Agus",
      },
    ],
  },
];
