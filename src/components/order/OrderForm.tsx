"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { wilayas, getWilayaByCode } from "@/data/algeria";
import { getShippingPrice } from "@/data/shipping";
import { Button } from "@/components/ui/Button";
import { submitCustomerOrder } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import type { Product, ProductSize } from "@/types";

export type OrderLineItem = {
  product: Product;
  size: ProductSize;
  color: string;
  quantity: number;
};

type OrderFormProps = {
  items: OrderLineItem[];
  /** Allow editing size/qty in summary (cart checkout mode) */
  editable?: boolean;
  onUpdateQuantity?: (
    productId: string,
    size: ProductSize,
    color: string,
    quantity: number
  ) => void;
  onUpdateSize?: (
    productId: string,
    oldSize: ProductSize,
    newSize: ProductSize,
    color: string
  ) => void;
  onRemoveItem?: (productId: string, size: ProductSize, color: string) => void;
  onOrderSuccess?: () => void;
  showContinueLink?: boolean;
  compact?: boolean;
  /** Product page: form only, no summary sidebar */
  formOnly?: boolean;
};

export function OrderForm({
  items,
  editable = false,
  onUpdateQuantity,
  onUpdateSize,
  onRemoveItem,
  onOrderSuccess,
  showContinueLink = true,
  compact = false,
  formOnly = false,
}: OrderFormProps) {
  const { t, locale } = useLanguage();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya: "",
    baladia: "",
  });
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");

  const selectedWilaya = useMemo(
    () => (form.wilaya ? getWilayaByCode(form.wilaya) : undefined),
    [form.wilaya]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const shippingCost = useMemo(() => {
    if (!form.wilaya) return 0;
    return getShippingPrice(form.wilaya, deliveryType);
  }, [form.wilaya, deliveryType]);

  const total = subtotal + shippingCost;
  const communes = selectedWilaya?.communes ?? [];

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => {
      if (key === "wilaya") return { ...f, wilaya: value, baladia: "" };
      return { ...f, [key]: value };
    });
  };

  const isValid =
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 9 &&
    !!form.wilaya &&
    !!form.baladia &&
    items.length > 0;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setIsSubmitting(true);
    setError("");

    try {
      const wilayaLabel = selectedWilaya
        ? `${selectedWilaya.nameFr} (${deliveryType === "home" ? "Domicile" : "Stop Desk"})`
        : form.wilaya;

      const { reference } = await submitCustomerOrder({
        name: form.name.trim(),
        phone: form.phone.trim(),
        wilaya: wilayaLabel,
        baladia: form.baladia,
        deliveryType,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        subtotal,
        shipping: shippingCost,
        total,
      });

      setOrderId(reference);
      setPlaced(true);
      onOrderSuccess?.();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue lors de la commande."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (ok: boolean) =>
    touched && !ok ? (
      <span className="mt-1 block text-[11px] text-white/50">{t.checkout.required}</span>
    ) : null;

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-16 w-16 rounded-full border border-white/20 flex items-center justify-center mb-8"
        >
          <Check className="h-7 w-7 text-white" />
        </motion.div>
        <h2 className="font-display text-4xl md:text-5xl tracking-wide text-white mb-4">
          {t.checkout.confirmedTitle}
        </h2>
        <p className="text-muted text-sm max-w-md mb-2">{t.checkout.confirmedDesc}</p>
        <p className="text-xs text-muted/60 tracking-widest uppercase mb-10">
          {t.checkout.orderNumber} #{orderId}
        </p>
        <Button href="/shop" variant="primary">
          {t.checkout.continueShopping}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-10",
        formOnly ? "" : compact ? "lg:grid-cols-1" : "lg:grid-cols-12 lg:gap-12"
      )}
    >
      <form
        onSubmit={placeOrder}
        className={cn(
          "space-y-5",
          formOnly ? "" : compact ? "order-2" : "lg:col-span-7 order-2 lg:order-1"
        )}
      >
        {!formOnly && (
          <div>
            <h2 className="font-display text-2xl tracking-wide text-white mb-1">
              {t.checkout.formTitle}
            </h2>
            <p className="text-sm text-muted">{t.checkout.formDesc}</p>
          </div>
        )}

        <label className="block">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
            {t.checkout.name} *
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={cn(
              "mt-2 w-full border bg-card px-4 py-3.5 text-sm text-white outline-none focus:border-white/40 transition-colors",
              touched && form.name.trim().length < 2 ? "border-white/40" : "border-white/10"
            )}
            autoComplete="name"
          />
          {fieldError(form.name.trim().length >= 2)}
        </label>

        <label className="block">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
            {t.checkout.phone} *
          </span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="05 XX XX XX XX"
            className={cn(
              "mt-2 w-full border bg-card px-4 py-3.5 text-sm text-white outline-none focus:border-white/40 transition-colors",
              touched && form.phone.trim().length < 9 ? "border-white/40" : "border-white/10"
            )}
            autoComplete="tel"
            dir="ltr"
          />
          {fieldError(form.phone.trim().length >= 9)}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
              {t.checkout.wilaya} *
            </span>
            <select
              value={form.wilaya}
              onChange={(e) => update("wilaya", e.target.value)}
              className={cn(
                "mt-2 w-full border bg-card px-4 py-3.5 text-sm text-white outline-none focus:border-white/40 cursor-pointer",
                touched && !form.wilaya ? "border-white/40" : "border-white/10"
              )}
            >
              <option value="">{t.checkout.selectWilaya}</option>
              {[...wilayas]
                .sort((a, b) => a.nameFr.localeCompare(b.nameFr, "fr"))
                .map((w) => (
                  <option key={w.code} value={w.code}>
                    {locale === "ar" ? w.nameAr : w.nameFr}
                  </option>
                ))}
            </select>
            {fieldError(!!form.wilaya)}
          </label>

          <label className="block">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted">
              {t.checkout.baladia} *
            </span>
            <select
              value={form.baladia}
              onChange={(e) => update("baladia", e.target.value)}
              disabled={!form.wilaya}
              className={cn(
                "mt-2 w-full border bg-card px-4 py-3.5 text-sm text-white outline-none focus:border-white/40 cursor-pointer disabled:opacity-40",
                touched && !form.baladia ? "border-white/40" : "border-white/10"
              )}
            >
              <option value="">{t.checkout.selectBaladia}</option>
              {communes.map((c) => (
                <option key={c.nameFr} value={c.nameFr}>
                  {locale === "ar" ? c.nameAr : c.nameFr}
                </option>
              ))}
            </select>
            {fieldError(!!form.baladia)}
          </label>
        </div>

        {form.wilaya && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 pt-2"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted block">
              {t.checkout.deliveryMethod} *
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["home", "desk"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDeliveryType(type)}
                  className={cn(
                    "flex flex-col justify-between p-4 border bg-card transition-all duration-200 cursor-pointer focus:outline-none",
                    locale === "ar" ? "text-right" : "text-left",
                    deliveryType === type
                      ? "border-white text-white"
                      : "border-white/10 text-muted hover:border-white/20 hover:text-white"
                  )}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-sm font-semibold">
                      {type === "home" ? t.checkout.shippingHome : t.checkout.shippingDesk}
                    </span>
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                        deliveryType === type ? "border-white" : "border-white/30"
                      )}
                    >
                      {deliveryType === type && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted/65 mb-4 block">
                    {type === "home"
                      ? locale === "ar"
                        ? "توصيل مباشر إلى باب منزلك"
                        : "Livraison directe à votre domicile"
                      : locale === "ar"
                        ? "الاستلام من مكتب شركة التوصيل"
                        : "Récupérer au bureau du transporteur"}
                  </span>
                  <span className="text-sm font-semibold tracking-wide mt-auto">
                    {formatPrice(getShippingPrice(form.wilaya, type), locale)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="pt-4 flex items-center gap-3 text-xs text-muted border border-white/8 bg-card/50 px-4 py-3">
          <Check className="h-4 w-4 text-white shrink-0" />
          {t.checkout.paymentMethod}
        </div>

        {formOnly && (
          <div className="space-y-2 border border-white/8 bg-card/50 px-4 py-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>{t.checkout.subtotal}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{t.checkout.shipping}</span>
              <span>
                {form.wilaya
                  ? formatPrice(shippingCost, locale)
                  : t.checkout.shippingFixed}
              </span>
            </div>
            <div className="flex justify-between text-white pt-2 border-t border-white/8 font-medium">
              <span>{t.checkout.total}</span>
              <span>{formatPrice(form.wilaya ? total : subtotal, locale)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? "Envoi en cours..." : t.checkout.placeOrder}
        </Button>
        {error && (
          <p className="text-red-500 text-xs text-center mt-2 font-medium">{error}</p>
        )}
      </form>

      {!formOnly && (
      <aside className={cn(compact ? "order-1" : "lg:col-span-5 order-1 lg:order-2")}>
        <div className="border border-white/8 bg-card p-6 md:p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-xl tracking-wide text-white mb-6">
            {t.checkout.summary}
          </h2>
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 items-center border-b border-white/5 pb-4 last:border-0 last:pb-0"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-background border border-white/10">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase text-muted tracking-wider">
                        {locale === "ar" ? "المقاس:" : "Taille:"}
                      </span>
                      {editable && onUpdateSize ? (
                        <select
                          value={item.size}
                          onChange={(e) =>
                            onUpdateSize(
                              item.product.id,
                              item.size,
                              e.target.value as ProductSize,
                              item.color
                            )
                          }
                          className="bg-card text-white border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-white/30 cursor-pointer"
                        >
                          {item.product.sizes.map((s) => (
                            <option key={s} value={s} className="bg-card text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-white">{item.size}</span>
                      )}
                    </div>
                    {item.color && (
                      <span className="text-xs text-muted">· {item.color}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase text-muted tracking-wider">
                      {locale === "ar" ? "الكمية:" : "Qté:"}
                    </span>
                    {editable && onUpdateQuantity ? (
                      <div className="flex items-center border border-white/10 rounded">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="p-1 text-muted hover:text-white transition-colors"
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="p-1 text-muted hover:text-white transition-colors"
                          onClick={() =>
                            onUpdateQuantity(
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
                    ) : (
                      <span className="text-xs text-white">{item.quantity}</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between h-24 py-1">
                  <p className="text-sm font-semibold text-white">
                    {formatPrice(item.product.price * item.quantity, locale)}
                  </p>
                  {editable && onRemoveItem && (
                    <button
                      type="button"
                      onClick={() =>
                        onRemoveItem(item.product.id, item.size, item.color)
                      }
                      className="text-xs text-muted hover:text-red-400 transition-colors uppercase tracking-wider mt-auto"
                    >
                      {locale === "ar" ? "حذف" : "Retirer"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-white/8 pt-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>{t.checkout.subtotal}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{t.checkout.shipping}</span>
              <span>
                {form.wilaya
                  ? formatPrice(shippingCost, locale)
                  : t.checkout.shippingFixed}
              </span>
            </div>
            <div className="flex justify-between text-white pt-2 border-t border-white/8 font-medium">
              <span>{t.checkout.total}</span>
              <span>{formatPrice(form.wilaya ? total : subtotal, locale)}</span>
            </div>
          </div>
          {showContinueLink && (
            <Link
              href="/shop"
              className="mt-6 inline-block text-[10px] tracking-[0.2em] uppercase text-muted hover:text-white"
            >
              ← {t.cart.continue}
            </Link>
          )}
        </div>
      </aside>
      )}
    </div>
  );
}
