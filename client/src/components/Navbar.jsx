import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, Home, Plus, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// Dark, rounded top navigation bar with centered icon pills and a user area.
export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Center nav items.
  const items = [
    { label: "Home", icon: <Home size={16} />, to: "/" },
    { label: "Cars", icon: <Car size={16} />, to: "/dashboard" },
  ];

  const pillClass = (active) =>
    `relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
      active ? "bg-white text-night shadow" : "text-slate-300 hover:text-white"
    }`;

  return (
    <header className="bg-night rounded-b-[28px]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 text-white">
            <Car size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">AutoHub</span>
        </Link>

        {/* Center nav (only when logged in) */}
        {user && (
          <div className="hidden items-center gap-1 md:flex">
            {items.map((it) => (
              <Link key={it.label} to={it.to} className={pillClass(pathname === it.to)}>
                {it.icon} {it.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              title="Add / manage vehicles"
              className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600"
            >
              <Plus size={20} />
            </Link>
            <button onClick={() => toast("No new notifications")} className="text-slate-300 transition hover:text-white">
              <Bell size={20} />
            </button>
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-2 transition hover:bg-white/15"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-400 text-xs font-bold text-white">
                {initials(user.name)}
              </span>
              <ChevronDown size={16} className="text-slate-300" />
            </Link>
            <button onClick={handleLogout} className="hidden text-sm text-slate-300 hover:text-white sm:block">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-night hover:bg-slate-100">
              Get started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
