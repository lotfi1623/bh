"use client";

import { useEffect, useState } from "react";
import { CatalogImage } from "@/components/ui/CatalogImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";
import { fetchProducts, isCatalogImage } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/types";

export function ProductShowcase() {
  const { t, locale } = useLanguage();
  const [featured, setFeatured] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const labels = [
    t.showcase.front,
    t.showcase.back,
    t.showcase.lifestyle,
    t.showcase.detail,
  ];

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const products = await fetchProducts();
        if (!cancelled) {
          setFeatured(products.find((p) => p.featured) ?? products[0] ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </section>
    );
  }

  if (!featured) return null;

  const activeImage = featured.images[activeIndex] ?? featured.images[0];

  return (
    <section id="showcase" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.showcase.eyebrow}
          title={t.showcase.title}
          description={t.showcase.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <FadeUp className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-card border border-white/8 group">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {activeImage && (
                  <CatalogImage
                    src={activeImage}
                    alt={`${featured.name} — ${labels[activeIndex] ?? ""}`}
                    fill
                    className={
                      activeImage.includes("product") || isCatalogImage(activeImage)
                        ? "object-contain object-center p-8 md:p-12 transition-transform duration-700 group-hover:scale-105"
                        : "object-cover transition-transform duration-700 group-hover:scale-105"
                    }
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                )}
              </motion.div>
              <span className="absolute top-4 start-4 text-[10px] tracking-[0.3em] uppercase text-white/70 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                {labels[activeIndex] ?? ""}
              </span>
            </div>

            {featured.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {featured.images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={labels[i]}
                    className={cn(
                      "relative h-20 w-16 shrink-0 overflow-hidden border transition-all duration-300 bg-card",
                      activeIndex === i
                        ? "border-white shadow-glow-sm"
                        : "border-white/8 opacity-60 hover:opacity-100"
                    )}
                  >
                    <CatalogImage
                      src={img}
                      alt=""
                      fill
                      className={
                        img.includes("product") || isCatalogImage(img)
                          ? "object-contain p-1"
                          : "object-cover"
                      }
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </FadeUp>

          <FadeUp delay={0.15} className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-3">
              {t.showcase.signature}
            </p>
            <h3 className="font-display text-4xl md:text-5xl tracking-wide text-white">
              {featured.name}
            </h3>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-xl text-white">
                {formatPrice(featured.price, locale)}
              </span>
              {featured.compareAt && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(featured.compareAt, locale)}
                </span>
              )}
            </div>
            <p className="mt-6 text-sm text-muted leading-relaxed">{featured.description}</p>

            <ul className="mt-8 space-y-3 border-t border-white/8 pt-8">
              {[
                featured.specs.material,
                featured.specs.weight,
                featured.specs.fit,
                featured.specs.printing,
              ].map((spec) => (
                <li key={spec} className="flex items-center gap-3 text-sm text-muted">
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  {spec}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button
                href={`/product/${featured.id}`}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                {t.showcase.viewProduct}
              </Button>
              <Button href="/shop" variant="outline" size="lg" className="flex-1">
                {t.showcase.fullCollection}
              </Button>
            </div>

            <Link
              href="/#size-guide"
              className="mt-6 inline-block text-xs tracking-[0.2em] uppercase text-muted hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5"
            >
              {t.showcase.sizeGuide}
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
