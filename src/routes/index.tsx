import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-monstera.jpg";
import catIndoor from "@/assets/cat-indoor.jpg";
import catPots from "@/assets/cat-pots.jpg";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Leaf, Sun, Droplets, ShieldCheck, Truck, Sprout } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ePlant — A nursery, not a warehouse" },
      { name: "description", content: "Curated architectural plants, hand-thrown pots, and lifetime care guidance — grown in our greenhouse, delivered with intention." },
      { property: "og:title", content: "ePlant — A nursery, not a warehouse" },
      { property: "og:description", content: "Curated architectural plants delivered from greenhouse to living room." },
    ],
  }),
  component: Home,
});

function Home() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.bestSeller).slice(0, 6);
  const list = (featured.length ? featured : products.slice(0, 6));
  const editors = products.slice(6, 10);

  return (
    <div>
      {/* HERO — full-bleed cinematic with editorial caption */}
      <section className="relative h-[92vh] min-h-[640px] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Monstera deliciosa in a sunlit living room"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <div className="absolute top-8 left-0 right-0 z-10 px-6">
          <div className="container mx-auto flex justify-between items-center text-mist text-[10px] uppercase tracking-[0.3em]">
            <span>Est. 2014 · London Greenhouse</span>
            <span className="hidden md:inline">Issue Nº 24 — Autumn Foliage</span>
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10 pb-20 md:pb-28">
          <div className="max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clay bg-mist/95 px-3 py-1.5">
              New Season · Autumn Collection
            </span>
            <h1 className="mt-6 font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-mist">
              Bring the<br />
              <em className="italic text-clay">outside</em> in.
            </h1>
            <p className="mt-8 text-base md:text-lg max-w-lg text-mist/85 leading-relaxed">
              Twenty-two living sculptures, hand-selected from our Hertfordshire greenhouse.
              Delivered with a lifetime of care guidance.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link to="/shop" className="group bg-mist text-leaf px-8 py-4 font-medium uppercase tracking-widest text-xs hover:bg-clay hover:text-mist transition-colors inline-flex items-center gap-3">
                Shop the Collection
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/care-guides" className="text-mist text-xs uppercase tracking-widest underline underline-offset-8 decoration-mist/40 hover:decoration-clay">
                Read the Care Journal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE — value props strip */}
      <section className="bg-leaf text-mist py-5 border-y border-mist/10 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-wrap justify-around gap-y-3 gap-x-8 text-[11px] uppercase tracking-[0.25em]">
          <span className="flex items-center gap-2"><Truck className="size-3.5 text-clay" /> Carbon-Neutral Delivery</span>
          <span className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-clay" /> 30-Day Botanical Guarantee</span>
          <span className="flex items-center gap-2"><Sprout className="size-3.5 text-clay" /> Greenhouse-Grown</span>
          <span className="flex items-center gap-2"><Leaf className="size-3.5 text-clay" /> Peat-Free Soil</span>
        </div>
      </section>

      {/* EDITORIAL INTRO — split image + manifesto */}
      <section className="py-24 md:py-32 px-6">
        <div className="container mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 relative">
            <img src={catIndoor} alt="Curated greenhouse" className="w-full aspect-[4/5] object-cover" />
            <img src={catPots} alt="Hand-thrown pots" className="hidden md:block absolute -bottom-12 -right-10 w-1/2 aspect-square object-cover border-8 border-mist shadow-xl" />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clay">— A note from our growers</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl leading-[1.05] text-leaf">
              We are not a marketplace.
              <br /><em className="italic">We are a nursery.</em>
            </h2>
            <p className="mt-8 text-base leading-relaxed text-ink/75 max-w-md">
              Every plant on this site was raised by hand in our greenhouse — repotted twice,
              acclimatised for four weeks, and chosen by name before it ever sees a delivery van.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/75 max-w-md italic">
              We do not stock what we cannot care for.
            </p>
            <Link to="/journal" className="mt-10 inline-flex items-center gap-2 text-clay text-xs uppercase tracking-widest font-semibold border-b border-clay pb-1 hover:gap-3 transition-all">
              Our Story <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES — editorial grid */}
      <section className="bg-mist py-24 px-6 border-y border-leaf/5">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-14">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clay">— Categories</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-3 text-leaf">Shop the Garden</h2>
            </div>
            <Link to="/shop" className="text-leaf font-medium underline underline-offset-8 decoration-clay decoration-2 text-sm">
              View all 22 items
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {categories.map((c, i) => (
              <Link key={c.slug} to="/shop" className={`group cursor-pointer block ${i === 0 ? "md:row-span-2 md:col-span-2" : ""}`}>
                <div className={`mb-4 overflow-hidden bg-white relative ${i === 0 ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[420px]" : "aspect-[3/4]"}`}>
                  <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {i === 0 && (
                    <div className="absolute bottom-6 left-6 right-6 text-mist">
                      <h3 className="font-serif text-3xl md:text-4xl">{c.name}</h3>
                      <p className="text-sm opacity-80 mt-1">{c.blurb}</p>
                    </div>
                  )}
                </div>
                {i !== 0 && (
                  <>
                    <h3 className="font-serif text-xl text-leaf">{c.name}</h3>
                    <p className="text-sm opacity-60 mt-1">{c.blurb}</p>
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-14">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clay">— Best Sellers</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-3 text-leaf">Loved by our community</h2>
            </div>
            <Link to="/shop" className="text-clay font-medium underline underline-offset-8 text-sm">Browse all plants →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* LIGHT GUIDE — shop by condition */}
      <section className="py-24 px-6 bg-leaf text-mist">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clay">— Find your match</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 italic">Shop by light, not by guess.</h2>
            <p className="mt-5 opacity-70 text-sm leading-relaxed">
              The single biggest factor in keeping a plant alive is matching it to your light.
              Tell us what you have — we'll show you what will thrive.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-mist/15">
            {[
              { icon: Leaf, label: "Low Light", blurb: "North-facing rooms, hallways, dim corners.", count: "8 plants" },
              { icon: Droplets, label: "Indirect Light", blurb: "Bright rooms, set back from windows.", count: "11 plants" },
              { icon: Sun, label: "Direct Sun", blurb: "South-facing, sunny conservatories & patios.", count: "9 plants" },
            ].map((c) => (
              <Link key={c.label} to="/shop" className="group bg-leaf p-10 hover:bg-leaf-soft transition-colors block">
                <c.icon className="size-7 text-clay mb-6" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl">{c.label}</h3>
                <p className="text-sm opacity-70 mt-2 leading-relaxed">{c.blurb}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-clay group-hover:gap-3 transition-all">
                  {c.count} <ArrowRight className="size-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORS' PICKS — magazine row */}
      <section className="py-24 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-14">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clay">— Editors' Picks</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-3 text-leaf">This week, on the bench.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {editors.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* PRESS STRIP */}
      <section className="bg-mist py-14 px-6 border-y border-leaf/10">
        <div className="container mx-auto">
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-ink/40 mb-8">As featured in</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 font-serif text-xl md:text-2xl text-leaf/60 italic">
            <span>Vogue Living</span>
            <span className="opacity-40">·</span>
            <span>Kinfolk</span>
            <span className="opacity-40">·</span>
            <span>House &amp; Garden</span>
            <span className="opacity-40">·</span>
            <span>Cereal</span>
            <span className="opacity-40">·</span>
            <span>Apartamento</span>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clay">— Notes from our greenhouse</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3">What our customers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              { q: "My fiddle leaf is thriving. The care concierge follow-up made all the difference — they remembered the spot I'd put it.", a: "Amélie R.", role: "Paris" },
              { q: "Packaging is genuinely beautiful. The plant arrived healthier than from any local shop, and they replied to my care question within hours.", a: "Marcus T.", role: "Berlin" },
              { q: "I trust their selection now — every plant looks like it was photographed for a magazine. The Pink Princess was unreal.", a: "Priya S.", role: "London" },
            ].map((t) => (
              <figure key={t.a} className="bg-mist p-10 border-l-2 border-clay relative">
                <span className="absolute top-4 left-6 font-serif text-7xl text-clay/30 leading-none">"</span>
                <blockquote className="font-serif italic text-xl text-leaf leading-snug relative">{t.q}</blockquote>
                <figcaption className="mt-8 text-xs uppercase tracking-widest text-ink/60">
                  — {t.a} <span className="text-ink/40">· {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 md:py-32 bg-leaf text-mist relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-clay/10 blur-3xl" />
        <div className="container mx-auto px-6 text-center max-w-2xl relative">
          <span className="text-[10px] uppercase tracking-[0.4em] text-clay mb-6 block">— The Green Letter</span>
          <h2 className="font-serif text-4xl md:text-6xl mb-8 italic leading-[1.05]">
            Care notes from<br />the greenhouse.
          </h2>
          <p className="opacity-70 text-sm mb-10 max-w-md mx-auto leading-relaxed">
            Seasonal care tips, new arrivals first, and 15% off your debut order.
            One letter a month. Never spam.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-0 border-b border-mist/30 pb-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="bg-transparent flex-1 px-2 py-3 outline-none placeholder:text-mist/40 text-mist"
            />
            <button className="uppercase tracking-widest text-xs font-bold px-6 py-3 hover:text-clay transition-colors">
              Subscribe →
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
