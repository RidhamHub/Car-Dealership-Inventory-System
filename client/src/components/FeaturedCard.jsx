import { Link } from "react-router-dom";
import { Car, BadgeCheck } from "lucide-react";

const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// Rotating pastel backgrounds for the "Popular Cars" row.
const tints = ["bg-indigo-50", "bg-sky-50", "bg-rose-50"];

// A large, pastel featured card used in the "Popular Cars" section — matches
// the marketplace reference: brand mark + title, status badge, watermark, and
// a verified footer with the price.
export default function FeaturedCard({ vehicle, index = 0 }) {
  const outOfStock = vehicle.quantity <= 0;
  const cover = vehicle.images?.[0];

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 p-5 transition hover:shadow-md ${tints[index % tints.length]}`}
    >
      {/* Header: brand mark + name/subtitle + status badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm">
            {vehicle.make?.[0]?.toUpperCase()}
          </span>
          <div>
            <h3 className="font-bold leading-tight text-slate-900">{vehicle.make} {vehicle.model}</h3>
            <p className="text-xs text-slate-500">{vehicle.category}</p>
          </div>
        </div>
        <span className={`badge bg-white shadow-sm ${outOfStock ? "text-red-500" : "text-slate-700"}`}>
          {outOfStock ? "Reserved" : `${vehicle.quantity} available`}
        </span>
      </div>

      {/* Watermark brand text + car photo */}
      <div className="relative my-4 h-28">
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-extrabold uppercase tracking-widest text-slate-900/5">
          {vehicle.make}
        </span>
        <div className="relative z-10 h-full w-full overflow-hidden rounded-xl">
          {cover ? (
            <img
              src={cover}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <Car size={44} />
            </div>
          )}
        </div>
      </div>

      {/* Footer: verified seller + price */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-400 text-white">
            <Car size={12} />
          </span>
          AutoHub
          <BadgeCheck size={14} className="text-brand-600" />
        </span>
        <p className="text-lg font-extrabold text-slate-900">{money(vehicle.price)}</p>
      </div>
    </Link>
  );
}
