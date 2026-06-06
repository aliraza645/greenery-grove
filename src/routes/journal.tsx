import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [{ title: "Journal — ePlant" }, { name: "description", content: "Plant care articles and gardening tips." }],
  }),
  component: () => (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">The Journal</span>
      <h1 className="font-serif text-5xl text-leaf mt-3">Notes from the Greenhouse</h1>
      <p className="text-ink/70 mt-6 leading-relaxed text-lg">
        Long-form articles on plant care, design, and our growers — coming soon.
      </p>
      <Link to="/shop" className="mt-10 inline-block bg-leaf text-mist px-8 py-3 text-xs uppercase tracking-widest">
        Browse plants
      </Link>
    </div>
  ),
});
