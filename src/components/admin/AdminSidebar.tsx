"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Star,
  Ticket,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag, badge: 23 },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/avis", label: "Avis", icon: Star },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col bg-[#0a0a0a] border-r border-white/8">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/8">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden">
          <Image
            src="/images/logo-bh.png"
            alt="BH"
            fill
            className="object-contain object-left"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg tracking-wider text-white leading-none truncate">
            BROTHER HOOD
          </p>
          <p className="mt-1 text-[9px] tracking-[0.25em] uppercase text-muted">
            Admin Panel
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto lg:hidden p-1 text-muted hover:text-white"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className="flex-1">{item.label}</span>
              {item.badge != null && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-[10px] font-semibold text-amber-400">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Promo card */}
      <div className="mx-3 mb-3 overflow-hidden rounded-xl border border-white/8 bg-[#111111]">
        <div className="relative h-28 bg-card">
          <Image
            src="/images/product-back.png"
            alt="Brother Hood"
            fill
            className="object-contain p-3"
            sizes="240px"
          />
        </div>
        <div className="p-3">
          <p className="font-display text-sm tracking-wide text-white">
            BROTHER HOOD
          </p>
          <p className="mt-1 text-[9px] tracking-[0.15em] uppercase text-muted">
            Discipline · Strength · Brotherhood
          </p>
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition-colors hover:bg-white/10"
          >
            Voir la boutique
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/8 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Déconnexion
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Fermer le menu"
            onClick={onClose}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">{content}</div>
        </div>
      )}
    </>
  );
}
