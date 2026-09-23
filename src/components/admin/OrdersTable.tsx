"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Loader2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { STATUS_LABELS, type OrderStatus } from "@/data/admin";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { fetchAllComondes, fetchArticles } from "@/lib/api";

const mapEtatToStatus = (etat: string): OrderStatus => {
  switch (etat) {
    case "en attente":
      return "pending";
    case "confirmee":
      return "confirmed";
    case "livree":
      return "delivered";
    case "annulee":
      return "cancelled";
    default:
      return "pending";
  }
};

type OrderUI = {
  id: string;
  rawId: number;
  client: string;
  phone: string;
  total: number;
  status: OrderStatus;
  date: string;
};

export function OrdersTable() {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        const [comondesList, articlesList] = await Promise.all([
          fetchAllComondes(),
          fetchArticles(),
        ]);

        if (active) {
          const mapped = comondesList.map((c) => {
            const article = articlesList.find(
              (a) => Number(a.idArticle ?? a.id) === Number(c.idArticle)
            );
            const price = article ? Number(article.prix) : 0;
            return {
              id: `#${c.id}`,
              rawId: c.id,
              client: c.nom,
              phone: String(c.numero),
              total: c.quantite * price,
              status: mapEtatToStatus(c.etat),
              date: new Date(c.created_at).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          });
          setOrders(mapped);
        }
      } catch (error) {
        console.error("Failed to load orders for table:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = activeFilter === "all"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-xl border border-white/8 bg-[#111111] overflow-hidden"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-5 py-4 border-b border-white/8 bg-[#151515]/30">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg tracking-wide text-white">
            Dernières commandes
          </h2>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Filtrer:
          </span>
          {(["all", "pending", "confirmed", "delivered", "cancelled"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={cn(
                "px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200",
                activeFilter === status
                  ? "bg-white text-black border-white shadow-lg shadow-white/5"
                  : "bg-[#181818]/60 text-muted hover:text-white border-white/5 hover:border-white/10"
              )}
            >
              {status === "all" ? "Tous" : STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <Link
          href="/admin/commandes"
          className="text-xs text-muted hover:text-white transition-colors border border-white/10 rounded-lg px-3 py-2 shrink-0 text-center"
        >
          Voir toutes les commandes
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 text-xs text-muted uppercase tracking-wider bg-[#181818]/40">
              <th className="px-5 py-3 font-medium">ID Commande</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Téléphone</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                    <span>Chargement des commandes...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 text-white font-medium">{order.id}</td>
                  <td className="px-5 py-3.5 text-white">{order.client}</td>
                  <td className="px-5 py-3.5 text-muted tabular-nums" dir="ltr">
                    {order.phone}
                  </td>
                  <td className="px-5 py-3.5 text-white tabular-nums">
                    {formatPrice(order.total, "fr")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm transition-all duration-200 border",
                        order.status === "pending" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        order.status === "confirmed" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        order.status === "delivered" && "bg-sky-500/10 text-sky-400 border-sky-500/20",
                        order.status === "cancelled" && "bg-red-500/10 text-red-400 border-red-500/20"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full animate-pulse",
                          order.status === "pending" && "bg-amber-400",
                          order.status === "confirmed" && "bg-emerald-400",
                          order.status === "delivered" && "bg-sky-400",
                          order.status === "cancelled" && "bg-red-400"
                        )}
                      />
                      {STATUS_LABELS[order.status as OrderStatus]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-2 text-muted hover:text-white transition-colors"
                        aria-label="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-muted hover:text-white transition-colors"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-muted hover:text-red-400 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
