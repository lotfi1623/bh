"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { NAV_LINKS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { t, locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLabels = {
    home: t.nav.home,
    shop: t.nav.shop,
    story: t.nav.story,
    packaging: t.nav.packaging,
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || !isHome || mobileOpen
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-white/8"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="group relative z-10">
            <span className="font-display text-2xl md:text-3xl tracking-wider text-white transition-opacity group-hover:opacity-80">
              BROTHER HOOD
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-[11px] uppercase tracking-[0.25em] transition-colors duration-300",
                    pathname === link.href
                      ? "text-white"
                      : "text-muted hover:text-white"
                  )}
                >
                  {navLabels[link.labelKey]}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 md:gap-3 relative z-10">
            {/* Language switcher */}
            <div className="flex items-center border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setLocale("fr")}
                className={cn(
                  "px-2.5 py-1.5 text-[10px] tracking-widest uppercase transition-colors",
                  locale === "fr"
                    ? "bg-white text-black"
                    : "text-muted hover:text-white"
                )}
                aria-label="Français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLocale("ar")}
                className={cn(
                  "px-2.5 py-1.5 text-[10px] tracking-widest uppercase transition-colors",
                  locale === "ar"
                    ? "bg-white text-black"
                    : "text-muted hover:text-white"
                )}
                aria-label="العربية"
              >
                ع
              </button>
            </div>

            <button
              type="button"
              aria-label={t.nav.search}
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label={`${t.nav.cart}${itemCount ? `, ${itemCount}` : ""}`}
              onClick={openCart}
              className="relative p-2 text-white/80 hover:text-white transition-colors"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-black">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? "Close" : "Menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-white"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-white/8 bg-[#050505]"
            >
              <form
                action="/shop"
                className="mx-auto flex max-w-7xl items-center gap-3 px-5 md:px-8 py-4"
              >
                <Search className="h-4 w-4 text-muted shrink-0" />
                <input
                  name="q"
                  type="search"
                  placeholder={t.nav.searchPlaceholder}
                  autoFocus
                  className="w-full bg-transparent text-sm text-white placeholder:text-muted/60 outline-none"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#050505] pt-24 px-8 md:hidden"
          >
            <ul className="flex flex-col gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-4xl tracking-wide text-white"
                  >
                    {navLabels[link.labelKey]}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
