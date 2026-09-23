"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Loader2, Filter, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { STATUS_LABELS, type OrderStatus } from "@/data/admin";
import {
  type Article,
  type ComondeBackend,
  deleteComonde,
  fetchAllComondes,
  fetchArticles,
  fetchComondeById,
  getArticleDescription,
  updateComonde,
} from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";

const ETAT_OPTIONS: ComondeBackend["etat"][] = [
  "en attente",
  "confirmee",
  "livree",
  "annulee",
];

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

type OrderRow = {
  comonde: ComondeBackend;
  total: number;
  articleLabel: string;
  date: string;
  status: OrderStatus;
};

type FormState = {
  nom: string;
  numero: string;
  taille: ComondeBackend["taille"];
  quantite: string;
  wilaya: string;
  baladia: string;
  etat: ComondeBackend["etat"];
};

function buildOrderRow(comonde: ComondeBackend, articles: Article[]): OrderRow {
  const article = articles.find(
    (a) => Number(a.idArticle ?? a.id) === Number(comonde.idArticle)
  );
  const price = article ? Number(article.prix) : 0;
  const articleLabel = article
    ? getArticleDescription(article).split("\n")[0]?.trim().slice(0, 60) ||
      `Produit #${comonde.idArticle}`
    : `Produit #${comonde.idArticle}`;

  return {
    comonde,
    total: comonde.quantite * price,
    articleLabel,
    status: mapEtatToStatus(comonde.etat),
    date: new Date(comonde.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function comondeToForm(comonde: ComondeBackend): FormState {
  return {
    nom: comonde.nom,
    numero: String(comonde.numero),
    taille: comonde.taille,
    quantite: String(comonde.quantite),
    wilaya: comonde.wilaya,
    baladia: comonde.baladia,
    etat: comonde.etat,
  };
}

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<OrderRow | null>(null);
  const [editing, setEditing] = useState<ComondeBackend | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [comondesList, articlesList] = await Promise.all([
        fetchAllComondes(),
        fetchArticles(),
      ]);
      setArticles(articlesList);
      setOrders(comondesList.map((c) => buildOrderRow(c, articlesList)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  const handleView = async (row: OrderRow) => {
    setEditing(null);
    setForm(null);
    setViewLoading(true);
    setError(null);
    try {
      const fresh = await fetchComondeById(row.comonde.id);
      if (fresh) {
        setViewing(buildOrderRow(fresh, articles));
      } else {
        setViewing(row);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
      setViewing(row);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (row: OrderRow) => {
    setViewing(null);
    setEditing(row.comonde);
    setForm(comondeToForm(row.comonde));
  };

  const handleDelete = async (row: OrderRow) => {
    if (!window.confirm(`Supprimer la commande #${row.comonde.id} ?`)) return;
    setSubmitting(true);
    setError(null);
    try {
      await deleteComonde(row.comonde.id);
      if (viewing?.comonde.id === row.comonde.id) setViewing(null);
      if (editing?.id === row.comonde.id) {
        setEditing(null);
        setForm(null);
      }
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !form) return;

    setSubmitting(true);
    setError(null);
    try {
      await updateComonde({
        id: editing.id,
        idArticle: editing.idArticle,
        nom: form.nom.trim(),
        numero: form.numero.trim(),
        taille: form.taille,
        quantite: Number(form.quantite),
        wilaya: form.wilaya.trim(),
        baladia: form.baladia.trim(),
        etat: form.etat,
      });
      setEditing(null);
      setForm(null);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="Commandes">
      <div className="space-y-6">
        {(viewing || editing) && (
          <section className="rounded-xl border border-white/8 bg-[#111111] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h2 className="font-display text-xl tracking-wide text-white">
                {editing ? `Modifier #${editing.id}` : `Commande #${viewing?.comonde.id}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setViewing(null);
                  setEditing(null);
                  setForm(null);
                }}
                className="text-muted hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {editing && form ? (
              <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      Client
                    </span>
                    <input
                      type="text"
                      required
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      Téléphone
                    </span>
                    <input
                      type="tel"
                      required
                      value={form.numero}
                      onChange={(e) => setForm({ ...form, numero: e.target.value })}
                      className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                      dir="ltr"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      Taille
                    </span>
                    <select
                      value={form.taille}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          taille: e.target.value as ComondeBackend["taille"],
                        })
                      }
                      className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25 cursor-pointer"
                    >
                      {(["S", "M", "L", "XL", "XXL"] as const).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      Quantité
                    </span>
                    <input
                      type="number"
                      min={1}
                      required
                      value={form.quantite}
                      onChange={(e) => setForm({ ...form, quantite: e.target.value })}
                      className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      Wilaya
                    </span>
                    <input
                      type="text"
                      required
                      value={form.wilaya}
                      onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                      className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      Baladia
                    </span>
                    <input
                      type="text"
                      required
                      value={form.baladia}
                      onChange={(e) => setForm({ ...form, baladia: e.target.value })}
                      className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
                      Statut
                    </span>
                    <select
                      value={form.etat}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          etat: e.target.value as ComondeBackend["etat"],
                        })
                      }
                      className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25 cursor-pointer"
                    >
                      {ETAT_OPTIONS.map((etat) => (
                        <option key={etat} value={etat}>
                          {STATUS_LABELS[mapEtatToStatus(etat)]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/90 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Enregistrer
                </button>
              </form>
            ) : viewLoading ? (
              <div className="flex items-center justify-center py-16 text-muted">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : viewing ? (
              <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                {[
                  ["ID", `#${viewing.comonde.id}`],
                  ["Produit", viewing.articleLabel],
                  ["Client", viewing.comonde.nom],
                  ["Téléphone", String(viewing.comonde.numero)],
                  ["Taille", viewing.comonde.taille],
                  ["Quantité", String(viewing.comonde.quantite)],
                  ["Wilaya", viewing.comonde.wilaya],
                  ["Baladia", viewing.comonde.baladia],
                  ["Statut", STATUS_LABELS[viewing.status]],
                  ["Total", formatPrice(viewing.total, "fr")],
                  ["Date", viewing.date],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                      {label}
                    </p>
                    <p className="text-white">{value}</p>
                  </div>
                ))}
                <div className="sm:col-span-2 flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(viewing)}
                    className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-xs tracking-[0.15em] uppercase text-white hover:bg-white/5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(viewing)}
                    className="inline-flex items-center gap-2 border border-red-500/30 px-4 py-2 text-xs tracking-[0.15em] uppercase text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        )}

        <div className="rounded-xl border border-white/8 bg-[#111111] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151515]/30">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted">
                {loading ? "Chargement..." : `${filteredOrders.length} commandes`}
              </p>
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted flex items-center gap-1 mr-1">
                <Filter className="h-3 w-3" /> Filtrer:
              </span>
              {(["all", "pending", "confirmed", "delivered", "cancelled"] as const).map(
                (status) => (
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
                )
              )}
            </div>

            <Link href="/admin" className="text-xs text-muted hover:text-white shrink-0">
              ← Dashboard
            </Link>
          </div>

          {error && !editing && (
            <p className="px-5 py-3 text-sm text-red-400 border-b border-white/8" role="alert">
              {error}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 text-xs text-muted uppercase tracking-wider bg-[#181818]/40">
                  <th className="px-5 py-3 font-medium">ID</th>
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
                      key={order.comonde.id}
                      onClick={() => handleView(order)}
                      className={cn(
                        "hover:bg-white/[0.02] transition-colors cursor-pointer",
                        viewing?.comonde.id === order.comonde.id && "bg-white/[0.04]"
                      )}
                    >
                      <td className="px-5 py-3.5 text-white font-medium">#{order.comonde.id}</td>
                      <td className="px-5 py-3.5 text-white">{order.comonde.nom}</td>
                      <td className="px-5 py-3.5 text-muted tabular-nums" dir="ltr">
                        {order.comonde.numero}
                      </td>
                      <td className="px-5 py-3.5 text-white tabular-nums">
                        {formatPrice(order.total, "fr")}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border",
                            order.status === "pending" &&
                              "bg-amber-500/10 text-amber-400 border-amber-500/20",
                            order.status === "confirmed" &&
                              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                            order.status === "delivered" &&
                              "bg-sky-500/10 text-sky-400 border-sky-500/20",
                            order.status === "cancelled" &&
                              "bg-red-500/10 text-red-400 border-red-500/20"
                          )}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted whitespace-nowrap">{order.date}</td>
                      <td className="px-5 py-3.5">
                        <div
                          className="flex justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleView(order)}
                            className="p-2 text-muted hover:text-white"
                            aria-label="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(order)}
                            className="p-2 text-muted hover:text-white"
                            aria-label="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(order)}
                            className="p-2 text-muted hover:text-red-400"
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
        </div>
      </div>
    </AdminShell>
  );
}
