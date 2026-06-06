import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/care-guides")({
  head: () => ({
    meta: [{ title: "Care Guides — ePlant" }, { name: "description", content: "Watering, light, and care guides for our plants." }],
  }),
  component: () => (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">Care Library</span>
      <h1 className="font-serif text-5xl text-leaf mt-3">Care Guides</h1>
      <p className="text-ink/70 mt-6 leading-relaxed text-lg">
        Our complete care library is being potted. In the meantime, every product page includes a detailed water, light, and temperature primer.
      </p>
      <Link to="/shop" className="mt-10 inline-block bg-leaf text-mist px-8 py-3 text-xs uppercase tracking-widest">
        Browse plants
      </Link>
    </div>
  ),
});
