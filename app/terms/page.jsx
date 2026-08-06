import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONFIG } from "@/lib/config";

export const metadata = {
  alternates: { canonical: "/terms" },
  title: `Terms of Use | ${CONFIG.BRAND_NAME}`,
  description: "The terms that apply to browsing this site and submitting a quote or price-list request.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main">
      <div className="wrap" style={{ maxWidth: 760, padding: "28px 20px 60px" }}>
        <h1>Terms of Use</h1>
        <p className="muted" style={{ marginTop: 6 }}>Last updated: 27 July 2026</p>

        <p style={{ marginTop: 22 }}>
          By using this site, you agree to the terms below. If you don't agree, please don't use
          the site or submit a form.
        </p>

        <h2 style={{ marginTop: 28 }}>Who we are</h2>
        <p>
          {CONFIG.BRAND_NAME} is an independent EMEA sales channel for the robot platforms shown on
          this site. We are not the manufacturer of any platform listed here, and we earn fees and
          commissions on referred and brokered sales — that's disclosed openly, as stated on the
          homepage and in our footer.
        </p>

        <h2 style={{ marginTop: 28 }}>Pricing</h2>
        <p>
          All prices shown are manufacturer-indicative and ex-works: they exclude shipping,
          insurance, duties, and taxes for your destination. Nothing on this site is a binding
          offer. A binding, itemized quote is only issued after you submit the quote form and we
          confirm configuration, freight and delivery terms with you directly.
        </p>

        <h2 style={{ marginTop: 28 }}>Quotes and orders</h2>
        <p>
          Submitting the quote form is a request for information, not a purchase or a contract.
          Any resulting order is governed by a separate agreement issued at the time of quoting,
          which will state payment terms, lead time, and delivery obligations.
        </p>

        <h2 style={{ marginTop: 28 }}>No warranty on site content</h2>
        <p>
          We work to keep specifications and pricing accurate and up to date, but manufacturers
          change configurations and pricing without notice. Always confirm final specifications
          and price in your formal quote before committing to an order.
        </p>

        <h2 style={{ marginTop: 28 }}>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {CONFIG.BRAND_NAME} is not liable for indirect,
          incidental, or consequential damages arising from your use of this site. Nothing here
          limits liability that cannot be limited under applicable law.
        </p>

        <h2 style={{ marginTop: 28 }}>Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${CONFIG.CONTACT_EMAIL}`}>{CONFIG.CONTACT_EMAIL}</a>.
        </p>

        <p className="muted" style={{ marginTop: 30, fontSize: 13 }}>
          This page is a plain-language summary and not a substitute for formal legal advice. As{" "}
          {CONFIG.BRAND_NAME} formalizes its business entity, these terms will be reviewed and
          updated accordingly.
        </p>
      </div>
      </main>
      <Footer />
    </>
  );
}
