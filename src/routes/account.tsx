import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard } from "@/components/ProductCard";
import { fetchMyOrders, type ServerOrder } from "@/services/orders";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Account — ePlant" }, { name: "description", content: "Manage your orders, wishlist, and profile." }],
  }),
  component: AccountPage,
});

const TABS = ["Orders", "Wishlist", "Profile", "Addresses"] as const;
type Tab = typeof TABS[number];

function AccountPage() {
  const { user, logout } = useAuth();
  const { items: wish } = useWishlist();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Orders");

  useEffect(() => {
    if (!user) navigate({ to: "/auth/login" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">Account</span>
          <h1 className="font-serif text-5xl text-leaf mt-3">Hello, {user.name}</h1>
        </div>
        <button onClick={() => { logout(); navigate({ to: "/" }); }} className="text-xs uppercase tracking-widest text-ink/60 hover:text-leaf">
          Sign out
        </button>
      </div>

      <div className="grid lg:grid-cols-[200px_1fr] gap-12">
        <nav className="flex lg:flex-col gap-2 lg:gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-left px-4 py-2.5 text-sm transition ${tab === t ? "bg-leaf text-mist" : "hover:bg-leaf/5 text-ink/70"}`}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="bg-white border border-leaf/10 p-8 min-h-[400px]">
          {tab === "Orders" && <OrdersTab />}
          {tab === "Wishlist" && (
            wish.length === 0
              ? <Empty message="No saved plants yet." cta />
              : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {wish.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
          )}
          {tab === "Profile" && <ProfileTab />}
          {tab === "Addresses" && <AddressesTab />}
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<ServerOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch((e) => setError(e?.response?.data?.message ?? "Couldn't load orders"));
  }, []);

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">My Orders</h2>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {!orders && !error && <p className="text-sm text-ink/50">Loading…</p>}
      {orders && orders.length === 0 && <p className="text-sm text-ink/60">No orders yet.</p>}
      {orders && orders.length > 0 && (
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-ink/60 border-b border-leaf/10">
            <tr><th className="py-3">Order</th><th>Date</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-leaf/5">
                <td className="py-4 font-mono text-leaf">#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.createdAt?.slice(0, 10)}</td>
                <td>${o.total}</td>
                <td><span className="inline-block bg-leaf/10 text-leaf px-2 py-1 text-xs capitalize">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ProfileTab({ name, email }: { name: string; email: string }) {
  return (
    <div className="max-w-md">
      <h2 className="font-serif text-2xl mb-6">Profile</h2>
      <div className="space-y-4">
        <Field label="Name" defaultValue={name} />
        <Field label="Email" defaultValue={email} />
        <button className="bg-leaf text-mist px-6 py-3 text-xs uppercase tracking-widest">Save changes</button>
      </div>
    </div>
  );
}

function AddressesTab() {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Saved Addresses</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border border-leaf/15 p-6">
          <p className="font-medium">Home</p>
          <p className="text-sm text-ink/70 mt-2 leading-relaxed">123 Greenhouse Lane<br />Brooklyn, NY 11201<br />United States</p>
        </div>
        <button className="border border-dashed border-leaf/30 p-6 text-sm text-ink/60 hover:border-leaf hover:text-leaf transition">
          + Add new address
        </button>
      </div>
    </div>
  );
}

function Empty({ message, cta }: { message: string; cta?: boolean }) {
  return (
    <div className="py-20 text-center text-ink/60">
      <p className="font-serif text-2xl text-leaf">{message}</p>
      {cta && <Link to="/shop" className="mt-6 inline-block text-clay underline">Browse the greenhouse</Link>}
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink/60 block mb-2">{label}</span>
      <input {...props} className="w-full bg-mist border border-leaf/15 px-4 py-3 text-sm outline-none focus:border-leaf" />
    </label>
  );
}
