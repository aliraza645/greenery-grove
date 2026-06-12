import { useEffect, useMemo, useState } from "react";

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  // Unique, non-empty images, preserving order
  const unique = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    setActive(0);
  }, [unique.length, unique[0]]);

  if (unique.length === 0) {
    return <div className="aspect-[4/5] bg-mist flex items-center justify-center text-ink/40 text-sm">No image</div>;
  }

  const current = unique[Math.min(active, unique.length - 1)];

  return (
    <div>
      <div
        className="relative aspect-[4/5] bg-mist overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
        onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
            active: true,
          });
        }}
      >
        <img
          key={current}
          src={current}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-500 ease-out animate-in fade-in"
          style={zoom.active ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>

      {unique.length > 1 && (
        <ul
          role="tablist"
          aria-label="Product images"
          className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4"
        >
          {unique.map((src, i) => {
            const isActive = i === active;
            return (
              <li key={src}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show image ${i + 1} of ${unique.length}`}
                  onClick={() => setActive(i)}
                  className={`aspect-square w-full overflow-hidden bg-mist transition-all duration-200 ${
                    isActive ? "ring-2 ring-leaf ring-offset-2 ring-offset-white" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
