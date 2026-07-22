import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, getApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { CATEGORIES, formatINR, type Vehicle } from "@/lib/utils-app";
import { RequireAuth } from "@/components/require-auth";
import { AppHeader } from "@/components/app-header";
import { VehicleForm } from "@/components/vehicle-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowRight,
  Car as CarIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Vehicles — Karzone" },
      { name: "description", content: "Browse and reserve exotic cars in the Karzone collection." },
      { property: "og:title", content: "Vehicles — Karzone" },
      { property: "og:description", content: "Browse the Karzone collection." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
});

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<"" | "price_asc" | "price_desc">("");

  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [restocking, setRestocking] = useState<Vehicle | null>(null);

  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (make) p.make = make;
    if (model) p.model = model;
    if (category) p.category = category;
    if (minPrice) p.minPrice = minPrice;
    if (maxPrice) p.maxPrice = maxPrice;
    if (sort) p.sort = sort;
    return p;
  }, [make, model, category, minPrice, maxPrice, sort]);

  useEffect(() => {
    const hasFilters = Object.keys(params).length > 0;
    const t = setTimeout(() => {
      setLoading(true);
      const endpoint = hasFilters ? "/vehicles/search" : "/vehicles";
      api
        .get<Vehicle[]>(endpoint, { params })
        .then(({ data }) => setVehicles(data))
        .catch((err) => toast.error(getApiError(err, "Failed to load vehicles")))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [params]);

  const handlePurchase = async (v: Vehicle) => {
    try {
      const { data } = await api.post<Vehicle>(`/vehicles/${v._id}/purchase`, { quantity: 1 });
      setVehicles((cur) => cur.map((x) => (x._id === v._id ? data : x)));
      toast.success(`Purchased ${v.make} ${v.model}`);
    } catch (err) {
      toast.error(getApiError(err, "Purchase failed"));
    }
  };

  const handleDelete = async (v: Vehicle) => {
    if (!confirm(`Delete ${v.make} ${v.model}?`)) return;
    try {
      await api.delete(`/vehicles/${v._id}`);
      setVehicles((cur) => cur.filter((x) => x._id !== v._id));
      toast.success("Vehicle deleted");
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const upsert = (v: Vehicle) => {
    setVehicles((cur) => {
      const exists = cur.find((x) => x._id === v._id);
      return exists ? cur.map((x) => (x._id === v._id ? v : x)) : [v, ...cur];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The Collection</div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Rent the luxury. <span className="italic text-muted-foreground">Own the thrill.</span>
            </h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add vehicle
            </button>
          )}
        </div>

        {/* filters */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-4">
          <div className="grid gap-3 md:grid-cols-6">
            <FilterInput icon={<Search className="h-4 w-4" />} placeholder="Make" value={make} onChange={setMake} />
            <FilterInput icon={<CarIcon className="h-4 w-4" />} placeholder="Model" value={model} onChange={setModel} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
        </div>

        {/* list */}
        <div className="mt-6">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : vehicles.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v._id}
                  vehicle={v}
                  isAdmin={isAdmin}
                  onPurchase={() => handlePurchase(v)}
                  onEdit={() => setEditing(v)}
                  onDelete={() => handleDelete(v)}
                  onRestock={() => setRestocking(v)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add vehicle</DialogTitle>
          </DialogHeader>
          <VehicleForm
            onDone={(v) => {
              upsert(v);
              setShowAdd(false);
            }}
            onCancel={() => setShowAdd(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit vehicle</DialogTitle>
          </DialogHeader>
          <VehicleForm
            initial={editing}
            onDone={(v) => {
              upsert(v);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Restock dialog */}
      <RestockDialog
        vehicle={restocking}
        onClose={() => setRestocking(null)}
        onUpdate={(v) => {
          upsert(v);
          setRestocking(null);
        }}
      />
    </div>
  );
}

function FilterInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-input pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface/40 py-20 text-center">
      <CarIcon className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 font-display text-lg font-semibold">No vehicles match</h3>
      <p className="mt-1 text-sm text-muted-foreground">Try clearing some filters.</p>
    </div>
  );
}

function VehicleCard({
  vehicle,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}: {
  vehicle: Vehicle;
  isAdmin: boolean;
  onPurchase: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRestock: () => void;
}) {
  const sold = vehicle.quantity === 0;
  const cover = vehicle.images?.[0];

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40">
      <Link to="/vehicles/$id" params={{ id: vehicle._id }} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
          {cover ? (
            <img
              src={cover}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <CarIcon className="h-10 w-10" />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs backdrop-blur">
            {vehicle.category}
          </span>
          {sold && (
            <span className="absolute right-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
              Sold out
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{vehicle.make}</div>
            <h3 className="mt-0.5 font-display text-xl font-semibold">{vehicle.model}</h3>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-bold text-primary">{formatINR(vehicle.price)}</div>
            <div className="text-xs text-muted-foreground">{vehicle.quantity} in stock</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            disabled={sold}
            onClick={onPurchase}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted-foreground"
          >
            {sold ? "Sold out" : <>
              <ShoppingBag className="h-4 w-4" /> Purchase
            </>}
          </button>
          <Link
            to="/vehicles/$id"
            params={{ id: vehicle._id }}
            className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-2"
          >
            Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isAdmin && (
          <div className="mt-3 flex gap-1.5 border-t border-border pt-3">
            <AdminBtn onClick={onEdit} icon={<Pencil className="h-3.5 w-3.5" />} label="Edit" />
            <AdminBtn onClick={onRestock} icon={<Package className="h-3.5 w-3.5" />} label="Restock" />
            <AdminBtn onClick={onDelete} icon={<Trash2 className="h-3.5 w-3.5" />} label="Delete" danger />
          </div>
        )}
      </div>
    </div>
  );
}

function AdminBtn({
  onClick,
  icon,
  label,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs transition-colors ${
        danger
          ? "text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function RestockDialog({
  vehicle,
  onClose,
  onUpdate,
}: {
  vehicle: Vehicle | null;
  onClose: () => void;
  onUpdate: (v: Vehicle) => void;
}) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) setQty(1);
  }, [vehicle]);

  const submit = async () => {
    if (!vehicle) return;
    setLoading(true);
    try {
      const { data } = await api.post<Vehicle>(`/vehicles/${vehicle._id}/restock`, { quantity: qty });
      onUpdate(data);
      toast.success(`Added ${qty} units`);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!vehicle} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Restock {vehicle?.make} {vehicle?.model}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Units to add</span>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-2">Cancel</button>
            <button disabled={loading} onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Restock
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
