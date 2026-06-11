import { useEffect, useState } from "react";
import { fetchProduct, fetchProducts } from "@/services/products";
import { products as seed, type Product } from "@/data/products";

export function useProducts() {
  const [data, setData] = useState<Product[]>(seed);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((items) => { if (!cancelled) setData(items); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  return { products: data, loading };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | undefined>(() => seed.find((p) => p.slug === slug));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetchProduct(slug)
      .then((p) => { if (!cancelled) setProduct(p); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);
  return { product, loading };
}
