import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Shield, Calendar, LogOut, User as UserIcon } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

// Turn a name into up to two initials for the avatar.
const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);

  // Fetch the full profile (includes the join date) from the API.
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setProfile(data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-extrabold text-white">My Profile</h1>

      <div className="card p-8">
        {/* Header: avatar + name */}
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 text-2xl font-extrabold text-white">
            {initials(profile?.name) || <UserIcon />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
            <span
              className={`badge mt-1 ${
                isAdmin
                  ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30"
                  : "bg-brand-500/15 text-brand-400 ring-1 ring-brand-400/30"
              }`}
            >
              {isAdmin ? "Administrator" : "Customer"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
          <Row icon={<Mail size={18} />} label="Email">{profile?.email}</Row>
          <Row icon={<Shield size={18} />} label="Role">{profile?.role}</Row>
          <Row icon={<Calendar size={18} />} label="Member since">{joined}</Row>
        </div>

        <button onClick={handleLogout} className="btn-danger mt-8 w-full">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </main>
  );
}

function Row({ icon, label, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-brand-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-200">{children}</p>
      </div>
    </div>
  );
}
