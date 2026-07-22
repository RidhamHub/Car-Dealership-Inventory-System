import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api, getApiError } from "@/lib/api";
import { CATEGORIES, fileToCompressedDataUrl, type Vehicle } from "@/lib/utils-app";
import { Loader2, Upload, X } from "lucide-react";

type Props = {
  initial?: Vehicle | null;
  onDone: (v: Vehicle) => void;
  onCancel: () => void;
};

export function VehicleForm({ initial, onDone, onCancel }: Props) {
  const [make, setMake] = useState(initial?.make ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Sedan");
  const [year, setYear] = useState<number | "">(initial?.year ?? "");
  const [price, setPrice] = useState<number | "">(initial?.price ?? "");
  const [quantity, setQuantity] = useState<number | "">(initial?.quantity ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setMake(initial.make);
      setModel(initial.model);
      setCategory(initial.category);
      setYear(initial.year ?? "");
      setPrice(initial.price);
      setQuantity(initial.quantity);
      setImages(initial.images);
    }
  }, [initial]);

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = 6 - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    try {
      const converted = await Promise.all(toProcess.map((f) => fileToCompressedDataUrl(f)));
      setImages((cur) => [...cur, ...converted].slice(0, 6));
    } catch {
      toast.error("Failed to process images");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price === "" || quantity === "") {
      toast.error("Price and quantity required");
      return;
    }
    if (year === "") {
      toast.error("Year is required");
      return;
    }
    setLoading(true);
    try {
      const payload = { make, model, category, year: Number(year), price: Number(price), quantity: Number(quantity), images };
      const { data } = initial
        ? await api.put<Vehicle>(`/vehicles/${initial._id}`, payload)
        : await api.post<Vehicle>("/vehicles", payload);
      toast.success(initial ? "Vehicle updated" : "Vehicle added");
      onDone(data);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Make">
          <input required value={make} onChange={(e) => setMake(e.target.value)} className={inputCls} />
        </FormField>
        <FormField label="Model">
          <input required value={model} onChange={(e) => setModel(e.target.value)} className={inputCls} />
        </FormField>
        <FormField label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Year">
          <input
            required
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            placeholder="e.g. 2022"
            value={year}
            onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
            className={inputCls}
          />
        </FormField>
        <FormField label="Price (INR)">
          <input required type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
        </FormField>
        <FormField label="Quantity in stock">
          <input required type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
        </FormField>
      </div>

      <FormField label={`Photos (${images.length}/6)`}>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-surface">
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((c) => c.filter((_, ix) => ix !== i))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 6 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="grid aspect-video place-items-center rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Upload className="h-5 w-5" />
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-5 py-2 text-sm hover:bg-surface-2">Cancel</button>
        <button disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Save changes" : "Add vehicle"}
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
