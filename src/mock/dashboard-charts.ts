export const getRevenueData = (timeFrame: string = "monthly") => {
  return {
    received: [
      { x: "Jan", y: 45 },
      { x: "Feb", y: 52 },
      { x: "Mar", y: 38 },
      { x: "Apr", y: 65 },
      { x: "May", y: 48 },
      { x: "Jun", y: 56 },
      { x: "Jul", y: 67 },
      { x: "Aug", y: 50 },
      { x: "Sep", y: 49 },
      { x: "Oct", y: 72 },
      { x: "Nov", y: 69 },
      { x: "Dec", y: 91 },
    ],
    due: [
      { x: "Jan", y: 12 },
      { x: "Feb", y: 15 },
      { x: "Mar", y: 10 },
      { x: "Apr", y: 20 },
      { x: "May", y: 14 },
      { x: "Jun", y: 18 },
      { x: "Jul", y: 22 },
      { x: "Aug", y: 15 },
      { x: "Sep", y: 12 },
      { x: "Oct", y: 25 },
      { x: "Nov", y: 20 },
      { x: "Dec", y: 30 },
    ],
  };
};

export const getVehicleRatioData = () => {
  return [
    { label: "Mobil", value: 65, color: "#FF6B00" }, // Safety Orange
    { label: "Motor", value: 35, color: "#1C2434" }, // Dark
  ];
};

export const getTopServicesData = () => {
  return [
    { name: "Ganti Oli Rutin", count: 145, growth: 12 },
    { name: "Service Berkala", count: 98, growth: 8 },
    { name: "Tune Up Mesin", count: 76, growth: -2 },
    { name: "Bongkar Pasang Ban", count: 112, growth: 15 },
    { name: "Cek Rem & Kaki-kaki", count: 84, growth: 5 },
  ];
};
