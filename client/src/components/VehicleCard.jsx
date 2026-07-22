import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Loader2, Car, Images } from "lucide-react";

const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// A single vehicle card: cover photo (links to details), price, stock and a
// purchase button. `children` is an optional slot used for admin actions.
export default function VehicleCard({ vehicle, onPurchase, purchasing, children }) {
  const [imgOk, setImgOk] = useState(true);
  const outOfStock = vehicle.quantity <= 0;
  const cover = vehicle.images?.[0];
  const hasImage = cover && imgOk;

  return (
    <div className="card group overflow-hidden">
      {/* Cover photo (or branded fallback) — links to the details page */}
      <Link to={`/vehicles/${vehicle._id}`} className="block">
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {hasImage ? (
            <img
              src={cover}
              alt={`${vehicle.make} ${vehicle.model}`}
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-slate-500">
              <Car size={40} />
              <span className="mt-1 text-xs font-medium">{vehicle.make}</span>
            </div>
          )}
          <span className="badge absolute left-3 top-3 bg-slate-950/70 text-slate-200 ring-1 ring-white/10">
            {vehicle.category}
          </span>
          {vehicle.images?.length > 1 && (
            <span className="badge absolute right-3 top-3 flex items-center gap-1 bg-slate-950/70 text-slate-200 ring-1 ring-white/10">
              <Images size={12} /> {vehicle.images.length}
            </span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/vehicles/${vehicle._id}`}>
              <h3 className="font-bold text-white hover:text-brand-400">
                {vehicle.make} {vehicle.model}
              </h3>
            </Link>
            <p className="mt-0.5 text-2xl font-extrabold text-white">{money(vehicle.price)}</p>
          </div>
          <span
            className={`badge ${
              outOfStock
                ? "bg-red-500/15 text-red-300 ring-1 ring-red-400/30"
                : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30"
            }`}
          >
            {outOfStock ? "Out of stock" : `${vehicle.quantity} in stock`}
          </span>
        </div>

        <button
          onClick={() => onPurchase(vehicle)}
          disabled={outOfStock || purchasing}
          className="btn-primary mt-4 w-full"
        >
          {purchasing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ShoppingCart size={18} />
          )}
          {outOfStock ? "Sold out" : purchasing ? "Processing..." : "Purchase"}
        </button>

        {children}
      </div>
    </div>
  );
}
