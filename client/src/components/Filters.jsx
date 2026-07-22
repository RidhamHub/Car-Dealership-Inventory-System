import { useState } from "react";
import { Search, X, ArrowDownUp } from "lucide-react";

const empty = { make: "", model: "", category: "", minPrice: "", maxPrice: "", sort: "" };
const categories = ["", "Sedan", "SUV", "Coupe", "Truck", "Hatchback"];

// Search / filter bar. Calls onSearch with the current filter values.
export default function Filters({ onSearch }) {
  const [f, setF] = useState(empty);

  const update = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSearch(f);
  };

  const reset = () => {
    setF(empty);
    onSearch(empty);
  };

  // Sorting applies immediately (no need to press Search).
  const changeSort = (e) => {
    const next = { ...f, sort: e.target.value };
    setF(next);
    onSearch(next);
  };

  return (
    <form onSubmit={submit} className="card p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <input className="input lg:col-span-1" name="make" value={f.make} onChange={update} placeholder="Make" />
        <input className="input lg:col-span-1" name="model" value={f.model} onChange={update} placeholder="Model" />
        <select className="input lg:col-span-1" name="category" value={f.category} onChange={update}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c || "All categories"}
            </option>
          ))}
        </select>
        <input className="input lg:col-span-1" name="minPrice" value={f.minPrice} onChange={update} type="number" min="0" placeholder="Min ₹" />
        <input className="input lg:col-span-1" name="maxPrice" value={f.maxPrice} onChange={update} type="number" min="0" placeholder="Max ₹" />
        <div className="flex gap-2 lg:col-span-1">
          <button type="submit" className="btn-primary flex-1">
            <Search size={16} /> Search
          </button>
          <button type="button" onClick={reset} className="btn-outline" title="Reset filters">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Sort control */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <ArrowDownUp size={16} className="text-slate-400" />
        <label className="text-sm text-slate-400">Sort by</label>
        <select className="input w-auto" name="sort" value={f.sort} onChange={changeSort}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </form>
  );
}
