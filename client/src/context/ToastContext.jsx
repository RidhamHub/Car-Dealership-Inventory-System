import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

// Tiny toast system: call toast("message") or toast("oops", "error").
const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, type }]);
    // Auto-dismiss after 3 seconds.
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              t.type === "error"
                ? "border-red-500/30 bg-red-500/15 text-red-200"
                : "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
            }`}
          >
            {t.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
