import { api } from "./api";
import { products as seed, type Product, type LightLevel, type PlantType } from "@/data/products";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerProduct = any;

const mapLight = (l?: string): LightLevel => {
  if (l === "low") return "low";
  if (l === "direct") return "direct";
  return "indirect"; // medium / bright / unknown
};

const mapType = (cat?: string): PlantType => (cat === "outdoor" ? "outdoor" : "indoor");

export function mapProduct(p: ServerProduct): Product {
  return {
    id: String(p._id ?? p.id),
    slug: p.slug,
    name: p.name,
    latin: p.latin ?? "",
    price: p.price ?? 0,
    image: Array.isArray(p.images) ? p.images[0] ?? "" : p.image ?? "",
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
  return {
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category,
    images: p.image ? [p.image] : [],
    stock: p.inStock ? 10 : 0,
    light: p.light ? lightMap[p.light] : "medium",
    featured: p.bestSeller ?? false,
    rating: p.rating,
    numReviews: p.reviews,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get("/products", { params: { limit: 100 } });
    const items: ServerProduct[] = data?.items ?? data ?? [];
    return items.length ? items.map(mapProduct) : seed;
  } catch {
    return seed;
  }
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  try {
    const { data } = await api.get(`/products/${slug}`);
    return mapProduct(data);
  } catch {
    return seed.find((p) => p.slug === slug);
  }
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
