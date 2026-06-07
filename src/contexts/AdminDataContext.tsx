import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as seedProducts, type Product } from "@/data/products";

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
}

const seedOrders: Order[] = [
  { id: "ORD-1042", customer: "Ava Lindgren", email: "ava@studio.com", total: 248, status: "shipped", date: "2026-06-05", items: 3 },
  { id: "ORD-1041", customer: "Noah Brooks", email: "noah@gmail.com", total: 85, status: "delivered", date: "2026-06-04", items: 1 },
  { id: "ORD-1040", customer: "Mira Okafor", email: "mira@studio.com", total: 412, status: "pending", date: "2026-06-04", items: 5 },
  { id: "ORD-1039", customer: "Leo Tanaka", email: "leo@arch.io", total: 120, status: "delivered", date: "2026-06-03", items: 1 },
  { id: "ORD-1038", customer: "Sofia Marín", email: "sofia@gmail.com", total: 76, status: "cancelled", date: "2026-06-02", items: 2 },
  { id: "ORD-1037", customer: "Ezra Klein", email: "ezra@studio.com", total: 188, status: "delivered", date: "2026-06-01", items: 4 },
  { id: "ORD-1036", customer: "Hana Park", email: "hana@design.co", total: 320, status: "shipped", date: "2026-05-30", items: 3 },
];

const seedCustomers: Customer[] = [
  { id: "C-01", name: "Ava Lindgren", email: "ava@studio.com", orders: 6, spent: 1284, joined: "2025-09-12" },
  { id: "C-02", name: "Noah Brooks", email: "noah@gmail.com", orders: 2, spent: 173, joined: "2026-01-08" },
  { id: "C-03", name: "Mira Okafor", email: "mira@studio.com", orders: 9, spent: 2410, joined: "2025-04-22" },
  { id: "C-04", name: "Leo Tanaka", email: "leo@arch.io", orders: 3, spent: 360, joined: "2025-11-30" },
  { id: "C-05", name: "Sofia Marín", email: "sofia@gmail.com", orders: 1, spent: 76, joined: "2026-05-19" },
];

interface AdminCtx {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  createProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setOrderStatus: (id: string, status: Order["status"]) => void;
}

const Ctx = createContext<AdminCtx | null>(null);
const KEY = "eplant-admin-v1";

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [customers] = useState<Customer[]>(seedCustomers);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) {
        const s = JSON.parse(raw);
        if (s.products) setProducts(s.products);
        if (s.orders) setOrders(s.orders);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify({ products, orders }));
  }, [products, orders]);

  const value = useMemo<AdminCtx>(() => ({
    products, orders, customers,
    createProduct: (p) => setProducts((arr) => [{ ...p, id: `p_${Date.now()}` }, ...arr]),
    updateProduct: (id, patch) => setProducts((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    deleteProduct: (id) => setProducts((arr) => arr.filter((x) => x.id !== id)),
    setOrderStatus: (id, status) => setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, status } : o))),
  }), [products, orders, customers]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminData() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdminData must be used inside AdminDataProvider");
  return c;
}
