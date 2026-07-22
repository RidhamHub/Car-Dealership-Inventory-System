import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MarketingLayout } from "@/components/marketing-layout";
import { Loader2, Mail, MapPin, Phone, Clock, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us — RK AutoHub" },
      { name: "description", content: "Get in touch with the RK AutoHub team about sales, inventory and support." },
      { property: "og:title", content: "Contact us — RK AutoHub" },
      { property: "og:description", content: "Get in touch with the RK AutoHub team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // No contact endpoint yet — simulate a send so the flow works end-to-end.
    setTimeout(() => {
      setSending(false);
      toast.success("Thanks! We'll get back to you within one business day.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 700);
  };

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl text-balance">
          Let's find your next car.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Questions about a vehicle, availability or your order? Send us a note and our team will reach out.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* contact details */}
          <div className="space-y-4">
            {[
              { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
              { icon: Mail, label: "Email", value: "hello@rkautohub.in", href: "mailto:hello@rkautohub.in" },
              { icon: MapPin, label: "Showroom", value: "Mumbai, India" },
              { icon: Clock, label: "Hours", value: "Mon–Sat, 9:00–19:00 IST" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="mt-0.5 block font-medium hover:text-primary">{c.value}</a>
                  ) : (
                    <div className="mt-0.5 font-medium">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* form */}
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your name" />
              </Field>
              <Field label="Email">
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@email.com" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Subject">
                <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} placeholder="What's this about?" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Message">
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className={`${inputCls} resize-none`}
                  placeholder="Tell us how we can help…"
                />
              </Field>
            </div>
            <button
              disabled={sending}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </MarketingLayout>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
