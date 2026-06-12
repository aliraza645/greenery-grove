import { useRef, useState } from "react";
import { Loader2, Upload, X, Star } from "lucide-react";
import { toast } from "sonner";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

interface Props {
  images: string[];
  onChange: (next: string[]) => void;
  max?: number;
}

export function CloudinaryUploader({ images, onChange, max = 20 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const configured = cloudinaryConfigured();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!configured) {
      toast.error("Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env");
      return;
    }
    const room = max - images.length;
    const queue = Array.from(files).slice(0, room);
    if (queue.length === 0) {
      toast.error(`Max ${max} images`);
      return;
    }
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const f of queue) {
        try {
          const url = await uploadToCloudinary(f);
          uploaded.push(url);
        } catch (e) {
          toast.error((e as Error).message);
        }
      }
      if (uploaded.length) {
        onChange([...images, ...uploaded]);
        toast.success(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`);
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));
  const makePrimary = (idx: number) => {
    if (idx === 0) return;
    const next = [...images];
    const [pick] = next.splice(idx, 1);
    onChange([pick, ...next]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 bg-leaf text-mist px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy ? "Uploading…" : "Upload images"}
        </button>
        <span className="text-xs text-ink/50">
          {images.length} / {max} · first is cover
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {!configured && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
          Cloudinary not configured. Set <code>VITE_CLOUDINARY_CLOUD_NAME</code> and{" "}
          <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> (unsigned) in <code>.env</code>.
        </p>
      )}

      {images.length > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((src, idx) => (
            <li key={src} className="relative group aspect-square bg-mist border border-ink/10 overflow-hidden">
              <img src={src} alt={`Product image ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-leaf text-mist text-[10px] uppercase tracking-wider px-1.5 py-0.5">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(idx)}
                    title="Set as cover"
                    className="bg-white/90 p-1.5 hover:bg-white"
                  >
                    <Star className="h-3.5 w-3.5 text-leaf" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  title="Remove"
                  className="bg-white/90 p-1.5 hover:bg-white"
                >
                  <X className="h-3.5 w-3.5 text-red-600" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
