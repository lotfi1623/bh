"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { OrdersBarChart, StatusDonutChart } from "@/components/admin/AdminCharts";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { kpiSparklines } from "@/data/admin";
import { fetchComondeStats, type ComondeStats } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<ComondeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadStats() {
      try {
        setLoading(true);
        const data = await fetchComondeStats();
        if (active) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
        if (active) {
          setError("Failed to fetch dashboard data. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="p-4 md:p-6 space-y-6">
          {/* Date filter & Refresh */}
          <div className="flex justify-between items-center gap-3">
            <div>
              {error && (
                <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                  {error}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {loading && (
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <Loader2 className="h-3 w-3 animate-spin text-white" />
                  Mise à jour...
                </span>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-[#111111] px-3 py-2 text-xs text-muted hover:text-white transition-colors animate-fade-in"
              >
                <Calendar className="h-3.5 w-3.5" />
                {"Dernière mise à jour: Aujourd'hui"}
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <KpiCard
              title="Total Commandes"
              value={loading ? "..." : stats ? String(stats.totalCommandes) : "0"}
              sparkline={kpiSparklines.total}
              sparkColor="#e5e5e5"
              delay={0}
            />
            <KpiCard
              title="En Attente"
              value={loading ? "..." : stats ? String(stats.pending) : "0"}
              sparkline={kpiSparklines.pending}
              sparkColor="#f59e0b"
              delay={0.05}
            />
            <KpiCard
              title="Confirmées"
              value={loading ? "..." : stats ? String(stats.confirmed) : "0"}
              sparkline={kpiSparklines.confirmed}
              sparkColor="#34d399"
              delay={0.1}
            />
            <KpiCard
              title="Livrées"
              value={loading ? "..." : stats ? String(stats.delivered) : "0"}
              sparkline={kpiSparklines.delivered}
              sparkColor="#38bdf8"
              delay={0.15}
            />
            <KpiCard
              title="Annulées"
              value={loading ? "..." : stats ? String(stats.cancelled) : "0"}
              sparkline={[6, 9, 8, 12, 5, 8, 10, 7, 9, 10, 8, 9]}
              sparkColor="#f87171"
              delay={0.18}
            />
            <KpiCard
              title="Revenus Total"
              value={loading ? "..." : stats ? formatPrice(stats.totalRevenue, "fr") : "0 DA"}
              sparkline={kpiSparklines.revenue}
              sparkColor="#34d399"
              delay={0.2}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="lg:col-span-3">
              <OrdersBarChart />
            </div>
            <div className="lg:col-span-2">
              <StatusDonutChart
                pending={stats?.pending || 0}
                confirmed={stats?.confirmed || 0}
                delivered={stats?.delivered || 0}
                cancelled={stats?.cancelled || 0}
              />
            </div>
          </div>

          {/* Orders table */}
          <OrdersTable />
        </div>
      </div>
    </div>
  );
}
