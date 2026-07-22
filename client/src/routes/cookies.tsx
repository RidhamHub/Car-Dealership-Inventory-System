import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/marketing-layout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — RK AutoHub" },
      { name: "description", content: "How RK AutoHub uses cookies and local storage." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="July 2026"
      intro="This policy explains how RK AutoHub uses cookies and similar technologies to keep the platform working."
    >
      <LegalSection heading="What we use">
        <p>
          We use your browser's local storage to keep you signed in between visits. This stores a secure session
          token and your basic profile so you don't have to log in on every page.
        </p>
      </LegalSection>
      <LegalSection heading="Essential only">
        <p>
          We do not use advertising or third-party tracking cookies. The storage we rely on is strictly necessary
          for the site to function.
        </p>
      </LegalSection>
      <LegalSection heading="Managing storage">
        <p>
          You can clear this data at any time by logging out or clearing your browser's storage for this site.
          Doing so will simply sign you out.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
