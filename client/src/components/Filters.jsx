import { useState } from "react";
import { Search, ArrowDownUp, ChevronDown } from "lucide-react";

const empty = { make: "", model: "", category: "", minPrice: "", maxPrice: "", sort: "" };
const categories = ["", "Sedan", "SUV", "Coupe", "Truck", "Hatchback"];

// Segmented hero search bar (like the reference). Calls onSearch with the
// current filter values.
export default function Filters({ onSearch }) {
  const [f, setF] = useState(empty);

  const update = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSearch(f);
  };
  const changeSort = (e) => {
    const next = { ...f, sort: e.target.value };
    setF(next);
    onSearch(next);
  };

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        {/* Segmented fields in one rounded, divided container */}
        <div className="grid flex-1 grid-cols-1 divide-y divide-slate-200 rounded-2xl border border-slate-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          <Segment label="Car Brand">
            <input className="seg-input" name="make" value={f.make} onChange={update} placeholder="Any make" />
          </Segment>
          <Segment label="Car Model">
            <input className="seg-input" name="model" value={f.model} onChange={update} placeholder="Any model" />
          </Segment>
          <Segment label="Category" chevron>
            <select className="seg-input appearance-none pr-6" name="category" value={f.category} onChange={update}>
              {categories.map((c) => (
                <option key={c} value={c}>{c || "Any"}</option>
              ))}
            </select>
          </Segment>
          <Segment label="Price Range (₹)">
            <div className="flex items-center gap-1">
              <input className="seg-input" name="minPrice" value={f.minPrice} onChange={update} type="number" min="0" placeholder="Min" />
              <span className="text-slate-300">–</span>
              <input className="seg-input" name="maxPrice" value={f.maxPrice} onChange={update} type="number" min="0" placeholder="Max" />
            </div>
          </Segment>
        </div>

        {/* Big blue search button */}
        <button type="submit" className="flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-brand-700">
          <Search size={18} /> Search
        </button>
      </div>

      {/* Sort control */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <ArrowDownUp size={16} className="text-slate-400" />
        <label className="text-sm text-slate-500">Sort by</label>
        <select className="input w-auto" name="sort" value={f.sort} onChange={changeSort}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </form>
  );
}

// One labeled segment inside the search bar.
function Segment({ label, children, chevron }) {
  return (
    <div className="relative px-4 py-3">
      <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      {children}
      {chevron && <ChevronDown size={16} className="pointer-events-none absolute bottom-4 right-3 text-slate-400" />}
    </div>
  );
}
