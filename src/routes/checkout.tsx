import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orders";
import { isObjectId } from "@/services/cart";
import { apiErrorMessage } from "@/services/api";
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

type Fields = {
  email: string;
  first: string;
  last: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const initial: Fields = {
  email: "", first: "", last: "", phone: "",
  address: "", city: "", state: "", zip: "", country: "United States",
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+\d][\d\s\-()]{6,19}$/;
const zipRe = /^[A-Za-z0-9\s-]{3,12}$/;

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!emailRe.test(f.email.trim())) e.email = "Enter a valid email.";
  if (!f.first.trim()) e.first = "First name is required.";
  if (!f.last.trim()) e.last = "Last name is required.";
  if (!phoneRe.test(f.phone.trim())) e.phone = "Enter a valid phone number.";
  if (!f.address.trim()) e.address = "Address is required.";
  if (!f.city.trim()) e.city = "City is required.";
  if (!zipRe.test(f.zip.trim())) e.zip = "Enter a valid postal code.";
  if (!f.country.trim()) e.country = "Country is required.";
  return e;
}

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState<Fields>({ ...initial, email: user?.email ?? "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});

  const errors = useMemo(() => validate(fields), [fields]);
  const isValid = Object.keys(errors).length === 0;

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

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((s) => ({ ...s, [k]: e.target.value }));
  const blur = (k: keyof Fields) => () => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k: keyof Fields) => (touched[k] ? errors[k] : undefined);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="font-serif text-5xl text-leaf mb-12">Checkout</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setTouched(Object.keys(fields).reduce((a, k) => ({ ...a, [k]: true }), {}));
          if (!isValid) { toast.error("Please fix the highlighted fields."); return; }
          if (!user) {
            toast.error("Please sign in to place an order.");
            navigate({ to: "/auth/login" });
            return;
          }

          console.log("Placing order with fields", fields, "and items", items);
          const validItems = items.filter((it) => isObjectId(it.product.id));
          if (validItems.length === 0) {
            toast.error("Your cart only has demo items. Add a product from the live catalog to place a real order.");
            return;
          }
          if (validItems.length !== items.length) {
            toast.warning("Some demo items were skipped (no server id).");
          }

          const validSubtotal = validItems.reduce((s, it) => s + it.qty * it.product.price, 0);
          const validShipping = validSubtotal > 75 ? 0 : 8;
          const validTotal = validSubtotal + validShipping;

          const payload = {
            items: validItems.map((it) => ({
              product: it.product.id,
              name: it.product.name,
              price: it.product.price,
              quantity: it.qty,
              image: it.product.image,
            })),
            shipping: {
              fullName: `${fields.first.trim()} ${fields.last.trim()}`.trim(),
              address: fields.address.trim(),
              city: fields.city.trim(),
              postalCode: fields.zip.trim(),
              country: fields.country.trim(),
              phone: fields.phone.trim(),
            },
            subtotal: validSubtotal,
            shippingCost: validShipping,
            discount: 0,
            total: validTotal,
            paymentMethod: "cod" as const,
          };

          setSubmitting(true);
          try {
            const order = await createOrder(payload);
            toast.success(`Order ${order._id.slice(-6).toUpperCase()} placed`);
            clear();
            navigate({ to: "/account" });
          } catch (e2) {
            toast.error(apiErrorMessage(e2, "Order failed"));
          } finally {
            setSubmitting(false);
          }
        }}
        className="grid lg:grid-cols-[1fr_400px] gap-12"
        noValidate
      >
        <div className="space-y-10">
          <Section title="Contact">
            <Field label="Email" value={fields.email} onChange={set("email")} onBlur={blur("email")} error={err("email")} type="email" />
            <Field label="Phone" value={fields.phone} onChange={set("phone")} onBlur={blur("phone")} error={err("phone")} placeholder="+1 555 123 4567" />
          </Section>

          <Section title="Shipping address">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name" value={fields.first} onChange={set("first")} onBlur={blur("first")} error={err("first")} />
              <Field label="Last name" value={fields.last} onChange={set("last")} onBlur={blur("last")} error={err("last")} />
            </div>
            <Field label="Address" value={fields.address} onChange={set("address")} onBlur={blur("address")} error={err("address")} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="City" value={fields.city} onChange={set("city")} onBlur={blur("city")} error={err("city")} />
              <Field label="State" value={fields.state} onChange={set("state")} />
              <Field label="Postal code" value={fields.zip} onChange={set("zip")} onBlur={blur("zip")} error={err("zip")} />
            </div>
            <Field label="Country" value={fields.country} onChange={set("country")} onBlur={blur("country")} error={err("country")} />
          </Section>

          <Section title="Payment method">
            <div className="p-4 border border-leaf bg-leaf/5">
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-xs text-ink/60 mt-1">Pay in cash when your plant arrives. No card payment required.</p>
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
          <button
            disabled={submitting || !isValid}
            className="mt-6 w-full bg-leaf text-mist py-4 text-xs uppercase tracking-widest font-medium hover:bg-leaf-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing order…" : "Place Order"}
          </button>
          {!isValid && <p className="mt-3 text-xs text-red-600 text-center">Complete the form to place the order.</p>}
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

function Field({
  label, error, ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink/60 block mb-2">{label}</span>
      <input
        {...props}
        className={`w-full bg-white border px-4 py-3 text-sm outline-none focus:border-leaf ${
          error ? "border-red-500" : "border-leaf/15"
        }`}
      />
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  );
}
