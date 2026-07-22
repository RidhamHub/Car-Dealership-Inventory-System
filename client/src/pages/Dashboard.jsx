import { useEffect, useState } from "react";
import { CarFront, Plus, Pencil, Trash2, PackagePlus } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Filters from "../components/Filters";
import VehicleCard from "../components/VehicleCard";
import Modal from "../components/Modal";
import VehicleForm from "../components/VehicleForm";
import RestockForm from "../components/RestockForm";

// Keep only the filter fields the user actually filled in.
const cleanParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v != null));

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const toast = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  // Admin modal state.
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // vehicle being edited, or null
  const [restocking, setRestocking] = useState(null); // vehicle being restocked
  const [saving, setSaving] = useState(false);

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
      setVehicles((list) => list.map((v) => (v._id === vehicle._id ? data : v)));
      toast(`Purchased ${vehicle.make} ${vehicle.model}!`);
    } catch (err) {
      toast(err.response?.data?.message || "Purchase failed", "error");
    } finally {
      setPurchasingId(null);
    }
  };

  // ---- Admin actions ----
  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (vehicle) => {
    setEditing(vehicle);
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const saveVehicle = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        const { data: updated } = await api.put(`/vehicles/${editing._id}`, data);
        setVehicles((list) => list.map((v) => (v._id === editing._id ? updated : v)));
        toast("Vehicle updated");
      } else {
        const { data: created } = await api.post("/vehicles", data);
        setVehicles((list) => [created, ...list]);
        toast("Vehicle added");
      }
      closeForm();
    } catch (err) {
      toast(err.response?.data?.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (vehicle) => {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return;
    try {
      await api.delete(`/vehicles/${vehicle._id}`);
      setVehicles((list) => list.filter((v) => v._id !== vehicle._id));
      toast("Vehicle deleted");
    } catch (err) {
      toast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const doRestock = async (amount) => {
    setSaving(true);
    try {
      const { data } = await api.post(`/vehicles/${restocking._id}/restock`, { quantity: amount });
      setVehicles((list) => list.map((v) => (v._id === restocking._id ? data : v)));
      toast(`Restocked ${restocking.make} ${restocking.model}`);
      setRestocking(null);
    } catch (err) {
      toast(err.response?.data?.message || "Restock failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Browse vehicles</h1>
          <p className="mt-1 text-slate-400">Find and purchase your next car.</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="btn-primary shrink-0">
            <Plus size={18} /> Add vehicle
          </button>
        )}
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
              >
                {isAdmin && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <button onClick={() => openEdit(v)} className="btn-outline px-2 py-1.5 text-xs">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => setRestocking(v)} className="btn-outline px-2 py-1.5 text-xs">
                      <PackagePlus size={14} /> Stock
                    </button>
                    <button onClick={() => remove(v)} className="btn-danger px-2 py-1.5 text-xs">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </VehicleCard>
            ))}
          </div>
        )}
      </div>

      {/* Admin modals */}
      {showForm && (
        <Modal title={editing ? "Edit vehicle" : "Add vehicle"} onClose={closeForm}>
          <VehicleForm initial={editing} onSubmit={saveVehicle} onClose={closeForm} saving={saving} />
        </Modal>
      )}
      {restocking && (
        <Modal title={`Restock ${restocking.make} ${restocking.model}`} onClose={() => setRestocking(null)}>
          <RestockForm onSubmit={doRestock} onClose={() => setRestocking(null)} saving={saving} />
        </Modal>
      )}
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
