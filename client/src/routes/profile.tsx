import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, getApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { RequireAuth } from "@/components/require-auth";
import { AppHeader } from "@/components/app-header";
import { Loader2, LogOut, Mail, Shield, User as UserIcon, Calendar } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Karzone" },
      { name: "description", content: "Your Karzone account details." },
      { property: "og:title", content: "Profile — Karzone" },
      { property: "og:description", content: "Your Karzone account details." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

type Me = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};

function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Me>("/auth/me")
      .then(({ data }) => {
        setMe(data);
        if (user) setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
      })
      .catch((err) => toast.error(getApiError(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Account</div>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Your profile</h1>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : me ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="flex items-center gap-5 border-b border-border p-8">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
                <span className="font-display text-2xl font-bold">{me.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="font-display text-2xl font-bold">{me.name}</div>
                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs uppercase tracking-wider text-primary">
                  <Shield className="h-3 w-3" /> {me.role}
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-8 md:grid-cols-2">
              <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Name" value={me.name} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={me.email} />
              <InfoRow icon={<Shield className="h-4 w-4" />} label="Role" value={me.role} />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Member since"
                value={new Date(me.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border p-6">
              <div className="text-sm text-muted-foreground">Signed in as <span className="text-foreground font-medium">{me.email}</span></div>
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out");
                  navigate({ to: "/" });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground hover:brightness-110"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1.5 text-base font-medium">{value}</div>
    </div>
  );
}
