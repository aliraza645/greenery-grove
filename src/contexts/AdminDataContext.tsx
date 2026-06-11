import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as seedProducts, type Product } from "@/data/products";
import {
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "@/services/products";
import { fetchAllOrders, setOrderStatusApi, type ServerOrder } from "@/services/orders";
import { fetchUsers } from "@/services/users";
import { useAuth } from "./AuthContext";

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

function mapOrder(o: ServerOrder): Order {
  const u = typeof o.user === "object" ? o.user : { name: "—", email: "" };
  const status = o.status === "paid" ? "pending" : (o.status as Order["status"]);
  return {
    id: o._id,
    customer: u.name ?? "—",
    email: u.email ?? "",
    total: o.total,
    status,
    date: o.createdAt?.slice(0, 10) ?? "",
    items: o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0,
  };
}

const seedOrders: Order[] = [
  { id: "ORD-1042", customer: "Ava Lindgren", email: "ava@studio.com", total: 248, status: "shipped", date: "2026-06-05", items: 3 },
  { id: "ORD-1041", customer: "Noah Brooks", email: "noah@gmail.com", total: 85, status: "delivered", date: "2026-06-04", items: 1 },
  { id: "ORD-1040", customer: "Mira Okafor", email: "mira@studio.com", total: 412, status: "pending", date: "2026-06-04", items: 5 },
];

const seedCustomers: Customer[] = [
  { id: "C-01", name: "Ava Lindgren", email: "ava@studio.com", orders: 6, spent: 1284, joined: "2025-09-12" },
  { id: "C-02", name: "Noah Brooks", email: "noah@gmail.com", orders: 2, spent: 173, joined: "2026-01-08" },
];

interface AdminCtx {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  loading: boolean;
  createProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AdminCtx | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Products: always public
      const prodPromise = fetchProducts().then(setProducts).catch(() => {});
      // Orders + users: admin only
      const adminPromises =
        user?.role === "admin" && token
          ? [
              fetchAllOrders().then((list) => setOrders(list.map(mapOrder))).catch(() => {}),
              fetchUsers()
                .then((list) =>
                  setCustomers(
                    list.map((u) => ({
                      id: u._id,
                      name: u.name,
                      email: u.email,
                      orders: 0,
                      spent: 0,
                      joined: u.createdAt?.slice(0, 10) ?? "",
                    }))
                  )
                )
                .catch(() => {}),
            ]
          : [];
      await Promise.all([prodPromise, ...adminPromises]);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo<AdminCtx>(() => ({
    products, orders, customers, loading,
    createProduct: async (p) => {
      const created = await createProductApi(p);
      setProducts((arr) => [created, ...arr]);
    },
    updateProduct: async (id, patch) => {
      const updated = await updateProductApi(id, patch);
      setProducts((arr) => arr.map((x) => (x.id === id ? updated : x)));
    },
    deleteProduct: async (id) => {
      await deleteProductApi(id);
      setProducts((arr) => arr.filter((x) => x.id !== id));
    },
    setOrderStatus: async (id, status) => {
      await setOrderStatusApi(id, status);
      setOrders((arr) => arr.map((o) => (o.id === id ? { ...o, status } : o)));
    },
    refresh,
  }), [products, orders, customers, loading, refresh]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminData() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdminData must be used inside AdminDataProvider");
  return c;
}
