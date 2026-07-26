import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogGrid from "@/components/CatalogGrid";
import { QuoteForm, PricelistForm } from "@/components/QuoteForm";

export default function Home() {
  return (
    <>
      <Header />

      <section className="hero">
        <div className="wrap">
          <h1>Humanoid robots, quoted and delivered in EMEA.</h1>
          <p className="lede">
            Platforms from Ironvale Robotics, Halcyon Robotics and Vantage Dynamics — published specs,
            visible prices, and a formal quote within one business day. Browse like a store,
            buy like an institution.
          </p>
          <div className="statstrip">
            <span><b>5</b> platforms</span>
            <span><b>$5,000 – $54,000</b> indicative range</span>
            <span><b>3</b> manufacturers featured</span>
            <span className="ok">CE-documented EU delivery</span>
            <span><b>1 business day</b> to a formal quote</span>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <CatalogGrid />
          <p className="muted" style={{ fontFamily: "var(--mono)", fontSize: 12, marginTop: 12 }}>
            Prices are manufacturer-indicative, ex-works, before shipping and duties. Your formal
            quote itemizes configuration, freight and your destination country — no surprises at customs.
          </p>
        </div>
      </section>

      <section id="process" style={{ background: "var(--bg-subtle)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>How buying works</h2>
              <p className="sub">No overseas procurement guesswork — we broker, you receive.</p>
            </div>
          </div>
          <div className="tiles">
            <div className="tile">
              <span className="num">STEP 01 — INQUIRY</span>
              <h3>Tell us the use case</h3>
              <p>Research, education, a pilot line, an exhibition. We confirm which platform fits and the configuration you actually need.</p>
            </div>
            <div className="tile">
              <span className="num">STEP 02 — QUOTE</span>
              <h3>Formal quote in one business day</h3>
              <p>Price, lead time, shipping to your country, and CE / compliance documentation status for EU destinations.</p>
            </div>
            <div className="tile">
              <span className="num">STEP 03 — DELIVERY</span>
              <h3>We manage the order through</h3>
              <p>Payment terms via our entity, factory coordination, freight and customs paperwork — through to delivery and onboarding.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="band" id="pricelist">
        <div className="wrap grid">
          <div>
            <h2>The full EMEA price list, in your inbox</h2>
            <p>
              Manufacturers rarely publish prices. We do. Current indicative pricing for every
              platform we represent — models and configurations, sent personally within one business day to EU
              and Gulf destinations.
            </p>
          </div>
          <PricelistForm />
        </div>
      </div>

      <section id="quote">
        <div className="wrap quote-wrap">
          <div className="quote-side">
            <h2>Request a quote</h2>
            <p className="lede" style={{ fontSize: 15, marginTop: 8 }}>
              One form, one business day, a formal itemized quote.
            </p>
            <div style={{ marginTop: 14 }}>
              <div className="point"><span className="ok">✓</span><span><b>Universities &amp; public institutions:</b> POs, vendor forms and approval timelines are fine.</span></div>
              <div className="point"><span className="ok">✓</span><span><b>CE documentation</b> verified before any EU delivery is promised.</span></div>
              <div className="point"><span className="ok">✓</span><span><b>Not sure which platform?</b> Say so — right-sizing first orders is the job.</span></div>
              <div className="point"><span className="ok">✓</span><span><b>Openly commercial:</b> we represent these brands and earn on brokered sales.</span></div>
            </div>
          </div>
          <QuoteForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
