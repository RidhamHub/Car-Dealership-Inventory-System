import { useEffect, useState } from "react";
import { CarFront } from "lucide-react";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";
import Filters from "../components/Filters";
import VehicleCard from "../components/VehicleCard";

// Keep only the filter fields the user actually filled in.
const cleanParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v != null));

export default function Dashboard() {
  const toast = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  // Load vehicles, optionally filtered. /search returns everything when empty.
  const load = async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/vehicles/search", { params: cleanParams(filters) });
      setVehicles(data);
    } catch (err) {
      toast("Could not load vehicles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const purchase = async (vehicle) => {
    setPurchasingId(vehicle._id);
    try {
      const { data } = await api.post(`/vehicles/${vehicle._id}/purchase`);
      // Replace the card with the updated stock returned by the server.
      setVehicles((list) => list.map((v) => (v._id === vehicle._id ? data : v)));
      toast(`Purchased ${vehicle.make} ${vehicle.model}!`);
    } catch (err) {
      toast(err.response?.data?.message || "Purchase failed", "error");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Browse vehicles</h1>
        <p className="mt-1 text-slate-400">Find and purchase your next car.</p>
      </div>

      <Filters onSearch={load} />

      <div className="mt-6">
        {loading ? (
          <SkeletonGrid />
        ) : vehicles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard
                key={v._id}
                vehicle={v}
                onPurchase={purchase}
                purchasing={purchasingId === v._id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card h-72 animate-pulse">
          <div className="h-44 w-full rounded-t-2xl bg-white/5" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-8 w-full rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center justify-center px-4 py-16 text-center">
      <CarFront size={40} className="text-slate-500" />
      <h3 className="mt-3 font-semibold text-white">No vehicles found</h3>
      <p className="mt-1 text-sm text-slate-400">Try adjusting your search filters.</p>
    </div>
  );
}
