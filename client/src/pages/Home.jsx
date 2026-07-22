import { Link } from "react-router-dom";
import { ShieldCheck, Search, Zap, ArrowRight } from "lucide-react";

// Landing / hero page. Sells the product and points users to sign up.
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="badge bg-brand-50 text-brand-700">Premium car marketplace</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Drive the car of{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              your dreams
            </span>
          </h1>
          <p className="mt-4 max-w-md text-slate-500">
            Browse live inventory, filter by make, model and budget, and buy in
            one click. Fast, secure, and always up to date.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Browse inventory <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-outline px-6 py-3 text-base">
              I have an account
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-200/50 to-transparent blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
            alt="Sports car"
            className="relative w-full rounded-3xl border border-slate-200 object-cover shadow-xl"
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
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{children}</p>
    </div>
  );
}
