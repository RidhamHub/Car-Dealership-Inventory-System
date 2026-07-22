import { Link } from "react-router-dom";
import { Car } from "lucide-react";

// Top navigation bar. Auth-aware links (profile / logout) are added later
// once the auth context exists.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 text-white">
            <Car size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">AutoHub</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </nav>
    </header>
  );
}
