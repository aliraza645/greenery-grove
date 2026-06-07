import { createFileRoute } from "@tanstack/react-router";
import { useAdminData } from "@/contexts/AdminDataContext";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

const revenueSeries = [
  { day: "Mon", revenue: 420 }, { day: "Tue", revenue: 560 }, { day: "Wed", revenue: 380 },
  { day: "Thu", revenue: 720 }, { day: "Fri", revenue: 910 }, { day: "Sat", revenue: 1180 }, { day: "Sun", revenue: 860 },
];

function Dashboard() {
  const { products, orders, customers } = useAdminData();
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign, delta: "+12.4%" },
    { label: "Orders", value: orders.length, icon: ShoppingBag, delta: `${pending} pending` },
    { label: "Products", value: products.length, icon: Package, delta: "in catalog" },
    { label: "Customers", value: customers.length, icon: Users, delta: "+3 this week" },
  ];

  const byCategory = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {})
  ).map(([category, count]) => ({ category, count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-leaf">Dashboard</h1>
        <p className="text-sm text-ink/60 mt-1">A snapshot of the greenhouse this week.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-ink/10 p-5">
            <div className="flex items-start justify-between">
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50">{s.label}</div>
              <s.icon className="h-4 w-4 text-clay" />
            </div>
            <div className="font-serif text-3xl text-ink mt-3">{s.value}</div>
            <div className="text-xs text-ink/50 mt-1">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-ink/10 p-5">
          <div className="text-xs uppercase tracking-widest text-ink/50 mb-4">Revenue · last 7 days</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A3A32" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1A3A32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C1C1C10" vertical={false} />
              <XAxis dataKey="day" stroke="#1C1C1C60" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#1C1C1C60" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #1C1C1C20", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#1A3A32" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-ink/10 p-5">
          <div className="text-xs uppercase tracking-widest text-ink/50 mb-4">By category</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCategory}>
              <CartesianGrid stroke="#1C1C1C10" vertical={false} />
              <XAxis dataKey="category" stroke="#1C1C1C60" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#1C1C1C60" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #1C1C1C20", fontSize: 12 }} />
              <Bar dataKey="count" fill="#D48166" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-ink/10">
        <div className="px-5 py-4 border-b border-ink/10 text-xs uppercase tracking-widest text-ink/50">Recent orders</div>
        <table className="w-full text-sm">
          <thead className="text-xs text-ink/50 uppercase tracking-wider">
            <tr><th className="text-left px-5 py-3">Order</th><th className="text-left px-5 py-3">Customer</th><th className="text-left px-5 py-3">Status</th><th className="text-right px-5 py-3">Total</th></tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id} className="border-t border-ink/10">
                <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-5 py-3">{o.customer}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right">${o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-clay/15 text-clay",
    shipped: "bg-leaf/15 text-leaf",
    delivered: "bg-ink/10 text-ink",
    cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider ${styles[status] || ""}`}>{status}</span>;
}
