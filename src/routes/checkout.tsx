import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orders";
import { isObjectId } from "@/services/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ePlant" },
      { name: "description", content: "Complete your order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const method = "cod" as const;
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 75 ? 0 : 8;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl">Nothing to check out.</h1>
        <Link to="/shop" className="mt-6 inline-block text-clay underline">Browse plants</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl text-leaf mb-12">Checkout</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!user) {
            toast.error("Please sign in to place an order.");
            navigate({ to: "/auth/login" });
            return;
          }
          const form = new FormData(e.currentTarget);
          const payload = {
            items: items.map((it) => ({
              product: it.product.id,
              name: it.product.name,
              price: it.product.price,
              quantity: it.qty,
              image: it.product.image,
            })),
            shipping: {
              fullName: `${form.get("first")} ${form.get("last")}`.trim(),
              address: String(form.get("address") ?? ""),
              city: String(form.get("city") ?? ""),
              postalCode: String(form.get("zip") ?? ""),
              country: String(form.get("country") ?? ""),
              phone: "",
            },
            subtotal,
            shippingCost: shipping,
            discount: 0,
            total,
            paymentMethod: method,
          };

          const hasLocalIds = items.some((it) => !isObjectId(it.product.id));
          setSubmitting(true);
          try {
            const order = await createOrder(payload);
            toast.success(`Order ${order._id.slice(-6).toUpperCase()} placed`);
            clear();
            navigate({ to: "/account" });
          } catch (err) {
            const hint = hasLocalIds
              ? " (Cart contains seed-data products without server IDs — shop from the live catalog to place a real order.)"
              : "";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error(((err as any)?.response?.data?.message ?? "Order failed") + hint);
          } finally {
            setSubmitting(false);
          }
        }}
        className="grid lg:grid-cols-[1fr_400px] gap-12"
      >
        <div className="space-y-10">
          <Section title="Contact">
            <Field label="Email" name="email" type="email" defaultValue={user?.email ?? ""} required />
          </Section>

          <Section title="Shipping address">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name" name="first" required />
              <Field label="Last name" name="last" required />
            </div>
            <Field label="Address" name="address" required />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="City" name="city" required />
              <Field label="State" name="state" />
              <Field label="ZIP" name="zip" required />
            </div>
            <Field label="Country" name="country" defaultValue="United States" required />
          </Section>

          <Section title="Payment method">
            <div className="space-y-3">
              <PayOpt id="cod" checked title="Cash on Delivery" sub="Pay in cash when your plant arrives. No card payment required." />
            </div>
          </Section>
        </div>

        <aside className="bg-mist p-8 border border-leaf/10 h-fit lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl mb-6">Order</h2>
          <ul className="space-y-4 mb-6 max-h-72 overflow-auto">
            {items.map((it) => (
              <li key={it.product.id} className="flex gap-3 text-sm">
                <img src={it.product.image} alt="" className="size-14 object-cover bg-white" />
                <div className="flex-1">
                  <p className="font-medium">{it.product.name}</p>
                  <p className="text-ink/50 text-xs">Qty {it.qty}</p>
                </div>
                <span>${(it.product.price * it.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-leaf/10 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
            <div className="flex justify-between font-serif text-xl border-t border-leaf/10 pt-3 mt-2"><dt>Total</dt><dd className="text-leaf">${total.toFixed(2)}</dd></div>
          </dl>
          <button disabled={submitting} className="mt-6 w-full bg-leaf text-mist py-4 text-xs uppercase tracking-widest font-medium hover:bg-leaf-soft transition-colors disabled:opacity-50">
            {submitting ? "Placing order…" : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-leaf mb-6">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink/60 block mb-2">{label}</span>
      <input
        {...props}
        className="w-full bg-white border border-leaf/15 px-4 py-3 text-sm outline-none focus:border-leaf"
      />
    </label>
  );
}

function PayOpt({ id, checked, onChange, title, sub }: { id: string; checked: boolean; onChange?: () => void; title: string; sub: string }) {
  return (
    <label htmlFor={id} className={`flex gap-4 p-4 border cursor-pointer ${checked ? "border-leaf bg-leaf/5" : "border-leaf/15"}`}>
      <input id={id} type="radio" name="method" checked={checked} onChange={onChange ?? (() => {})} className="accent-leaf mt-1" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-ink/60 mt-1">{sub}</p>
      </div>
    </label>
  );
}
