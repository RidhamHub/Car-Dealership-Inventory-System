import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { User as UserIcon, ShieldCheck } from "lucide-react";

export function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/dashboard", label: "Vehicles" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="font-display text-lg font-bold">K</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">KARZONE</span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                pathname === n.to
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user?.role === "admin" && (
            <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3 w-3" /> Admin
            </span>
          )}
          {user && (
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium">{user.name}</div>
            </div>
          )}
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-foreground hover:bg-surface"
            aria-label="Profile"
          >
            <UserIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
