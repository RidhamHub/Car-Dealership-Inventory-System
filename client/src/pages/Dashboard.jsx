import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CarFront, Plus, Pencil, Trash2, PackagePlus, Flame, ChevronRight } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Filters from "../components/Filters";
import VehicleCard from "../components/VehicleCard";
import FeaturedCard from "../components/FeaturedCard";
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
  const [filtered, setFiltered] = useState(false);
  const [purchasingId, setPurchasingId] = useState(null);

  // Admin modal state.
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [restocking, setRestocking] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async (filters = {}) => {
    setLoading(true);
    const params = cleanParams(filters);
    setFiltered(Object.keys(params).length > 0);
    try {
      const { data } = await api.get("/vehicles/search", { params });
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
  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (vehicle) => { setEditing(vehicle); setShowForm(true); };
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

  const showPopular = !filtered && vehicles.length >= 3;

  const adminControls = (v) =>
    isAdmin && (
      <div className="mt-3 grid grid-cols-3 gap-2">
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
    );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero + search (white rounded panel like the reference) */}
      <section className="card mb-10 p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Drive the Car of your dreams
        </h1>
        <div className="mt-5">
          <Filters onSearch={load} />
        </div>
      </section>

      {loading ? (
        <SkeletonGrid />
      ) : vehicles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Popular cars (default view only) */}
          {showPopular && (
            <section className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Flame size={20} className="text-orange-500" /> Popular Cars
                </h2>
                <Link to="/dashboard" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
                  See All Collection <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {vehicles.slice(0, 3).map((v, i) => (
                  <FeaturedCard key={v._id} vehicle={v} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Full collection */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {filtered ? "Search Results" : "Our Collection"}
              </h2>
              {isAdmin ? (
                <button onClick={openAdd} className="btn-primary">
                  <Plus size={18} /> Add vehicle
                </button>
              ) : (
                <Link to="/dashboard" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
                  See All Collection <ChevronRight size={16} />
                </Link>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v._id}
                  vehicle={v}
                  onPurchase={purchase}
                  purchasing={purchasingId === v._id}
                >
                  {adminControls(v)}
                </VehicleCard>
              ))}
            </div>
          </section>
        </>
      )}

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
          <div className="h-44 w-full rounded-t-2xl bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-8 w-full rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center justify-center px-4 py-16 text-center">
      <CarFront size={40} className="text-slate-300" />
      <h3 className="mt-3 font-semibold text-slate-900">No vehicles found</h3>
      <p className="mt-1 text-sm text-slate-500">Try adjusting your search filters.</p>
    </div>
  );
}
