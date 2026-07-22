import { useAuth } from "../context/AuthContext";

// Placeholder dashboard. The vehicle grid, search and purchase UI are added
// in the next commit.
export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white">
        Welcome, {user?.name} 👋
      </h1>
      <p className="mt-2 text-slate-400">
        You are logged in as{" "}
        <span className="font-semibold text-brand-400">{isAdmin ? "an admin" : "a customer"}</span>.
        The vehicle inventory will appear here.
      </p>
    </main>
  );
}
