import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/marketing-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — RK AutoHub" },
      { name: "description", content: "The terms that govern your use of the RK AutoHub platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 2026"
      intro="By creating an account or using RK AutoHub, you agree to these terms. Please read them carefully."
    >
      <LegalSection heading="Using the platform">
        <p>
          RK AutoHub provides an online catalogue for browsing and purchasing vehicles. You agree to use the
          platform lawfully and to provide accurate information when you register or place an order.
        </p>
      </LegalSection>
      <LegalSection heading="Accounts">
        <p>
          You are responsible for keeping your login credentials secure and for any activity that happens under
          your account. Notify us immediately if you suspect unauthorised access.
        </p>
      </LegalSection>
      <LegalSection heading="Purchases & inventory">
        <p>
          Vehicle availability and pricing are shown in real time but may change. A purchase reduces stock
          immediately; if a listed vehicle becomes unavailable we will contact you to arrange an alternative or
          a refund.
        </p>
      </LegalSection>
      <LegalSection heading="Limitation of liability">
        <p>
          The platform is provided "as is". To the fullest extent permitted by law, RK AutoHub is not liable for
          indirect or incidental damages arising from your use of the service.
        </p>
      </LegalSection>
      <LegalSection heading="Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the platform after changes take effect
          means you accept the revised terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
