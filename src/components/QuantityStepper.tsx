import { Minus, Plus } from "lucide-react";

export function QuantityStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center border border-leaf/20">
      <button onClick={() => onChange(Math.max(1, value - 1))} className="p-2.5 hover:bg-leaf/5" aria-label="Decrease">
        <Minus className="size-3.5" />
      </button>
      <span className="px-4 text-sm font-medium tabular-nums min-w-[2.5rem] text-center">{value}</span>
      <button onClick={() => onChange(value + 1)} className="p-2.5 hover:bg-leaf/5" aria-label="Increase">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
