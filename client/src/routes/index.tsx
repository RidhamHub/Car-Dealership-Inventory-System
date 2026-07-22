import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ArrowRight, ArrowUp, ArrowUpRight, Car, ShieldCheck, Zap, Star, Gauge, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import heroCar from "@/assets/hero-car.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RK AutoHub — Own the luxury. Feel the thrill." },
      { name: "description", content: "Exotic car sales. Curated luxury and performance vehicles, delivered." },
      { property: "og:title", content: "RK AutoHub" },
      { property: "og:description", content: "Own the luxury. Feel the thrill." },
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
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="flex items-center gap-2"
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-display text-lg font-bold">RK</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">RK AUTOHUB</span>
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#stats" className="hover:text-foreground transition-colors">Why us</a>
          <a href="#collection" className="hover:text-foreground transition-colors">Collection</a>
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
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-24">
        <div className="relative flex min-h-[560px] items-center overflow-hidden rounded-3xl border border-border bg-surface md:min-h-[620px]">
          {/* background image */}
          <img
            src={heroCar}
            alt="Yellow luxury sports car with neon light trails"
            width={1600}
            height={1008}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* readability scrims */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
          {/* glow accents */}
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative w-full p-8 md:p-14">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span className="h-px w-8 bg-primary" /> Exotic car collection by RK AutoHub
              </div>
              <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl text-balance">
                Own the luxury.
                <br />
                <span className="text-muted-foreground">Feel the</span> <span className="italic text-primary">thrill.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
                From exotic sports cars to luxury sedans and SUVs, RK AutoHub's collection offers an
                exceptional selection and trusted, personalised service.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)]"
                >
                  Browse cars <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur hover:bg-surface-2"
                >
                  Buy a car
                </Link>
              </div>

              {/* mini stats */}
              <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">
                {[
                  { k: "Curated", v: "Hand-picked fleet" },
                  { k: "Verified", v: "Inspected & insured" },
                  { k: "Secure", v: "Instant checkout" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="font-display text-3xl font-bold text-foreground">{s.k}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* features */}
        <div id="stats" className="mt-24 scroll-mt-24">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Why RK AutoHub</div>
          <h2 className="mt-2 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            Built for the drive, trusted for the details.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Car, title: "Curated fleet", body: "Sedans, SUVs, coupes, trucks & hatchbacks — hand-picked." },
              { icon: Zap, title: "Instant purchase", body: "Buy in seconds with real-time inventory." },
              { icon: ShieldCheck, title: "Verified & insured", body: "Every vehicle inspected. Every transaction secure." },
            ].map((f, i) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.35)]"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-2xl transition-colors group-hover:bg-primary/15" />
                <span className="pointer-events-none absolute right-5 top-3 font-display text-5xl font-bold leading-none text-foreground/[0.05] transition-colors group-hover:text-primary/10">
                  0{i + 1}
                </span>
                <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                <div className="relative mt-5 h-px w-full bg-gradient-to-r from-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
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
            { name: "Sports", icon: Zap, desc: "Track-bred performance and razor-sharp handling for the driver who wants it all." },
            { name: "Luxury Sedan", icon: Star, desc: "First-class comfort and effortless power, refined for the long road ahead." },
            { name: "SUV", icon: Car, desc: "Commanding presence and go-anywhere capability, without the compromise." },
            { name: "Coupe", icon: Gauge, desc: "Sculpted two-doors built purely for the thrill of the drive." },
          ].map((c) => (
            <Link
              to="/login"
              key={c.name}
              className="group relative flex aspect-[4/5] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface to-surface-2/30 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_hsl(var(--primary)/0.4)]"
            >
              <c.icon className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 text-primary/[0.04] transition-all duration-500 group-hover:scale-110 group-hover:text-primary/10" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl transition-colors group-hover:bg-primary/20" />

              <div className="relative flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground/50 transition-colors group-hover:text-primary" />
              </div>

              <div className="relative">
                <h3 className="font-display text-2xl font-bold">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
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
              Join thousands of drivers who trust RK AutoHub for their next unforgettable ride.
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
      <SiteFooter />

      <ScrollToTop />
    </div>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface/80 text-foreground shadow-lg backdrop-blur transition-all hover:border-primary/50 hover:text-primary ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
