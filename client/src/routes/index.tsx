import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Car, ShieldCheck, Zap, Star, Gauge, Sparkles, Phone, Mail, MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karzone — Rent the luxury. Own the thrill." },
      { name: "description", content: "Exotic car rentals and sales. Curated luxury and performance vehicles, delivered." },
      { property: "og:title", content: "Karzone" },
      { property: "og:description", content: "Rent the luxury. Own the thrill." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { token, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && token) navigate({ to: "/dashboard" });
  }, [ready, token, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-display text-lg font-bold">K</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">KARZONE</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#collection" className="hover:text-foreground transition-colors">Collection</a>
          <a href="#stats" className="hover:text-foreground transition-colors">Why us</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-24">
        <div className="rounded-3xl border border-border bg-surface p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span className="h-px w-8 bg-primary" /> Exotic car collection by Karzone
              </div>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl text-balance">
                Rent the luxury.
                <br />
                <span className="text-muted-foreground">Own the</span> <span className="italic text-primary">thrill.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
                From exotic sports cars to luxury sedans and SUVs, Karzone's collection offers an
                exceptional selection and trusted, personalised service.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)]"
                >
                  Rent a car <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-2"
                >
                  Buy a car
                </Link>
              </div>

              {/* mini stats */}
              <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">
                {[
                  { k: "500+", v: "Vehicles" },
                  { k: "24/7", v: "Concierge" },
                  { k: "4.9★", v: "Rated" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="font-display text-3xl font-bold text-foreground">{s.k}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={heroCar}
                  alt="Yellow luxury sports car with neon light trails"
                  width={1600}
                  height={1008}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-primary">Featured</div>
                    <div className="mt-1 font-display text-2xl font-bold">Aventador SVJ</div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="rounded-lg bg-background/60 px-2.5 py-1.5 backdrop-blur">
                      <div className="text-primary font-semibold">350</div>
                      <div className="text-muted-foreground">km/h</div>
                    </div>
                    <div className="rounded-lg bg-background/60 px-2.5 py-1.5 backdrop-blur">
                      <div className="text-primary font-semibold">2024</div>
                      <div className="text-muted-foreground">year</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* features */}
        <div id="stats" className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Car, title: "Curated fleet", body: "Sedans, SUVs, coupes, trucks & hatchbacks — hand-picked." },
            { icon: Zap, title: "Instant booking", body: "Reserve or purchase in seconds. Real-time inventory." },
            { icon: ShieldCheck, title: "Verified & insured", body: "Every vehicle inspected. Every transaction secure." },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/40 hover:-translate-y-1">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Categories</div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Explore the collection</h2>
          </div>
          <Link to="/register" className="hidden md:inline-flex items-center gap-2 text-sm text-primary hover:underline">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Sports", icon: Zap, count: "120+ cars" },
            { name: "Luxury Sedan", icon: Star, count: "80+ cars" },
            { name: "SUV", icon: Car, count: "95+ cars" },
            { name: "Coupe", icon: Gauge, count: "60+ cars" },
          ].map((c) => (
            <div key={c.name} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 aspect-[4/5] flex flex-col justify-between hover:border-primary/40 transition-all cursor-pointer">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                <c.icon className="h-6 w-6" />
              </div>
              <div className="relative">
                <h3 className="font-display text-2xl font-bold">{c.name}</h3>
                <div className="mt-1 text-sm text-muted-foreground">{c.count}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-primary/10 p-10 md:p-16 text-center">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.4),transparent_50%)]" />
          <div className="relative">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-6xl text-balance">
              Ready to feel the road?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of drivers who trust Karzone for their next unforgettable ride.
            </p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-2 backdrop-blur"
              >
                I already have one
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-display text-lg font-bold">K</span>
                </div>
                <span className="font-display text-xl font-bold tracking-tight">KARZONE</span>
              </div>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Rent the luxury. Own the thrill. Curated exotic and premium vehicles, delivered with white-glove service.
              </p>
              <div className="mt-6 flex gap-3">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary/50 hover:text-primary transition-colors">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-foreground font-semibold">Explore</div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#collection" className="hover:text-foreground">Collection</a></li>
                <li><a href="#stats" className="hover:text-foreground">Why Karzone</a></li>
                <li><Link to="/register" className="hover:text-foreground">Get started</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Log in</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-foreground font-semibold">Contact</div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@karzone.in</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Mumbai, India</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
            <div>© {new Date().getFullYear()} Karzone, Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
