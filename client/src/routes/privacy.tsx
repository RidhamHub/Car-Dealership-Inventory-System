import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/marketing-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — RK AutoHub" },
      { name: "description", content: "How RK AutoHub collects, uses and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      intro="Your privacy matters to us. This policy explains what information RK AutoHub collects, why we collect it, and the choices you have."
    >
      <LegalSection heading="Information we collect">
        <p>
          When you create an account we collect your name and email address. When you browse or purchase
          vehicles we record the details of those transactions. We never ask for full payment card numbers on
          this platform.
        </p>
      </LegalSection>
      <LegalSection heading="How we use your information">
        <p>
          We use your information to operate your account, process purchases, keep inventory accurate, and
          respond to your enquiries. We may send you service-related messages about orders you have made.
        </p>
      </LegalSection>
      <LegalSection heading="How we protect it">
        <p>
          Passwords are stored using industry-standard hashing and are never visible to our staff. Access to
          customer data is limited to authorised administrators who need it to run the dealership.
        </p>
      </LegalSection>
      <LegalSection heading="Your rights">
        <p>
          You can access, update or delete your account information at any time from your profile page. To
          request a full export or permanent deletion of your data, contact us using the details below.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>Questions about this policy? Email us at hello@rkautohub.in.</p>
      </LegalSection>
    </LegalPage>
  );
}
