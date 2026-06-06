import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { QuantityStepper } from "@/components/QuantityStepper";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — ePlant" },
      { name: "description", content: "Review the plants in your bag and proceed to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, update, remove } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const total = Math.max(0, subtotal - discount) + shipping;

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl text-leaf mb-2">Your Bag</h1>
      <p className="text-ink/60 mb-12">{items.length} item{items.length === 1 ? "" : "s"}</p>

      {items.length === 0 ? (
        <div className="py-24 text-center border-t border-leaf/10">
          <p className="font-serif text-2xl text-leaf">Your bag is empty.</p>
          <Link to="/shop" className="mt-6 inline-block bg-leaf text-mist px-8 py-3 text-xs uppercase tracking-widest">
            Browse the greenhouse
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-16">
          <ul className="divide-y divide-leaf/10 border-y border-leaf/10">
            {items.map((it) => (
              <li key={it.product.id} className="py-6 flex gap-6">
                <Link to="/product/$slug" params={{ slug: it.product.slug }} className="shrink-0">
                  <img src={it.product.image} alt={it.product.name} className="w-24 h-32 object-cover bg-mist" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link to="/product/$slug" params={{ slug: it.product.slug }} className="font-serif text-xl hover:text-leaf">
                        {it.product.name}
                      </Link>
                      <p className="text-sm italic text-ink/50">{it.product.latin}</p>
                    </div>
                    <p className="font-medium text-leaf">${(it.product.price * it.qty).toFixed(2)}</p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <QuantityStepper value={it.qty} onChange={(n) => update(it.product.id, n)} />
                    <button
                      onClick={() => { remove(it.product.id); toast.success("Removed from bag"); }}
                      className="text-xs text-ink/60 hover:text-leaf flex items-center gap-1.5"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="bg-mist p-8 border border-leaf/10 h-fit">
            <h2 className="font-serif text-2xl mb-6">Order summary</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (coupon.toUpperCase() === "GREEN15") {
                  setDiscount(subtotal * 0.15);
                  toast.success("Coupon applied — 15% off");
                } else {
                  setDiscount(0);
                  toast.error("Invalid coupon");
                }
              }}
              className="flex gap-2 mb-6"
            >
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 bg-white border border-leaf/15 px-3 py-2 text-sm outline-none focus:border-leaf"
              />
              <button className="bg-leaf text-mist px-4 py-2 text-xs uppercase tracking-widest">Apply</button>
            </form>

            <dl className="space-y-3 text-sm border-t border-leaf/10 pt-6">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              {discount > 0 && <Row label="Discount" value={`–$${discount.toFixed(2)}`} accent />}
              <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
              <div className="border-t border-leaf/10 pt-3 mt-3 flex justify-between font-serif text-xl">
                <span>Total</span><span className="text-leaf">${total.toFixed(2)}</span>
              </div>
            </dl>

            <Link to="/checkout" className="mt-6 block text-center bg-leaf text-mist py-4 text-xs uppercase tracking-widest font-medium hover:bg-leaf-soft transition-colors">
              Proceed to Checkout
            </Link>
            <p className="text-xs text-ink/50 mt-4 text-center">Try code <span className="font-mono text-leaf">GREEN15</span></p>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink/60">{label}</dt>
      <dd className={accent ? "text-clay" : "text-ink"}>{value}</dd>
    </div>
  );
}
