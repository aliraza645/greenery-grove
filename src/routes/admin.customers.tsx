import { createFileRoute } from "@tanstack/react-router";
import { useAdminData } from "@/contexts/AdminDataContext";

export const Route = createFileRoute("/admin/customers")({ component: CustomersAdmin });

function CustomersAdmin() {
  const { customers } = useAdminData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl text-leaf">Customers</h1>
        <p className="text-sm text-ink/60 mt-1">{customers.length} registered</p>
      </div>
      <div className="bg-white border border-ink/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-right px-4 py-3">Orders</th>
              <th className="text-right px-4 py-3">Lifetime spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-ink/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-leaf text-mist flex items-center justify-center text-xs font-medium">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    {c.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/70">{c.email}</td>
                <td className="px-4 py-3 text-ink/70">{c.joined}</td>
                <td className="px-4 py-3 text-right">{c.orders}</td>
                <td className="px-4 py-3 text-right">${c.spent.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
