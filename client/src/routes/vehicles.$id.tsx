import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, getApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatINR, type Vehicle } from "@/lib/utils-app";
import { RequireAuth } from "@/components/require-auth";
import { AppHeader } from "@/components/app-header";
import { VehicleForm } from "@/components/vehicle-form";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Calendar, Car as CarIcon, Loader2, Mail, Package, Pencil, ShoppingBag, Trash2 } from "lucide-react";

export const Route = createFileRoute("/vehicles/$id")({
  head: () => ({
    meta: [
      { title: "Vehicle — RK AutoHub" },
      { name: "description", content: "Vehicle details on RK AutoHub." },
      { property: "og:title", content: "Vehicle — RK AutoHub" },
      { property: "og:description", content: "Vehicle details on RK AutoHub." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <VehiclePage />
    </RequireAuth>
  ),
});

function VehiclePage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [restockQty, setRestockQty] = useState(1);
  const [restocking, setRestocking] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleDelete = async () => {
    if (!vehicle) return;
    try {
      await api.delete(`/vehicles/${vehicle._id}`);
      toast.success("Vehicle deleted");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const handleRestock = async () => {
    if (!vehicle) return;
    setRestocking(true);
    try {
      const { data } = await api.post<Vehicle>(`/vehicles/${vehicle._id}/restock`, { quantity: restockQty });
      setVehicle(data);
      toast.success(`Added ${restockQty} units`);
      setShowRestock(false);
      setRestockQty(1);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setRestocking(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    api
      .get<Vehicle>(`/vehicles/${id}`)
      .then(({ data }) => setVehicle(data))
      .catch((err) => {
        toast.error(getApiError(err, "Vehicle not found"));
        navigate({ to: "/dashboard" });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const purchase = async () => {
    if (!vehicle) return;
    setPurchasing(true);
    try {
      const { data } = await api.post<Vehicle>(`/vehicles/${vehicle._id}/purchase`, { quantity: 1 });
      setVehicle(data);
      toast.success("Purchased successfully");
    } catch (err) {
      toast.error(getApiError(err, "Purchase failed"));
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!vehicle) return null;
  const sold = vehicle.quantity === 0;
  const mailto = `mailto:admin@dealership.com?subject=${encodeURIComponent(`Inquiry about ${vehicle.make} ${vehicle.model}`)}`;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to collection
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* gallery */}
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-surface">
              {vehicle.images?.[activeImage] ? (
                <img src={vehicle.images[activeImage]} alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">
                  <CarIcon className="h-16 w-16" />
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 text-xs backdrop-blur">
                {vehicle.category}
              </span>
            </div>
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="mt-3 grid grid-cols-6 gap-2">
                {vehicle.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-video overflow-hidden rounded-lg border transition-colors ${
                      i === activeImage ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* details */}
          <div className="flex flex-col">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{vehicle.make}</div>
            <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">{vehicle.model}</h1>

            <div className="mt-6 flex items-baseline gap-3">
              <div className="font-display text-4xl font-bold text-primary">{formatINR(vehicle.price)}</div>
              <div className="text-sm text-muted-foreground">/ unit</div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Stock" value={String(vehicle.quantity)} />
              <Stat label="Category" value={vehicle.category} />
              <Stat label="Year" value={vehicle.year ? vehicle.year.toString() : "—"} />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-wider">Posted on</span>
              </div>
              <div className="mt-1">{new Date(vehicle.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                disabled={sold || purchasing}
                onClick={purchase}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted-foreground"
              >
                {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                {sold ? "Sold out" : "Purchase"}
              </button>
              <a
                href={mailto}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm hover:bg-surface-2"
              >
                <Mail className="h-4 w-4" /> Contact admin
              </a>
            </div>

            {isAdmin && (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                  <Package className="h-4 w-4" /> Admin controls
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowEdit(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:bg-surface-2"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => setShowRestock(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:bg-surface-2"
                  >
                    <Package className="h-4 w-4" /> Restock
                  </button>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit vehicle</DialogTitle>
          </DialogHeader>
          <VehicleForm
            initial={vehicle}
            onDone={(v) => {
              setVehicle(v);
              setShowEdit(false);
            }}
            onCancel={() => setShowEdit(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Restock dialog */}
      <Dialog
        open={showRestock}
        onOpenChange={(o) => {
          if (!o) {
            setShowRestock(false);
            setRestockQty(1);
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Restock {vehicle.make} {vehicle.model}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Units to add</span>
              <input
                type="number"
                min={1}
                value={restockQty}
                onChange={(e) => setRestockQty(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRestock(false)}
                className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                disabled={restocking}
                onClick={handleRestock}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-60"
              >
                {restocking && <Loader2 className="h-4 w-4 animate-spin" />}
                Restock
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        destructive
        title="Delete this vehicle?"
        description={`${vehicle.make} ${vehicle.model} will be permanently removed from the inventory. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}
