"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyOrders } from "@/data/admin";

export function OrdersBarChart() {
  return (
    <div className="rounded-xl border border-white/8 bg-[#111111] p-5 md:p-6 h-full">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg tracking-wide text-white">
          Commandes par mois
        </h2>
        <select className="rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-1.5 text-xs text-muted outline-none cursor-pointer">
          <option>Cette année</option>
          <option>Année dernière</option>
        </select>
      </div>
      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyOrders} barCategoryGap="20%">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e5e5e5" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#525252" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 11 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#bdbdbd" }}
            />
            <Bar dataKey="orders" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatusDonutChart({
  pending = 0,
  confirmed = 0,
  delivered = 0,
  cancelled = 0,
}: {
  pending?: number;
  confirmed?: number;
  delivered?: number;
  cancelled?: number;
}) {
  const dynamicStatusBreakdown = [
    { name: "Livrées", value: delivered, color: "#38bdf8" },
    { name: "Confirmées", value: confirmed, color: "#34d399" },
    { name: "En attente", value: pending, color: "#f59e0b" },
    { name: "Annulées", value: cancelled, color: "#f87171" },
  ];

  const total = dynamicStatusBreakdown.reduce((a, b) => a + b.value, 0);

  return (
    <div className="rounded-xl border border-white/8 bg-[#111111] p-5 md:p-6 h-full">
      <h2 className="font-display text-lg tracking-wide text-white mb-6">
        Statut des commandes
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dynamicStatusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={total > 0 ? 3 : 0}
                strokeWidth={0}
              >
                {dynamicStatusBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="font-display text-2xl text-white">{total}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider">Total</p>
          </div>
        </div>

        <ul className="w-full space-y-3">
          {dynamicStatusBreakdown.map((item) => (
            <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-muted">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
              <span className="text-white tabular-nums">
                {item.value}{" "}
                <span className="text-muted text-xs">
                  ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
