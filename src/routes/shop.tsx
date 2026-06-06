import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type LightLevel, type PlantType } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Plants — ePlant" },
      { name: "description", content: "Browse our full collection of indoor plants, pots, seeds, and gardening tools." },
      { property: "og:title", content: "Shop Plants — ePlant" },
      { property: "og:description", content: "Browse our full collection of indoor plants." },
    ],
  }),
  component: ShopPage,
});

type Sort = "latest" | "price-asc" | "price-desc" | "popular";

function ShopPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PlantType | "all">("all");
  const [light, setLight] = useState<LightLevel | "all">("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(150);
  const [sort, setSort] = useState<Sort>("latest");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (query && !`${p.name} ${p.latin}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (type !== "all" && p.type !== type) return false;
      if (light !== "all" && p.light !== light) return false;
      if (inStockOnly && !p.inStock) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [query, type, light, inStockOnly, maxPrice, sort]);

  return (
    <div className="bg-white">
      <header className="bg-mist py-16 px-6 border-b border-leaf/5">
        <div className="container mx-auto">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">Our Collection</span>
          <h1 className="font-serif text-5xl md:text-6xl mt-3 text-leaf">The Greenhouse</h1>
          <p className="mt-4 max-w-xl text-ink/70">
            {filtered.length} living specimens, hand-picked from our growers.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Filters */}
          <aside className="w-full md:w-64 shrink-0 space-y-8">
            <FilterBlock title="Search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plants..."
                className="w-full bg-mist border border-leaf/10 px-3 py-2 text-sm outline-none focus:border-leaf"
              />
            </FilterBlock>

            <FilterBlock title="Plant Type">
              {(["all", "indoor", "outdoor"] as const).map((opt) => (
                <Radio key={opt} name="type" checked={type === opt} onChange={() => setType(opt)} label={cap(opt)} />
              ))}
            </FilterBlock>

            <FilterBlock title="Light Level">
              {(["all", "low", "indirect", "direct"] as const).map((opt) => (
                <Radio key={opt} name="light" checked={light === opt} onChange={() => setLight(opt)} label={cap(opt)} />
              ))}
            </FilterBlock>

            <FilterBlock title="Max Price">
              <input
                type="range"
                min={20}
                max={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-leaf"
              />
              <p className="text-sm mt-2 text-ink/70">Up to <span className="font-medium text-leaf">${maxPrice}</span></p>
            </FilterBlock>

            <FilterBlock title="Availability">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-leaf" />
                In stock only
              </label>
            </FilterBlock>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-leaf/10">
              <p className="text-sm text-ink/60">{filtered.length} results</p>
              <label className="text-sm flex items-center gap-2">
                <span className="text-ink/60">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="bg-transparent border-b border-leaf/20 py-1 outline-none focus:border-leaf"
                >
                  <option value="latest">Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-ink/50">
                <p className="font-serif text-2xl">No plants match those filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function cap(s: string) { return s === "all" ? "All" : s[0].toUpperCase() + s.slice(1); }

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 border-b border-leaf/10 pb-2">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Radio({ name, checked, onChange, label }: { name: string; checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="accent-leaf" />
      {label}
    </label>
  );
}
