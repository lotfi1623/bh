"use client";

import { useMemo, useState } from "react";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { Minus, Plus } from "lucide-react";
import type { Product, ProductSize } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { OrderForm } from "@/components/order/OrderForm";
import { isCatalogImage } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";

export function ProductClient({ product }: { product: Product; related?: Product[] }) {
  const { t, locale } = useLanguage();
  const [size, setSize] = useState<ProductSize>(product.sizes[2] ?? "L");
  const [color, setColor] = useState(product.colors[0]?.name ?? "Noir");
  const [qty, setQty] = useState(1);

  const orderItems = useMemo(
    () => [{ product, size, color, quantity: qty }],
    [product, size, color, qty]
  );

  const mainImage = product.images[0] ?? "";

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Photo grande — sticky */}
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden border border-white/8 bg-card">
              <CatalogImage
                src={mainImage}
                alt={product.name}
                fill
                priority
                className={
                  mainImage.includes("product") || isCatalogImage(mainImage)
                    ? "object-contain p-6 md:p-10"
                    : "object-cover"
                }
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Formulaire + options */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-3xl md:text-4xl tracking-wide text-white">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl text-white">{formatPrice(product.price, locale)}</p>
              {product.description && (
                <p className="mt-4 text-sm text-muted leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              )}
            </div>

            {/* Taille + quantité */}
            <div className="space-y-5 border-t border-white/8 pt-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted mb-3">
                  {t.product.size}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn(
                        "min-w-[3rem] px-4 py-2.5 text-xs tracking-wider border transition-all",
                        size === s
                          ? "border-white bg-white text-black"
                          : "border-white/15 text-muted hover:border-white/40 hover:text-white"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted mb-3">
                  {t.product.quantity}
                </p>
                <div className="inline-flex items-center border border-white/15">
                  <button
                    type="button"
                    aria-label="-"
                    className="p-3 text-muted hover:text-white"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm text-white">{qty}</span>
                  <button
                    type="button"
                    aria-label="+"
                    className="p-3 text-muted hover:text-white"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Formulaire commande */}
            <div id="order-section" className="border-t border-white/8 pt-6 scroll-mt-28">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-4">
                {t.checkout.formTitle}
              </p>
              <OrderForm items={orderItems} formOnly showContinueLink={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
