export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export type AdminOrder = {
  id: string;
  client: string;
  phone: string;
  total: number;
  status: OrderStatus;
  date: string;
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  delivered: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

export const adminOrders: AdminOrder[] = [
  {
    id: "#1025",
    client: "Ahmed Merah",
    phone: "05 51 23 45 67",
    total: 4500,
    status: "pending",
    date: "15 Jul 2025, 14:30",
  },
  {
    id: "#1024",
    client: "Karim Benzema",
    phone: "07 72 88 11 02",
    total: 7500,
    status: "confirmed",
    date: "15 Jul 2025, 12:10",
  },
  {
    id: "#1023",
    client: "Yasmine Boudiaf",
    phone: "05 55 90 33 21",
    total: 3000,
    status: "delivered",
    date: "14 Jul 2025, 19:45",
  },
  {
    id: "#1022",
    client: "Riyad Mahrez",
    phone: "06 61 44 78 90",
    total: 9800,
    status: "delivered",
    date: "14 Jul 2025, 16:20",
  },
  {
    id: "#1021",
    client: "Sofiane Feghouli",
    phone: "05 49 12 67 34",
    total: 3000,
    status: "cancelled",
    date: "14 Jul 2025, 11:05",
  },
  {
    id: "#1020",
    client: "Amine Ghazi",
    phone: "07 70 55 22 18",
    total: 6500,
    status: "confirmed",
    date: "13 Jul 2025, 21:15",
  },
  {
    id: "#1019",
    client: "Nabil Bentaleb",
    phone: "05 58 33 91 40",
    total: 4200,
    status: "pending",
    date: "13 Jul 2025, 18:00",
  },
  {
    id: "#1018",
    client: "Ines Hamoudi",
    phone: "06 98 77 45 12",
    total: 3000,
    status: "delivered",
    date: "13 Jul 2025, 09:40",
  },
];

export const monthlyOrders = [
  { month: "Jan", orders: 42 },
  { month: "Fév", orders: 55 },
  { month: "Mar", orders: 48 },
  { month: "Avr", orders: 70 },
  { month: "Mai", orders: 88 },
  { month: "Juin", orders: 95 },
  { month: "Juil", orders: 112 },
  { month: "Août", orders: 78 },
  { month: "Sep", orders: 90 },
  { month: "Oct", orders: 105 },
  { month: "Nov", orders: 120 },
  { month: "Déc", orders: 132 },
];

export const statusBreakdown = [
  { name: "Livrées", value: 121, color: "#38bdf8" },
  { name: "En attente", value: 23, color: "#f59e0b" },
  { name: "Annulées", value: 10, color: "#f87171" },
];

export const kpiSparklines = {
  total: [40, 55, 48, 70, 65, 88, 95, 110, 100, 120, 140, 154],
  pending: [12, 18, 15, 22, 20, 28, 25, 30, 27, 24, 26, 23],
  confirmed: [20, 28, 32, 40, 45, 50, 55, 60, 58, 62, 65, 68],
  delivered: [30, 40, 50, 60, 70, 80, 90, 95, 100, 110, 115, 121],
  revenue: [80, 95, 90, 110, 130, 150, 170, 180, 200, 220, 250, 284],
};
