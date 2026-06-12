import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { count } = useCart();
  const { items: wish } = useWishlist();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-mist/85 backdrop-blur-md border-b border-leaf/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="font-serif italic text-2xl font-bold tracking-tight text-leaf">
          ePlant
        </Link>
        <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-[0.18em]">
          <Link to="/shop" activeProps={{ className: "text-leaf" }} inactiveProps={{ className: "text-ink/60 hover:text-leaf transition-colors" }}>
            Shop
          </Link>
          <Link to="/care-guides" activeProps={{ className: "text-leaf" }} inactiveProps={{ className: "text-ink/60 hover:text-leaf transition-colors" }}>
            Care Guides
          </Link>
          <Link to="/journal" activeProps={{ className: "text-leaf" }} inactiveProps={{ className: "text-ink/60 hover:text-leaf transition-colors" }}>
            Journal
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/shop" aria-label="Search the shop" className="p-2 text-ink/70 hover:text-leaf transition-colors">
            <Search className="size-4" />
          </Link>
          <Link to="/account" aria-label="Account" className="relative p-2 text-ink/70 hover:text-leaf transition-colors">
            <Heart className="size-4" />
            {wish.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-clay text-white text-[10px] size-4 rounded-full flex items-center justify-center">
                {wish.length}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative p-2 text-ink/70 hover:text-leaf transition-colors">
            <ShoppingBag className="size-4" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-clay text-white text-[10px] size-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/account" className="hidden sm:flex items-center gap-2 bg-leaf text-mist px-4 py-2 text-xs uppercase tracking-widest font-medium">
              <User className="size-3.5" />
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link to="/auth/login" className="hidden sm:inline-block bg-leaf text-mist px-5 py-2 text-xs uppercase tracking-widest font-medium hover:bg-leaf-soft transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
