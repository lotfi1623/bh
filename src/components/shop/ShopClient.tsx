"use client";

import { useEffect, useMemo, useState } from "react";
import { CatalogImage } from "@/components/ui/CatalogImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { fetchProducts, isCatalogImage } from "@/lib/api";
import { FadeUp } from "@/components/ui/FadeUp";
import { cn, formatPrice } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

function shopProductImage(product: Product): string | undefined {
  return (
    product.images.find((src) => !src.includes("/team-")) ?? product.images[0]
  );
}

function ProductCard({
  product,
  index,
  viewLabel,
  newLabel,
  locale,
}: {
  product: Product;
  index: number;
  viewLabel: string;
  newLabel: string;
  locale: "fr" | "ar";
}) {
  const imageSrc = shopProductImage(product);
  const isProductShot =
    imageSrc &&
    (imageSrc.includes("product") ||
      imageSrc.includes("brotherhood-tee") ||
      isCatalogImage(imageSrc));

  return (
    <FadeUp delay={(index % 4) * 0.06} as="article">
      <Link href={`/product/${product.id}`} className="group block">
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-[3/4] overflow-hidden border border-white/8 bg-card"
        >
          {imageSrc ? (
            <CatalogImage
              src={imageSrc}
              alt={product.name}
              fill
              className={
                isProductShot
                  ? "object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  : "object-cover transition-transform duration-700 group-hover:scale-110"
              }
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-white/5" />
          )}
          {product.tags.includes("new") && (
            <span className="absolute top-3 start-3 text-[9px] tracking-[0.25em] uppercase bg-white text-black px-2 py-1">
              {newLabel}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white">
              {viewLabel}
            </span>
          </div>
        </motion.div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl tracking-wide text-white group-hover:text-white/80 transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 text-[11px] tracking-widest uppercase text-muted">
              {product.category}
            </p>
          </div>
          <p className="text-sm text-white shrink-0">
            {formatPrice(product.price, locale)}
          </p>
        </div>
      </Link>
    </FadeUp>
  );
}

export function ShopClient() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCat = searchParams.get("category") ?? "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);
  const [sort, setSort] = useState<SortKey>("featured");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [priceCeiling, setPriceCeiling] = useState(5000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(data);
          const topPrice = data.reduce((max, p) => Math.max(max, p.price), 0);
          const ceiling = Math.max(topPrice, 100);
          setPriceCeiling(ceiling);
          setMaxPrice(ceiling);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load products");
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

  const CATEGORIES = [
    { value: "all", label: t.shop.all },
    { value: "tees", label: t.shop.tees },
    { value: "hoodies", label: t.shop.hoodies },
    { value: "shorts", label: t.shop.shorts },
    { value: "accessories", label: t.shop.accessories },
  ];

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.includes(q))
      );
    }
    list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, category, query, sort, maxPrice]);

  return (
    <div className="pt-28 md:pt-32 pb-24 px-5 md:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="mb-12 md:mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-3">
            {t.shop.eyebrow}
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide text-white">
            {t.shop.title}
          </h1>
          <p className="mt-4 text-sm text-muted max-w-md">{t.shop.description}</p>
        </FadeUp>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8 border-b border-white/8 pb-6">
          <div className="flex items-center gap-3 flex-1 border border-white/8 bg-card px-4 py-3">
            <Search className="h-4 w-4 text-muted shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.shop.search}
              className="w-full bg-transparent text-sm text-white placeholder:text-muted/50 outline-none"
              aria-label={t.shop.search}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="lg:hidden flex items-center gap-2 border border-white/8 px-4 py-3 text-xs tracking-[0.2em] uppercase text-muted hover:text-white"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t.shop.filters}
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort"
              className="border border-white/8 bg-card px-4 py-3 text-xs tracking-[0.15em] uppercase text-white outline-none cursor-pointer"
            >
              <option value="featured">{t.shop.sortFeatured}</option>
              <option value="price-asc">{t.shop.sortPriceAsc}</option>
              <option value="price-desc">{t.shop.sortPriceDesc}</option>
              <option value="name">{t.shop.sortName}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside
            className={cn(
              "lg:col-span-3 space-y-8",
              filtersOpen ? "block" : "hidden lg:block"
            )}
          >
            <div>
              <p className="font-display text-lg tracking-wide text-white mb-4">
                {t.shop.categories}
              </p>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        "text-sm transition-colors w-full text-start py-1",
                        category === cat.value
                          ? "text-white"
                          : "text-muted hover:text-white"
                      )}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-lg tracking-wide text-white mb-4">
                {t.shop.maxPrice}
              </p>
              <input
                type="range"
                min={0}
                max={priceCeiling}
                step={priceCeiling <= 1000 ? 10 : 100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-white"
                aria-label={t.shop.maxPrice}
              />
              <p className="mt-2 text-xs text-muted">
                {t.shop.upTo} {formatPrice(maxPrice, locale)}
              </p>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <p className="text-xs text-muted mb-6 tracking-widest uppercase">
              {filtered.length}{" "}
              {filtered.length === 1 ? t.shop.products : t.shop.productsPlural}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : error ? (
              <p className="text-red-400 text-sm py-20 text-center" role="alert">
                {error}
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-muted text-sm py-20 text-center">{t.shop.noResults}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    viewLabel={t.shop.viewProduct}
                    newLabel={t.shop.new}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
