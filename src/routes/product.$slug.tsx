import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { RatingStars } from "@/components/RatingStars";
import { QuantityStepper } from "@/components/QuantityStepper";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => ({ slug: params.slug }),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.slug} — ePlant` },
          { name: "description", content: "Plant details." },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Plant not found</h1>
      <Link to="/shop" className="mt-6 inline-block text-clay underline">Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const { product, loading } = useProduct(slug);
  const { products: allProducts } = useProducts();
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  if (loading && !product) {
    return <div className="container mx-auto px-6 py-24 text-center text-ink/60">Loading…</div>;
  }
  if (!product) throw notFound();

  const wished = has(product.id);
  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-10">
        <nav className="text-xs uppercase tracking-widest text-ink/50 mb-8">
          <Link to="/" className="hover:text-leaf">Home</Link> /{" "}
          <Link to="/shop" className="hover:text-leaf">Shop</Link> /{" "}
          <span className="text-leaf">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <ProductGallery
            images={product.images?.length ? product.images : [product.image]}
            alt={product.name}
          />

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">{product.category}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-leaf mt-3">{product.name}</h1>
            {product.latin && <p className="italic text-ink/60 mt-1">{product.latin}</p>}

            <div className="mt-6 flex items-center gap-4">
              <p className="text-3xl text-leaf font-medium">${product.price}</p>
              <RatingStars value={product.rating} reviews={product.reviews} />
            </div>

            <p className="mt-8 text-ink/80 leading-relaxed">{product.description}</p>

            <div className="mt-10 flex items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} />
              <button
                onClick={() => { add(product, qty); toast.success(`Added ${qty} × ${product.name} to bag`); }}
                className="flex-1 bg-leaf text-mist px-8 py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-leaf-soft transition-colors"
              >
                Add to Bag
              </button>
              <button
                onClick={() => { toggle(product); toast.success(wished ? "Removed from wishlist" : "Saved to wishlist"); }}
                aria-label="Wishlist"
                className="p-3.5 border border-leaf/20 hover:border-leaf transition"
              >
                <Heart className={`size-4 ${wished ? "fill-clay text-clay" : "text-leaf"}`} />
              </button>
            </div>

            <div className="mt-12 border-t border-leaf/10 pt-8 grid grid-cols-3 gap-6 text-sm">
              <CareCell title="Water" body={product.care.water} />
              <CareCell title="Light" body={product.care.light} />
              <CareCell title="Temp" body={product.care.temperature} />
            </div>
          </div>
        </div>

        <section className="mt-24 border-t border-leaf/10 pt-16">
          <h2 className="font-serif text-3xl mb-10">You may also love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function CareCell({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay mb-2">{title}</p>
      <p className="text-ink/70 leading-relaxed">{body}</p>
    </div>
  );
}
