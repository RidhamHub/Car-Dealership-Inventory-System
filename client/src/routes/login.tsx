import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { getApiError } from "@/lib/api";
import { ArrowRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Karzone" },
      { name: "description", content: "Sign in to your Karzone account." },
      { property: "og:title", content: "Log in — Karzone" },
      { property: "og:description", content: "Sign in to your Karzone account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, token, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && token) navigate({ to: "/dashboard" });
  }, [ready, token, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(getApiError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell title="Welcome back" subtitle="Log in to browse the collection.">
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} required />
      <Field label="Password" type="password" value={password} onChange={setPassword} required />
      <button
        disabled={loading}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Log in <ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="pt-2 text-center text-sm text-muted-foreground">
        No account? <Link to="/register" className="text-primary hover:underline">Create one</Link>
      </p>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-background to-background" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-lg font-bold">K</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">KARZONE</span>
          </Link>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">001 / Exotic Collection</div>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance">
              Rent the luxury. <span className="italic text-muted-foreground">Own the thrill.</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Every tap of the accelerator is a gut punch. A talisman against boredom.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="font-display font-bold">K</span>
            </div>
            <span className="font-display font-bold tracking-tight">KARZONE</span>
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
      />
    </label>
  );
}
