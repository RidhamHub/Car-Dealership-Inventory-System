import { useState } from "react";
import { Loader2, PackagePlus } from "lucide-react";

// Asks how many units to add back to stock, then calls onSubmit(amount).
export default function RestockForm({ onSubmit, onClose, saving }) {
  const [amount, setAmount] = useState(1);

  const submit = (e) => {
    e.preventDefault();
    onSubmit(Number(amount));
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Units to add</label>
        <input
          className="input"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn-outline flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <PackagePlus size={16} />}
          Restock
        </button>
      </div>
    </form>
  );
}
