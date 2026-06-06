import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

interface WishCtx {
  items: Product[];
  has: (id: string) => boolean;
  toggle: (p: Product) => void;
  remove: (id: string) => void;
}

const Ctx = createContext<WishCtx | null>(null);
const KEY = "eplant-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<WishCtx>(() => ({
    items,
    has: (id) => items.some((p) => p.id === id),
    toggle: (p) =>
      setItems((prev) => (prev.some((i) => i.id === p.id) ? prev.filter((i) => i.id !== p.id) : [...prev, p])),
    remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
