import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-monstera.jpg";
import { bestSellers, categories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ePlant — Bring the outside in" },
      { name: "description", content: "Curated architectural indoor plants, handmade pots, and care essentials delivered from our greenhouse." },
      { property: "og:title", content: "ePlant — Bring the outside in" },
      { property: "og:description", content: "Curated architectural indoor plants delivered to your door." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = bestSellers();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[82vh] min-h-[560px] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Monstera deliciosa in a sunlit living room"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mist/70 via-mist/30 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl bg-mist/50 backdrop-blur-sm p-10 sm:p-12 border-l-4 border-clay">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">New Season Arrivals</span>
            <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-[0.95] text-leaf">
              Bring the<br /><em className="italic">outside</em> in.
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-md opacity-80 leading-relaxed italic">
              Curated architectural plants delivered from our greenhouse to your living room.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/shop" className="bg-leaf text-mist px-8 py-4 font-medium uppercase tracking-widest text-xs hover:bg-leaf-soft transition-colors">
                Shop Now
              </Link>
              <Link to="/shop" className="border border-leaf text-leaf px-8 py-4 font-medium uppercase tracking-widest text-xs hover:bg-leaf hover:text-mist transition-all">
                Explore Plants
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 container mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
          <div>
            <h2 className="font-serif text-4xl mb-2">Shop by Category</h2>
            <p className="opacity-60">Find the perfect companion for your space.</p>
          </div>
          <Link to="/shop" className="text-clay font-medium underline underline-offset-8 text-sm">
            View all items
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              className="group cursor-pointer block"
            >
              <div className="aspect-[3/4] mb-4 overflow-hidden bg-stone-100">
                <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="font-serif text-xl">{c.name}</h3>
              <p className="text-sm opacity-60 mt-1">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-white py-24 px-6 border-y border-leaf/5">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">Best Sellers</span>
              <h2 className="font-serif text-4xl mt-2">Loved by our community</h2>
            </div>
            <Link to="/shop" className="text-clay font-medium underline underline-offset-8 text-sm">Browse all plants</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">Why ePlant</span>
          <h2 className="font-serif text-4xl mt-3">A nursery, not a warehouse.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { t: "Botanical Guarantee", d: "Healthy delivery or we replace within 30 days. No questions asked." },
            { t: "Expert Guidance", d: "Every order includes a lifetime care concierge for your specific plants." },
            { t: "Eco-Conscious", d: "Peat-free potting mixes and fully recycled shipping packaging." },
          ].map((f) => (
            <div key={f.t} className="border-t border-leaf/20 pt-6">
              <h3 className="font-serif text-2xl text-leaf">{f.t}</h3>
              <p className="mt-3 text-sm text-ink/70 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 px-6 border-y border-leaf/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl">Notes from our greenhouse</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { q: "My fiddle leaf is thriving. The care concierge follow-up made all the difference.", a: "Amélie R." },
              { q: "Packaging is genuinely beautiful. The plant arrived healthier than from any local shop.", a: "Marcus T." },
              { q: "I trust their selection now — every plant looks like it was photographed for a magazine.", a: "Priya S." },
            ].map((t) => (
              <figure key={t.a} className="bg-mist p-8 border-l-2 border-clay">
                <blockquote className="font-serif italic text-xl text-leaf leading-snug">“{t.q}”</blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-widest text-ink/60">— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-leaf text-mist">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] opacity-60 mb-6 block">The Green Letter</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-8 italic">
            Join our botanical community for 15% off your first order.
          </h2>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex flex-col sm:flex-row gap-0 border-b border-mist/30 pb-2"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="bg-transparent flex-1 px-4 py-3 outline-none placeholder:text-mist/40 text-mist"
            />
            <button className="uppercase tracking-widest text-xs font-bold px-6 py-3 hover:text-clay transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
