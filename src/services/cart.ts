import { api } from "./api";

export async function getServerCart() {
  const { data } = await api.get("/cart");
  return data;
}
export async function addServerCart(productId: string, quantity = 1) {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
}
export async function updateServerCart(productId: string, quantity: number) {
  const { data } = await api.put(`/cart/${productId}`, { quantity });
  return data;
}
export async function removeServerCart(productId: string) {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
}
export async function clearServerCart() {
  const { data } = await api.delete("/cart");
  return data;
}

/** True for a 24-char hex Mongo ObjectId — used to skip syncing local seed ids. */
export const isObjectId = (id: string) => /^[a-f0-9]{24}$/i.test(id);
