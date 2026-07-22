import { Link } from "react-router-dom";
import { ShieldCheck, Search, Zap } from "lucide-react";

// Landing / hero page. Sells the product and points users to sign up.
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="badge bg-brand-500/15 text-brand-400 ring-1 ring-brand-400/30">
            Premium car marketplace
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Find your next car,{" "}
            <span className="bg-gradient-to-r from-brand-400 to-cyan-300 bg-clip-text text-transparent">
              the smart way
            </span>
          </h1>
          <p className="mt-4 max-w-md text-slate-400">
            Browse live inventory, filter by make, model and budget, and buy in
            one click. Fast, secure, and always up to date.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Browse inventory
            </Link>
            <Link to="/login" className="btn-outline px-6 py-3 text-base">
              I have an account
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500/20 to-transparent blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
            alt="Sports car"
            className="relative w-full rounded-3xl border border-white/10 object-cover shadow-2xl"
          />
        </div>
      </section>

      {/* Feature highlights */}
      <section className="grid gap-4 pb-20 sm:grid-cols-3">
        <Feature icon={<Search size={20} />} title="Powerful search">
          Filter by make, model, category and price range instantly.
        </Feature>
        <Feature icon={<Zap size={20} />} title="One-click purchase">
          Buy available cars in seconds; stock updates in real time.
        </Feature>
        <Feature icon={<ShieldCheck size={20} />} title="Secure accounts">
          JWT-based login keeps your account and actions protected.
        </Feature>
      </section>
    </main>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div className="card p-5">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{children}</p>
    </div>
  );
}
