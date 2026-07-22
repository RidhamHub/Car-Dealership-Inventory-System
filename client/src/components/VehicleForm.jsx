import { useState } from "react";
import { Loader2 } from "lucide-react";

const categories = ["Sedan", "SUV", "Coupe", "Truck", "Hatchback"];

// Add / edit form. `initial` is a vehicle when editing, or null when adding.
export default function VehicleForm({ initial, onSubmit, onClose, saving }) {
  const [f, setF] = useState({
    make: initial?.make || "",
    model: initial?.model || "",
    category: initial?.category || "Sedan",
    price: initial?.price ?? "",
    quantity: initial?.quantity ?? "",
  });

  const update = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      make: f.make,
      model: f.model,
      category: f.category,
      price: Number(f.price),
      quantity: Number(f.quantity),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
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
          <label className="label">Price ($)</label>
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
