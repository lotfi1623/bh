import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Brother Hood premium calisthenics apparel — heavyweight tees, hoodies, shorts, and accessories.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 px-5 text-muted text-sm">Loading shop…</div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
