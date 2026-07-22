import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Loader2, Car, Images } from "lucide-react";

const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// A single vehicle card (the "Our Collection" style): name/subtitle on top, a
// photo, then price + purchase. `children` is an optional admin-actions slot.
export default function VehicleCard({ vehicle, onPurchase, purchasing, children }) {
  const [imgOk, setImgOk] = useState(true);
  const outOfStock = vehicle.quantity <= 0;
  const cover = vehicle.images?.[0];
  const hasImage = cover && imgOk;

  return (
    <div className="card group overflow-hidden transition hover:shadow-md">
      {/* Title */}
      <Link to={`/vehicles/${vehicle._id}`} className="block px-5 pt-5">
        <h3 className="font-bold text-slate-900 group-hover:text-brand-600">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-sm text-slate-500">{vehicle.category}</p>
      </Link>

      {/* Photo */}
      <Link to={`/vehicles/${vehicle._id}`} className="block px-5 py-4">
        <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-50">
          {hasImage ? (
            <img
              src={cover}
              alt={`${vehicle.make} ${vehicle.model}`}
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <Car size={40} />
            </div>
          )}
          {vehicle.images?.length > 1 && (
            <span className="badge absolute right-2 top-2 flex items-center gap-1 bg-white/90 text-slate-700 shadow-sm">
              <Images size={12} /> {vehicle.images.length}
            </span>
          )}
        </div>
      </Link>

      {/* Price + stock + buy */}
      <div className="px-5 pb-5">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span
            className={`font-medium ${outOfStock ? "text-red-500" : "text-emerald-600"}`}
          >
            ● {outOfStock ? "Out of stock" : `${vehicle.quantity} in stock`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-extrabold text-slate-900">{money(vehicle.price)}</p>
          <button
            onClick={() => onPurchase(vehicle)}
            disabled={outOfStock || purchasing}
            className="btn-primary px-4 py-2"
          >
            {purchasing ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
            {outOfStock ? "Sold" : "Buy"}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
