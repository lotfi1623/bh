"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { OrderForm } from "@/components/order/OrderForm";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";

export function CheckoutClient() {
  const { items, clearCart, updateQuantity, updateSize, removeItem } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center pt-28">
        <h1 className="font-display text-4xl tracking-wide text-white mb-4">
          {t.checkout.emptyTitle}
        </h1>
        <p className="text-muted text-sm mb-8">{t.checkout.emptyDesc}</p>
        <Button href="/shop" variant="primary">
          {t.cart.shopNow}
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 px-5 md:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="mb-12">
          <h1 className="font-display text-5xl md:text-6xl tracking-wide text-white">
            {t.checkout.title}
          </h1>
          <p className="mt-3 text-sm text-muted">{t.checkout.formDesc}</p>
        </FadeUp>

        <OrderForm
          items={items}
          editable
          onUpdateQuantity={updateQuantity}
          onUpdateSize={updateSize}
          onRemoveItem={removeItem}
          onOrderSuccess={clearCart}
        />
      </div>
    </div>
  );
}
