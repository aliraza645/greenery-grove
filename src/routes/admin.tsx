import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft } from "lucide-react";
import { AdminDataProvider } from "@/contexts/AdminDataContext";
import { AdminAuthGate } from "@/components/AdminAuthGate";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
  head: () => ({ meta: [{ title: "Admin — ePlant" }, { name: "robots", content: "noindex" }] }),
});

function AdminRoute() {
  return (
    <AdminAuthGate>
      <AdminLayout />
    </AdminAuthGate>
  );
}

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AdminDataProvider>
      <div className="fixed inset-0 z-50 flex bg-mist text-ink">
        <aside className="hidden md:flex w-60 flex-col border-r border-ink/10 bg-white">
          <div className="px-6 py-6 border-b border-ink/10">
            <Link to="/" className="font-serif text-2xl text-leaf">ePlant</Link>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">Admin</div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {nav.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                    active ? "bg-leaf text-mist" : "text-ink/70 hover:bg-ink/5"
                  }`}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-ink/10">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-ink/60 hover:text-leaf">
              <ArrowLeft className="h-3 w-3" /> Back to storefront
            </Link>
          </div>
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 border-b border-ink/10 bg-white flex items-center px-6 justify-between">
            <div className="md:hidden flex items-center gap-3">
              <Link to="/" className="font-serif text-xl text-leaf">ePlant</Link>
              <span className="text-[10px] uppercase tracking-widest text-ink/50">Admin</span>
            </div>
            <div className="hidden md:block text-xs uppercase tracking-[0.2em] text-ink/50">
              Greenhouse Admin
            </div>
            <div className="text-xs text-ink/60">admin@gmail.com</div>
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-10">
            <Outlet />
          </main>
          <nav className="md:hidden grid grid-cols-4 border-t border-ink/10 bg-white">
            {nav.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`flex flex-col items-center py-2 text-[10px] ${active ? "text-leaf" : "text-ink/60"}`}>
                  <n.icon className="h-4 w-4 mb-1" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </AdminDataProvider>
  );
}
