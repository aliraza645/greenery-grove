import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-leaf/10 bg-mist">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="font-serif italic text-3xl font-bold text-leaf">ePlant</Link>
          <p className="mt-6 text-sm text-ink/60 max-w-sm leading-relaxed">
            Curated architectural plants and handmade vessels, delivered from our greenhouse to your living room.
          </p>
        </div>
        <FooterCol title="Shop" items={[
          { to: "/shop", label: "All Plants" },
          { to: "/shop", label: "New Arrivals" },
          { to: "/shop", label: "Best Sellers" },
          { to: "/shop", label: "Gift Cards" },
        ]} />
        <FooterCol title="Care" items={[
          { to: "/care-guides", label: "Care Library" },
          { to: "/journal", label: "Journal" },
          { to: "/care-guides", label: "Plant Concierge" },
        ]} />
        <FooterCol title="Support" items={[
          { to: "/account", label: "Account" },
          { to: "/shop", label: "Shipping" },
          { to: "/shop", label: "Returns" },
          { to: "/shop", label: "Contact" },
        ]} />
      </div>
      <div className="border-t border-leaf/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-ink/50">
          <span>© {new Date().getFullYear()} ePlant Botanical Co. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-leaf mb-5">{title}</h5>
      <ul className="space-y-3 text-sm text-ink/70">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="hover:text-leaf transition-colors">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
