import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
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
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
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
  // typeof null === "object" in JS — must guard explicitly
  const u = (o.user !== null && typeof o.user === "object") ? o.user : null;
  // keep all statuses as-is; only coerce unknown values to "pending"
  const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
  const status = validStatuses.includes(o.status as typeof validStatuses[number])
    ? (o.status as Order["status"])
    : "pending";
  return {
    id: o._id,
    customer: u?.name ?? "—",
    email: u?.email ?? "",
    total: o.total,
    status,
    date: o.createdAt?.slice(0, 10) ?? "",
    items: o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0,
  };
}


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
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Products are public — always fetch
      const prodPromise = fetchProducts()
        .then(setProducts)
        .catch((e) => console.error("[AdminData] fetchProducts failed:", e));

      // Orders + customers require a valid admin JWT — skip if not yet authenticated
      const adminPromises = user?.role === "admin" && token
        ? [
            fetchAllOrders()
              .then((list) => setOrders(list.map(mapOrder)))
              .catch((e) => console.error("[AdminData] fetchAllOrders failed:", e)),
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
              .catch((e) => console.error("[AdminData] fetchUsers failed:", e)),
          ]
        : [];

      await Promise.all([prodPromise, ...adminPromises]);
    } finally {
      setLoading(false);
    }
  // Re-run whenever auth state changes (login sets token, logout clears it)
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
      const updated = await setOrderStatusApi(id, status);
      // Use the server-returned order to ensure state stays in sync
      setOrders((arr) => arr.map((o) => (o.id === id ? mapOrder(updated) : o)));
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
