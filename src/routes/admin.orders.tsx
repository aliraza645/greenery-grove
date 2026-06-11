import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminData, type Order } from "@/contexts/AdminDataContext";
import { StatusBadge } from "./admin.index";

export const Route = createFileRoute("/admin/orders")({ component: OrdersAdmin });

const STATUSES: Order["status"][] = ["pending", "shipped", "delivered", "cancelled"];

function OrdersAdmin() {
  const { orders, setOrderStatus } = useAdminData();
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl text-leaf">Orders</h1>
        <p className="text-sm text-ink/60 mt-1">{orders.length} orders total</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-xs uppercase tracking-widest border ${
              filter === s ? "bg-leaf text-mist border-leaf" : "border-ink/15 text-ink/70 hover:border-leaf"
            }`}
          >{s}</button>
        ))}
      </div>

      <div className="bg-white border border-ink/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="text-left px-4 py-3">Order</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-ink/10">
                <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-4 py-3 text-ink/70">{o.date}</td>
                <td className="px-4 py-3">
                  <div>{o.customer}</div>
                  <div className="text-xs text-ink/50">{o.email}</div>
                </td>
                <td className="px-4 py-3 text-ink/70">{o.items}</td>
                <td className="px-4 py-3 text-right">${o.total}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <select
                      value={o.status}
                      onChange={async (e) => {
                        const next = e.target.value as Order["status"];
                        try { await setOrderStatus(o.id, next); toast.success(`${o.id} → ${next}`); }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        catch (err) { toast.error((err as any)?.response?.data?.message ?? "Update failed"); }
                      }}
                      className="bg-mist border border-ink/15 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-ink/50">No orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
