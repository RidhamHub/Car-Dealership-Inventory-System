import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-lg font-bold">RK</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">RK AUTOHUB</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="/#stats" className="transition-colors hover:text-foreground">Why us</a>
            <a href="/#collection" className="transition-colors hover:text-foreground">Collection</a>
            <Link to="/contact" className="transition-colors hover:text-foreground">Contact</Link>
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

      <main>{children}</main>

      <SiteFooter />
    </div>
  );
}

/** Shared shell for legal/policy pages: title, "last updated", and prose sections. */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Legal</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>
        {intro && <p className="mt-6 text-base leading-relaxed text-muted-foreground">{intro}</p>}
        <div className="mt-10 space-y-8">{children}</div>
      </div>
    </MarketingLayout>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-foreground">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
