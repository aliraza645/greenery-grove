import { api } from "./api";
import type { Product, LightLevel, PlantType } from "@/data/products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerProduct = any;

const mapLight = (l?: string): LightLevel => {
  if (l === "low") return "low";
  if (l === "direct") return "direct";
  return "indirect"; // medium / bright / unknown
};

const mapType = (cat?: string): PlantType => (cat === "outdoor" ? "outdoor" : "indoor");

export function mapProduct(p: ServerProduct): Product {
  const images: string[] = Array.isArray(p.images)
    ? p.images.filter(Boolean)
    : p.image
    ? [p.image]
    : [];
  return {
    id: String(p._id ?? p.id),
    slug: p.slug,
    name: p.name,
    latin: p.latin ?? "",
    price: p.price ?? 0,
    image: images[0] ?? "",
    images,
    category: p.category ?? "indoor",
    type: mapType(p.category),
    light: mapLight(p.light),
    inStock: typeof p.stock === "number" ? p.stock > 0 : p.inStock ?? true,
    bestSeller: Boolean(p.featured ?? p.bestSeller),
    rating: p.rating ?? 4.5,
    reviews: p.numReviews ?? p.reviews ?? 0,
    description: p.description ?? "",
    care: p.care ?? { water: "—", light: "—", temperature: "—" },
  };
}

/** Reverse: frontend draft -> server payload for POST/PUT. */
export function toServerProduct(p: Partial<Product>) {
  const lightMap: Record<string, string> = { low: "low", indirect: "medium", direct: "direct" };
  const images = (p.images && p.images.length ? p.images : p.image ? [p.image] : []).filter(Boolean);
  return {
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category,
    images,
    stock: p.inStock ? 10 : 0,
    light: p.light ? lightMap[p.light] : "medium",
    featured: p.bestSeller ?? false,
    rating: p.rating,
    numReviews: p.reviews,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get("/products", { params: { limit: 100 } });
  const items: ServerProduct[] = data?.items ?? data ?? [];
  return items.map(mapProduct);
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const { data } = await api.get(`/products/${slug}`);
  return mapProduct(data);
}

export async function createProductApi(p: Partial<Product>): Promise<Product> {
  const { data } = await api.post("/products", toServerProduct(p));
  return mapProduct(data);
}

export async function updateProductApi(id: string, p: Partial<Product>): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, toServerProduct(p));
  return mapProduct(data);
}

export async function deleteProductApi(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
