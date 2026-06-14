import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const articles = [
  {
    slug: "indoor-jungle",
    category: "Design",
    title: "How to Build an Indoor Jungle Without the Clutter",
    excerpt:
      "Layering heights, matching pots, and negative space — the three rules that turn a plant pile into a curated living room. We walk through a real one-bedroom transformation.",
    author: "Maya Chen",
    date: "May 12, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "watering-myths",
    category: "Care",
    title: "5 Watering Myths That Are Killing Your Plants",
    excerpt:
      "Ice cubes for orchids, a set glass every Monday, and misting as a humidity fix — we debunk the advice that sounds helpful but often causes root rot.",
    author: "James Okafor",
    date: "April 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    slug: "low-light-heroes",
    category: "Plants",
    title: "The Best Low-Light Plants for North-Facing Rooms",
    excerpt:
      "No sun? No problem. ZZ Plants, Snake Plants, and Pothos not only survive dim corners — they actively clean the air while adding sculptural presence.",
    author: "Sarah Lin",
    date: "April 15, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    slug: "propagation-101",
    category: "How-To",
    title: "Propagation 101: Turn One Pothos Into Ten",
    excerpt:
      "Stem cuttings, water rooting, and when to move to soil. A step-by-step guide for the world's most forgiving plant — and the confidence to try it on everything else.",
    author: "Maya Chen",
    date: "March 30, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    slug: "terracotta-vs-plastic",
    category: "Gear",
    title: "Terracotta vs. Plastic Pots: What Actually Matters",
    excerpt:
      "Breathable walls, weight, and aesthetics all play a role. We compare drainage, evaporation rates, and long-term root health across common planter materials.",
    author: "James Okafor",
    date: "March 12, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    slug: "summer-care-checklist",
    category: "Seasonal",
    title: "The Summer Care Checklist Every Plant Parent Needs",
    excerpt:
      "Higher temperatures mean faster drying, hungrier roots, and more pests. Our checklist covers feeding schedules, humidity traps, and the one mistake to avoid in July.",
    author: "Sarah Lin",
    date: "June 3, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
];

const topics = ["Design", "Care", "Plants", "How-To", "Gear", "Seasonal"];

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — ePlant" },
      { name: "description", content: "Plant care articles and gardening tips from the ePlant team." },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="bg-mist min-h-screen">
      {/* Hero */}
      <section className="relative bg-leaf text-mist overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1600&q=80"
            alt="Editorial plant photography"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-clay mb-4">
            The Journal
          </span>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] max-w-2xl">
            Notes from the Greenhouse
          </h1>
          <p className="mt-6 text-mist/80 leading-relaxed text-lg max-w-xl">
            Stories on plant care, interior design, and the quiet joy of growing things — written by our team of growers and stylists.
          </p>
        </div>
      </section>

      {/* Topic pills */}
      <section className="border-b border-leaf/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-medium border border-leaf/15 rounded-full text-ink/70 hover:bg-leaf hover:text-mist transition-colors cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="group grid md:grid-cols-2 gap-0 bg-white rounded-xl border border-leaf/10 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-clay text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-full">
                Featured
              </span>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">
                {featured.category}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-leaf mt-3 leading-snug">
                {featured.title}
              </h2>
              <p className="text-ink/70 mt-4 leading-relaxed">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-ink/50">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {featured.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {featured.readTime}
                </span>
              </div>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-leaf hover:text-clay transition-colors self-start"
              >
                Read Article <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Article grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((a, i) => (
            <article
              key={i}
              className="group bg-white rounded-xl border border-leaf/10 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-leaf text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-full">
                  {a.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg text-leaf leading-snug">{a.title}</h3>
                <p className="text-sm text-ink/60 mt-2 leading-relaxed line-clamp-3">{a.excerpt}</p>
                <div className="mt-5 flex items-center gap-3 text-[11px] text-ink/40 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    {a.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {a.date}
                  </span>
                </div>
                <Link
                  to="/shop"
                  className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium text-clay hover:text-leaf transition-colors"
                >
                  Read More <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white border-t border-leaf/10">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">Subscribe</span>
          <h2 className="font-serif text-3xl text-leaf mt-3">Get Care Tips in Your Inbox</h2>
          <p className="text-ink/60 mt-3 leading-relaxed text-sm max-w-md mx-auto">
            One email a week. No spam, no sales — just practical plant advice, seasonal reminders, and greenhouse stories.
          </p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-mist border border-leaf/10 rounded-md text-sm placeholder:text-ink/30 focus:outline-none focus:ring-1 focus:ring-leaf"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-leaf text-mist text-xs uppercase tracking-widest font-medium rounded-md hover:bg-leaf-soft transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
