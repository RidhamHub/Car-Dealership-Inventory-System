import { useState } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import { resizeImage } from "../utils/resizeImage";

const categories = ["Sedan", "SUV", "Coupe", "Truck", "Hatchback"];
const MAX_PHOTOS = 6;

// Add / edit form. `initial` is a vehicle when editing, or null when adding.
export default function VehicleForm({ initial, onSubmit, onClose, saving }) {
  const [f, setF] = useState({
    make: initial?.make || "",
    model: initial?.model || "",
    category: initial?.category || "Sedan",
    price: initial?.price ?? "",
    quantity: initial?.quantity ?? "",
  });
  const [images, setImages] = useState(initial?.images || []);
  const [imgError, setImgError] = useState("");

  const update = (e) => setF({ ...f, [e.target.name]: e.target.value });

  // Resize each chosen file and add it to the gallery (up to MAX_PHOTOS).
  const onFiles = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = ""; // let the same file be re-picked later
    if (!files.length) return;

    const room = MAX_PHOTOS - images.length;
    if (room <= 0) {
      setImgError(`You can add up to ${MAX_PHOTOS} photos`);
      return;
    }
    setImgError("");
    try {
      const resized = await Promise.all(files.slice(0, room).map((file) => resizeImage(file)));
      setImages((prev) => [...prev, ...resized]);
    } catch {
      setImgError("Could not process one of the images");
    }
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      make: f.make,
      model: f.model,
      category: f.category,
      price: Number(f.price),
      quantity: Number(f.quantity),
      images,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {/* Photo gallery upload with previews */}
      <div>
        <label className="label">Photos ({images.length}/{MAX_PHOTOS})</label>
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative h-16 w-24 overflow-hidden rounded-lg border border-slate-200">
              <img src={src} alt={`photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white hover:bg-red-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {images.length < MAX_PHOTOS && (
            <label className="grid h-16 w-24 cursor-pointer place-items-center rounded-lg border border-dashed border-slate-300 text-slate-400 hover:border-brand-500 hover:text-brand-600">
              <ImagePlus size={20} />
              <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
            </label>
          )}
        </div>
        {imgError && <p className="mt-1 text-xs text-red-500">{imgError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Make</label>
          <input className="input" name="make" value={f.make} onChange={update} required />
        </div>
        <div>
          <label className="label">Model</label>
          <input className="input" name="model" value={f.model} onChange={update} required />
        </div>
      </div>

      <div>
        <label className="label">Category</label>
        <select className="input" name="category" value={f.category} onChange={update}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Price (₹)</label>
          <input className="input" name="price" value={f.price} onChange={update} type="number" min="0" required />
        </div>
        <div>
          <label className="label">Quantity</label>
          <input className="input" name="quantity" value={f.quantity} onChange={update} type="number" min="0" required />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn-outline flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={saving}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {initial ? "Save changes" : "Add vehicle"}
        </button>
      </div>
    </form>
  );
}
