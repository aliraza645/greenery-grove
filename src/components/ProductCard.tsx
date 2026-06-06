import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  return (
    <div className="group">
      <div className="relative mb-4 overflow-hidden bg-mist">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          onClick={() => {
            toggle(product);
            toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 bg-mist/90 backdrop-blur-sm p-2 rounded-full text-leaf hover:bg-mist transition"
        >
          <Heart className={`size-4 ${wished ? "fill-clay text-clay" : ""}`} />
        </button>
        {product.bestSeller && (
          <span className="absolute top-3 left-3 bg-clay text-white text-[10px] px-2 py-1 uppercase tracking-tighter font-medium">
            Best Seller
          </span>
        )}
        <button
          onClick={() => {
            add(product);
            toast.success(`Added ${product.name} to bag`);
          }}
          className="absolute bottom-0 left-0 right-0 bg-leaf text-mist py-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-xs uppercase tracking-widest font-medium"
        >
          Quick Add — ${product.price}
        </button>
      </div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <h3 className="font-serif text-lg text-ink">{product.name}</h3>
        <p className="text-sm opacity-50 italic">{product.latin}</p>
        <p className="mt-1 text-sm text-leaf font-medium">${product.price}</p>
      </Link>
    </div>
  );
}
