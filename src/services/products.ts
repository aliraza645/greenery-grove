import { products, getProduct, type Product } from "@/data/products";
// import { api } from "./api";

// TODO swap to: const { data } = await api.get<Product[]>("/products"); return data;
export async function fetchProducts(): Promise<Product[]> {
  return Promise.resolve(products);
}

// TODO swap to: const { data } = await api.get<Product>(`/products/${slug}`); return data;
export async function fetchProduct(slug: string): Promise<Product | undefined> {
  return Promise.resolve(getProduct(slug));
}
