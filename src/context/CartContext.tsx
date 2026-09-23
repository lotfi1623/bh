"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductSize } from "@/types";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    size: ProductSize,
    color: string,
    quantity?: number,
    options?: { open?: boolean }
  ) => void;
  removeItem: (productId: string, size: ProductSize, color: string) => void;
  updateQuantity: (productId: string, size: ProductSize, color: string, quantity: number) => void;
  updateSize: (productId: string, oldSize: ProductSize, newSize: ProductSize, color: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bh-cart";

function itemKey(productId: string, size: ProductSize, color: string) {
  return `${productId}-${size}-${color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback(
    (
      product: Product,
      size: ProductSize,
      color: string,
      quantity = 1,
      options?: { open?: boolean }
    ) => {
      setItems((prev) => {
        const key = itemKey(product.id, size, color);
        const existing = prev.find(
          (i) => itemKey(i.product.id, i.size, i.color) === key
        );
        if (existing) {
          return prev.map((i) =>
            itemKey(i.product.id, i.size, i.color) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { product, size, color, quantity }];
      });
      if (options?.open !== false) setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((productId: string, size: ProductSize, color: string) => {
    setItems((prev) =>
      prev.filter((i) => itemKey(i.product.id, i.size, i.color) !== itemKey(productId, size, color))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: ProductSize, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.product.id, i.size, i.color) === itemKey(productId, size, color)
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );
  const updateSize = useCallback(
    (productId: string, oldSize: ProductSize, newSize: ProductSize, color: string) => {
      setItems((prev) => {
        const targetItem = prev.find(
          (i) => i.product.id === productId && i.size === oldSize && i.color === color
        );
        if (!targetItem) return prev;

        const existingNewSizeItem = prev.find(
          (i) => i.product.id === productId && i.size === newSize && i.color === color
        );

        if (existingNewSizeItem) {
          return prev
            .map((i) => {
              if (i.product.id === productId && i.size === newSize && i.color === color) {
                return { ...i, quantity: i.quantity + targetItem.quantity };
              }
              return i;
            })
            .filter((i) => !(i.product.id === productId && i.size === oldSize && i.color === color));
        }

        return prev.map((i) =>
          i.product.id === productId && i.size === oldSize && i.color === color
            ? { ...i, size: newSize }
            : i
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((a, i) => a + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((a, i) => a + i.product.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      updateSize,
      clearCart,
      itemCount,
      subtotal,
    }),
    [
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      updateSize,
      clearCart,
      itemCount,
      subtotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
