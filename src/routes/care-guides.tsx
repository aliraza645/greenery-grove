import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplets, Sun, Thermometer, Wind, Sprout, Bug, Scissors, AlertCircle } from "lucide-react";

const guides = [
  {
    icon: Droplets,
    tag: "Water",
    title: "How Often Should You Water?",
    excerpt:
      "Overwatering is the most common killer of houseplants. Learn the finger test, drainage rules, and seasonal adjustments that keep roots healthy.",
    tips: [
      "Insert a finger 2 inches into the soil. If dry, water thoroughly.",
      "Always empty the saucer 30 minutes after watering to prevent root rot.",
      "Reduce frequency by half in winter when growth slows.",
      "Tap water left overnight loses chlorine and reaches room temperature.",
    ],
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Sun,
    tag: "Light",
    title: "Reading Your Room's Light",
    excerpt:
      "Not all 'bright' rooms are equal. Understand the difference between direct, indirect, and low light so you can match the right plant to every corner.",
    tips: [
      "South-facing windows provide the strongest direct light.",
      "Bright indirect light means the sun never touches the leaf directly.",
      "Low-light plants like ZZ and Snake can thrive several feet from any window.",
      "Rotate plants a quarter-turn every watering to prevent lopsided growth.",
    ],
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Thermometer,
    tag: "Climate",
    title: "Temperature & Humidity Basics",
    excerpt:
      "Most tropical houseplants prefer the same temperatures you do. Learn how to avoid drafts, manage dry winter air, and create microclimates with pebble trays.",
    tips: [
      "Keep plants away from radiators and AC vents year-round.",
      "Group plants together to raise local humidity by 10–15%.",
      "Mist Calatheas and ferns in the morning so leaves dry before evening.",
      "A humidity tray with pebbles and water creates a gentle moisture buffer.",
    ],
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Scissors,
    tag: "Maintenance",
    title: "When & How to Repot",
    excerpt:
      "Roots circling the pot? Water running straight through? It may be time to upgrade. Here's how to choose pot size, soil mix, and the right season for minimal transplant shock.",
    tips: [
      "Repot in spring when the plant is entering active growth.",
      "Choose a pot only 1–2 inches larger than the current one.",
      "Use a chunky, well-draining mix for tropical plants; gritty mix for succulents.",
      "Water thoroughly after repotting to settle soil around the roots.",
    ],
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Bug,
    tag: "Pests",
    title: "Spotting & Stopping Pests",
    excerpt:
      "Spider mites, mealybugs, and fungus gnats are the usual suspects. Catch them early with weekly leaf inspections and treat naturally with neem oil or sticky traps.",
    tips: [
      "Check leaf undersides and stem joints every Sunday.",
      "Isolate new plants for two weeks before placing them near your collection.",
      "Neem oil sprayed at dusk is effective against most soft-bodied insects.",
      "Let the top inch of soil dry to break the fungus gnat life cycle.",
    ],
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Sprout,
    tag: "Growth",
    title: "Fertilizing Without Burn",
    excerpt:
      "Plants in pots deplete nutrients over time. Learn the N-P-K ratios, when to feed, and why half-strength is often better than the label dose.",
    tips: [
      "Feed only during spring and summer when plants are actively growing.",
      "Dilute liquid fertilizer to half the manufacturer's recommendation.",
      "Organic options like worm castings are gentler and harder to over-apply.",
      "Flush the soil every few months to prevent salt buildup on roots.",
    ],
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
  },
];

export const Route = createFileRoute("/care-guides")({
  head: () => ({
    meta: [
      { title: "Care Guides — ePlant" },
      { name: "description", content: "Watering, light, and care guides for our plants." },
    ],
  }),
  component: CareGuidesPage,
});

function CareGuidesPage() {
  return (
    <div className="bg-mist min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-leaf text-mist">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80"
            alt="Lush greenhouse"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-clay mb-4">
            Care Library
          </span>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] max-w-2xl">
            Keep Your Plants Thriving
          </h1>
          <p className="mt-6 text-mist/80 leading-relaxed text-lg max-w-xl">
            Expert guides built from years of greenhouse growing. From first watering to seasonal repotting, every answer starts here.
          </p>
        </div>
      </section>

      {/* Quick Stats / Trust */}
      <section className="border-b border-leaf/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          <div>
            <div className="font-serif text-2xl text-leaf">6</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">Core Guides</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-leaf">24</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">Expert Tips</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-leaf">100%</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50 mt-1">Beginner Friendly</div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((g, i) => (
            <article
              key={i}
              className="group bg-white rounded-xl border border-leaf/10 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={g.image}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold text-leaf">
                  <g.icon className="size-3.5" />
                  {g.tag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-leaf">{g.title}</h3>
                <p className="text-sm text-ink/60 mt-2 leading-relaxed">{g.excerpt}</p>
                <ul className="mt-5 space-y-2.5">
                  {g.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-ink/70">
                      <Wind className="size-3.5 mt-0.5 text-clay shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Seasonal Reminder */}
      <section className="bg-white border-t border-leaf/10">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">Seasonal Note</span>
            <h2 className="font-serif text-3xl md:text-4xl text-leaf mt-3">
              Adjust Care With the Seasons
            </h2>
            <p className="text-ink/70 mt-4 leading-relaxed max-w-lg">
              Light intensity, indoor humidity, and plant metabolism all shift through the year. In winter, most houseplants need less water, no fertilizer, and protection from cold drafts. In spring, resume feeding and check for root-bound pots before the growth spurt.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-ink/70">
                <AlertCircle className="size-4 text-clay" />
                <span>Reduce watering 30–50% in winter</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink/70">
                <AlertCircle className="size-4 text-clay" />
                <span>Hold fertilizer October–March</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 shrink-0 rounded-xl overflow-hidden border border-leaf/10">
            <img
              src="https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=800&q=80"
              alt="Seasonal plant care"
              className="w-full h-64 object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-leaf text-mist">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-serif text-3xl">Ready to put this into practice?</h2>
          <p className="mt-3 text-mist/70 max-w-md mx-auto">
            Every plant in our shop includes a tailored care card with water, light, and temperature specifics.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block bg-clay text-white px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-clay/90 transition-colors"
          >
            Browse Plants
          </Link>
        </div>
      </section>
    </div>
  );
}
