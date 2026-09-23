"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();
  const { t, locale } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t.cart.title}
            className="fixed top-0 end-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#0a0a0a] border-s border-white/8 shadow-2xl"
            initial={{ x: locale === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: locale === "ar" ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
          >
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
              <h2 className="font-display text-2xl tracking-wide text-white">
                {t.cart.title} ({itemCount})
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close"
                className="p-1 text-muted hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center gap-4">
                  <p className="text-muted text-sm">{t.cart.empty}</p>
                  <Button href="/shop" variant="secondary" size="sm" onClick={closeCart}>
                    {t.cart.shopNow}
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex gap-4"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-card">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="font-display text-lg tracking-wide text-white leading-tight">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {item.size} · {item.color}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.product.id, item.size, item.color)
                            }
                            className="text-muted hover:text-white h-fit"
                            aria-label={t.cart.remove}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-white/10">
                            <button
                              type="button"
                              aria-label="-"
                              className="p-2 text-muted hover:text-white"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="+"
                              className="p-2 text-muted hover:text-white"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm text-white">
                            {formatPrice(item.product.price * item.quantity, locale)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/8 px-6 py-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted uppercase tracking-widest text-xs">
                    {t.cart.subtotal}
                  </span>
                  <span className="text-white font-medium">
                    {formatPrice(subtotal, locale)}
                  </span>
                </div>
                <p className="text-[11px] text-muted">{t.cart.shippingNote}</p>
                <Button
                  href={
                    items.length === 1
                      ? `/product/${items[0].product.id}#order-section`
                      : "/checkout"
                  }
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={closeCart}
                >
                  {t.cart.checkout}
                </Button>
                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full text-center text-xs uppercase tracking-[0.2em] text-muted hover:text-white transition-colors py-2"
                >
                  {t.cart.continue}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
