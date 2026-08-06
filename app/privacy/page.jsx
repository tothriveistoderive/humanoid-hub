import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONFIG } from "@/lib/config";

export const metadata = {
  title: `Privacy Policy | ${CONFIG.BRAND_NAME}`,
  description: "How Humanoid Hub collects, stores and uses the information submitted through our quote and price-list forms.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main">
      <div className="wrap" style={{ maxWidth: 760, padding: "28px 20px 60px" }}>
        <h1>Privacy Policy</h1>
        <p className="muted" style={{ marginTop: 6 }}>Last updated: 6 August 2026</p>

        <p style={{ marginTop: 22 }}>
          {CONFIG.BRAND_NAME} ("we", "us") operates this site as an independent EMEA sales
          channel for the robot platforms listed on it. This page explains what information we
          collect when you use the site, why we collect it, and how you can control it.
        </p>

        <h2 style={{ marginTop: 28 }}>Who is responsible for your data</h2>
        <p>
          The data controller for information submitted through this site is{" "}
          <b>{CONFIG.LEGAL_ENTITY}</b>, operating as {CONFIG.BRAND_NAME}, based in{" "}
          {CONFIG.LEGAL_COUNTRY}. You can reach us at{" "}
          <a href={`mailto:${CONFIG.CONTACT_EMAIL}`}>{CONFIG.CONTACT_EMAIL}</a> for any question
          about how your information is handled.
        </p>

        <h2 style={{ marginTop: 28 }}>What we collect</h2>
        <p>
          We only collect information you actively submit through the <b>Request a quote</b> and{" "}
          <b>Send the price list</b> forms: name, organization, work email, country, platform of
          interest, budget range, use case, and any message you add. The price-list form only
          collects an email address.
        </p>
        <p style={{ marginTop: 10 }}>
          We do not use cookies, analytics, or advertising trackers on this site. We do not
          collect any information passively — nothing is recorded unless you submit a form.
        </p>

        <h2 style={{ marginTop: 28 }}>Why we're allowed to process it</h2>
        <p>
          When you ask us for a quote or a price list, we process your details to take steps at
          your request prior to entering into a contract (GDPR Article 6(1)(b)). Where we follow
          up about a related platform or a later enquiry, we rely on our legitimate interest in
          responding to business enquiries (Article 6(1)(f)). You can object to that follow-up at
          any time by replying to any message or emailing us.
        </p>

        <h2 style={{ marginTop: 28 }}>How it's stored</h2>
        <p>
          Form submissions are stored in a Supabase (PostgreSQL) database hosted in{" "}
          {CONFIG.DB_REGION}. Access is restricted by row-level security: the public key embedded
          in this site can only add new entries, and cannot read, change or delete existing ones.
          Reading submissions requires separate authenticated access held only by us.
        </p>

        <h2 style={{ marginTop: 28 }}>Where your data goes</h2>
        <p>
          We operate from {CONFIG.LEGAL_COUNTRY}, so information you submit is accessed from
          outside the European Economic Area. Israel is recognised by the European Commission as
          providing an adequate level of data protection, so no additional transfer safeguards are
          required. Where preparing your quote requires it, we share the minimum necessary details
          with the manufacturer of the platform you asked about. We do not sell your information
          or share it with anyone else.
        </p>

        <h2 style={{ marginTop: 28 }}>How we use it</h2>
        <p>
          We use your information solely to prepare and send your formal quote or price list, and
          to follow up about your inquiry.
        </p>

        <h2 style={{ marginTop: 28 }}>How long we keep it</h2>
        <p>
          We keep quote and price-list submissions for <b>24 months</b> from your last contact
          with us, after which they are deleted. If you ask us to delete your information sooner,
          we will.
        </p>

        <h2 style={{ marginTop: 28 }}>Your rights</h2>
        <p>
          You can ask us to access, correct, delete, or export any information you've submitted,
          to restrict or object to how we use it, at any time by emailing{" "}
          <a href={`mailto:${CONFIG.CONTACT_EMAIL}`}>{CONFIG.CONTACT_EMAIL}</a>. If you are in the
          EU or UK these are your rights under GDPR, and{" "}
          <b>we will respond within one month</b>. There is no charge.
        </p>
        <p style={{ marginTop: 10 }}>
          If you believe we've handled your information improperly, you have the right to lodge a
          complaint with your national data protection authority — in the EU, the supervisory
          authority in your country of residence; in the UK, the Information Commissioner's
          Office.
        </p>

        <h2 style={{ marginTop: 28 }}>Contact</h2>
        <p>
          Questions about this policy: <a href={`mailto:${CONFIG.CONTACT_EMAIL}`}>{CONFIG.CONTACT_EMAIL}</a>.
        </p>

        <p className="muted" style={{ marginTop: 30, fontSize: 13 }}>
          This page is a plain-language summary provided for transparency and is not a substitute
          for formal legal advice. As {CONFIG.BRAND_NAME} formalizes its business entity, this
          policy will be reviewed and updated accordingly.
        </p>
      </div>
      </main>
      <Footer />
    </>
  );
}
