import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAdminData } from "@/contexts/AdminDataContext";
import { CloudinaryUploader } from "@/components/CloudinaryUploader";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/admin/products")({ component: ProductsAdmin });

type Draft = Omit<Product, "id"> & { id?: string };

const empty: Draft = {
  slug: "", name: "", latin: "", price: 0, image: "", images: [], category: "indoor",
  type: "indoor", light: "indirect", inStock: true, rating: 4.5, reviews: 0,
  description: "", care: { water: "", light: "", temperature: "" },
};

function ProductsAdmin() {
  const { products, createProduct, updateProduct, deleteProduct } = useAdminData();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);

  const filtered = products.filter((p) =>
    [p.name, p.latin, p.category].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const validateDraft = (d: Draft): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!d.name?.trim()) e.name = "Name is required.";
    if (!d.slug?.trim()) e.slug = "Slug is required.";
    if (!(d.price > 0)) e.price = "Price must be greater than 0.";
    if (!d.category?.trim()) e.category = "Category is required.";
    if (!d.description?.trim()) e.description = "Description is required.";
    if (!d.images || d.images.length === 0) e.images = "Upload at least one image.";
    return e;
  };
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const save = async () => {
    if (!editing) return;
    const errs = validateDraft(editing);
    setFieldErrors(errs);
    if (Object.keys(errs).length) { toast.error("Please fix the highlighted fields."); return; }
    try {
      if (editing.id) {
        await updateProduct(editing.id, editing);
        toast.success("Product updated");
      } else {
        await createProduct(editing);
        toast.success("Product created");
      }
      setEditing(null);
      setFieldErrors({});
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.message ?? "Save failed — is the API running?");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl text-leaf">Products</h1>
          <p className="text-sm text-ink/60 mt-1">{products.length} items in catalog</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-2 bg-leaf text-mist px-5 py-2.5 text-xs uppercase tracking-widest"
        >
          <Plus className="h-3.5 w-3.5" /> New product
        </button>
      </div>

      <input
        value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className="w-full md:w-80 bg-white border border-ink/15 px-4 py-2.5 text-sm"
      />

      <div className="bg-white border border-ink/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-ink/10">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="h-10 w-10 object-cover" />}
                    <div>
                      <div className="text-ink">{p.name}</div>
                      <div className="text-xs italic text-ink/50">{p.latin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-ink/70">{p.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${p.inStock ? "text-leaf" : "text-red-600"}`}>
                    {p.inStock ? "In stock" : "Sold out"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">${p.price}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="p-2 text-ink/60 hover:text-leaf"><Pencil className="h-4 w-4" /></button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete ${p.name}?`)) return;
                      try { await deleteProduct(p.id); toast.success("Deleted"); }
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      catch (e) { toast.error((e as any)?.response?.data?.message ?? "Delete failed"); }
                    }}
                    className="p-2 text-ink/60 hover:text-red-600"
                  ><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-ink/50">No products match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] bg-ink/40 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
              <h2 className="font-serif text-2xl text-leaf">{editing.id ? "Edit product" : "New product"}</h2>
              <button onClick={() => setEditing(null)} className="text-ink/50 hover:text-ink"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Field label="Name"><input className={inp} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Slug"><input className={inp} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Latin name"><input className={inp} value={editing.latin} onChange={(e) => setEditing({ ...editing, latin: e.target.value })} /></Field>
              <Field label="Price ($)"><input type="number" className={inp} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
              <Field label="Category">
                <select className={inp} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  <option value="indoor">indoor</option><option value="pots">pots</option><option value="tools">tools</option><option value="succulents">succulents</option>
                </select>
              </Field>
              <Field label="Type">
                <select className={inp} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as Product["type"] })}>
                  <option value="indoor">indoor</option><option value="outdoor">outdoor</option>
                </select>
              </Field>
              <Field label="Light">
                <select className={inp} value={editing.light} onChange={(e) => setEditing({ ...editing, light: e.target.value as Product["light"] })}>
                  <option value="low">low</option><option value="indirect">indirect</option><option value="direct">direct</option>
                </select>
              </Field>
              <Field label="In stock">
                <select className={inp} value={editing.inStock ? "y" : "n"} onChange={(e) => setEditing({ ...editing, inStock: e.target.value === "y" })}>
                  <option value="y">Yes</option><option value="n">No</option>
                </select>
              </Field>
              <Field label="Images" full>
                <CloudinaryUploader
                  images={editing.images ?? []}
                  onChange={(imgs) => setEditing({ ...editing, images: imgs, image: imgs[0] ?? "" })}
                />
              </Field>
              <Field label="Description" full><textarea rows={3} className={inp} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-ink/10">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-xs uppercase tracking-widest border border-ink/20">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 text-xs uppercase tracking-widest bg-leaf text-mist">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full bg-mist border border-ink/15 px-3 py-2 text-sm";
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-[10px] uppercase tracking-widest text-ink/50">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
