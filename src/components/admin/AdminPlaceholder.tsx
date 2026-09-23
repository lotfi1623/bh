"use client";

import { AdminShell } from "@/components/admin/AdminShell";

export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AdminShell title={title}>
      <div className="rounded-xl border border-white/8 bg-[#111111] p-10 md:p-16 text-center">
        <h2 className="font-display text-3xl tracking-wide text-white">{title}</h2>
        <p className="mt-3 text-sm text-muted max-w-md mx-auto">{description}</p>
        <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-muted/50">
          Bientôt disponible
        </p>
      </div>
    </AdminShell>
  );
}
