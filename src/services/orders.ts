import { api } from "./api";

export interface ServerOrder {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: { product: string; name?: string; price: number; quantity: number; image?: string }[];
  shipping?: Record<string, string>;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: "cod" | "stripe";
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createOrder(payload: any): Promise<ServerOrder> {
  const { data } = await api.post("/orders", payload);
  return data;
}
export async function fetchMyOrders(): Promise<ServerOrder[]> {
  const { data } = await api.get("/orders/mine");
  return data;
}
export async function fetchAllOrders(): Promise<ServerOrder[]> {
  const { data } = await api.get("/orders");
  return data;
}
export async function setOrderStatusApi(id: string, status: ServerOrder["status"]) {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
}
