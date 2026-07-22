import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Car,
  Mail,
  Calendar,
  Tag,
  Package,
} from "lucide-react";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";

const money = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const ADMIN_EMAIL = "admin@dealership.com";

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0); // selected gallery photo
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setVehicle(data);
      } catch (err) {
        toast("Vehicle not found", "error");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const purchase = async () => {
    setPurchasing(true);
    try {
      const { data } = await api.post(`/vehicles/${id}/purchase`);
      setVehicle(data);
      toast(`Purchased ${data.make} ${data.model}!`);
    } catch (err) {
      toast(err.response?.data?.message || "Purchase failed", "error");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="animate-spin text-brand-400" size={32} />
      </div>
    );
  }
  if (!vehicle) return null;

  const images = vehicle.images || [];
  const outOfStock = vehicle.quantity <= 0;
  const postedOn = new Date(vehicle.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mailto = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(
    `Enquiry about ${vehicle.make} ${vehicle.model}`
  )}&body=${encodeURIComponent(`Hi, I'm interested in the ${vehicle.make} ${vehicle.model} priced at ${money(vehicle.price)}.`)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Back to vehicles
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
            {images.length ? (
              <img src={images[active]} alt={vehicle.model} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-slate-500">
                <Car size={56} />
                <span className="mt-2 text-sm">No photos yet</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-16 w-24 overflow-hidden rounded-lg border transition ${
                    i === active ? "border-brand-400 ring-2 ring-brand-400/40" : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="badge bg-brand-500/15 text-brand-400 ring-1 ring-brand-400/30">
            {vehicle.category}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-white">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-2 text-4xl font-extrabold text-white">{money(vehicle.price)}</p>

          <div className="mt-6 space-y-3 text-sm">
            <Detail icon={<Package size={16} />} label="Availability">
              <span className={outOfStock ? "text-red-300" : "text-emerald-300"}>
                {outOfStock ? "Out of stock" : `${vehicle.quantity} in stock`}
              </span>
            </Detail>
            <Detail icon={<Tag size={16} />} label="Category">{vehicle.category}</Detail>
            <Detail icon={<Calendar size={16} />} label="Posted on">{postedOn}</Detail>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={purchase} disabled={outOfStock || purchasing} className="btn-primary flex-1 py-3">
              {purchasing ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
              {outOfStock ? "Sold out" : purchasing ? "Processing..." : "Purchase now"}
            </button>
            <a href={mailto} className="btn-outline flex-1 py-3">
              <Mail size={18} /> Contact admin
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function Detail({ icon, label, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-brand-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-200">{children}</p>
      </div>
    </div>
  );
}
