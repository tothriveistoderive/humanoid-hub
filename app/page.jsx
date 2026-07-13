import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LineupRow from "@/components/LineupRow";
import { QuoteForm, PricelistForm } from "@/components/QuoteForm";
import { ROBOTS } from "@/lib/robots";

export default function Home() {
  return (
    <>
      <Header />

      <section className="hero">
        <div className="wrap grid">
          <div>
            <span className="kicker">EMEA sales channel — humanoid robotics</span>
            <h1>Humanoid robots from China&apos;s leading labs. Quoted, shipped, and supported in EMEA.</h1>
            <p className="lede" style={{ marginTop: 24 }}>
              We represent select Chinese humanoid manufacturers across Europe, the Middle East
              and Africa. Published specs, indicative prices, and a formal quote within one
              business day — without navigating overseas procurement yourself.
            </p>
            <div className="cta-row">
              <a className="btn accent" href="#quote">Request a quote</a>
              <a className="btn ghost" href="#lineup">View the lineup</a>
            </div>
          </div>
          <div className="facts">
            <div><b>5 platforms</b> — from $5,000 to $54,000</div>
            <div><b>3 manufacturers</b> — EngineAI · Booster · LimX</div>
            <div><b>1 business day</b> — from inquiry to formal quote</div>
            <div><b>CE documentation</b> — verified before every EU delivery</div>
          </div>
        </div>
      </section>

      <section className="rule" id="lineup">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="kicker">Current lineup</span>
              <h2>Five platforms, one inquiry away</h2>
            </div>
            <a className="btn ghost" href="#quote">Get pricing for your use case</a>
          </div>
          <table className="lineup">
            <thead>
              <tr><th>Model</th><th className="hide-m">Class</th><th className="hide-m">Best for</th><th>Indicative price</th></tr>
            </thead>
            <tbody>
              {ROBOTS.map((r) => (
                <LineupRow r={r} key={r.slug} />
              ))}
            </tbody>
          </table>
          <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-faint)", marginTop: 12 }}>
            Prices are manufacturer-indicative, ex-works, before shipping and duties. Formal
            quotes reflect configuration, freight and your destination country.
          </p>
        </div>
      </section>

      <section className="rule" id="process">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="kicker">How it works</span>
              <h2>Procurement without the overseas guesswork</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <span className="num">01 — Inquiry</span>
              <h3>Tell us the use case</h3>
              <p>Research, education, a pilot line, an exhibition. We confirm which platform fits and what configuration you actually need.</p>
            </div>
            <div className="step">
              <span className="num">02 — Quote</span>
              <h3>Formal quote in one business day</h3>
              <p>Price, lead time, shipping to your country, and the CE / compliance documentation status for EU destinations.</p>
            </div>
            <div className="step">
              <span className="num">03 — Delivery</span>
              <h3>We manage the order through</h3>
              <p>Payment terms via our entity, factory coordination, freight and customs paperwork — through to delivery and onboarding support.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="band" id="pricelist">
        <div className="wrap grid">
          <div>
            <span className="kicker" style={{ color: "#6d727c" }}>Price list</span>
            <h2>The full EMEA price list, in your inbox</h2>
            <p>
              Manufacturers rarely publish prices. We do. Current indicative pricing for every
              platform we represent — models, configurations, and typical shipping ranges to EU
              and Gulf destinations.
            </p>
          </div>
          <PricelistForm />
        </div>
      </div>

      <section id="quote">
        <div className="wrap quote-wrap">
          <div>
            <span className="kicker">Request a quote</span>
            <h2>Tell us what you&apos;re building</h2>
            <p className="lede" style={{ fontSize: 16, marginTop: 16 }}>
              One form, one business day. We come back with a formal quote — price,
              configuration, lead time, and delivery to your country.
            </p>
            <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--ink-faint)", marginTop: 24 }}>
              Universities and public institutions: we&apos;re used to procurement paperwork.
              Ask for what you need.
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
