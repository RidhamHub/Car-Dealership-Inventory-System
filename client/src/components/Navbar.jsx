import { Link, useNavigate } from "react-router-dom";
import { Car, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Top navigation bar. Shows different actions depending on whether the user
// is logged in, and highlights admins with a badge.
export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 text-white">
            <Car size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">AutoHub</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="hidden items-center gap-1.5 text-sm text-slate-300 hover:text-white sm:flex">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/profile" className="hidden text-sm text-slate-400 hover:text-white sm:inline">
              Hi, <span className="font-semibold text-white">{user.name}</span>
            </Link>
            {isAdmin && (
              <span className="badge bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30">
                Admin
              </span>
            )}
            <button onClick={handleLogout} className="btn-outline">
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Get started</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
