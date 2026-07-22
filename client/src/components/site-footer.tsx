import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-display text-lg font-bold">RK</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">RK AUTOHUB</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Own the luxury. Feel the thrill. Curated exotic and premium vehicles, delivered with white-glove service.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram", href: "https://instagram.com/rkautohub" },
                { Icon: Twitter, label: "Twitter", href: "https://twitter.com/rkautohub" },
                { Icon: Facebook, label: "Facebook", href: "https://facebook.com/rkautohub" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary/50 hover:text-primary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Explore">
            <li><a href="/#collection" className="hover:text-foreground">Collection</a></li>
            <li><a href="/#stats" className="hover:text-foreground">Why RK AutoHub</a></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact us</Link></li>
          </FooterCol>

          <FooterCol title="Account">
            <li><Link to="/register" className="hover:text-foreground">Get started</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Log in</Link></li>
          </FooterCol>

          <FooterCol title="Legal">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
            <li><Link to="/cookies" className="hover:text-foreground">Cookies</Link></li>
          </FooterCol>

          <div>
            <div className="text-xs uppercase tracking-wider text-foreground font-semibold">Contact</div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@rkautohub.in</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-6 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} RK AutoHub, Inc. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <span>Made in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-foreground font-semibold">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{children}</ul>
    </div>
  );
}
