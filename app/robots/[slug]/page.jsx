import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import BuyBox from "@/components/BuyBox";
import ProductCard from "@/components/ProductCard";
import Badge from "@/components/Badge";
import Rating from "@/components/Rating";
import { ROBOTS, getRobot } from "@/lib/robots";

export function generateStaticParams() {
  return ROBOTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = getRobot(slug);
  return { title: r.meta.title, description: r.meta.description };
}

export default async function RobotPage({ params }) {
  const { slug } = await params;
  const r = getRobot(slug);
  const related = ROBOTS.filter((x) => x.slug !== r.slug);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: r.name,
    brand: { "@type": "Brand", name: r.maker },
    description: r.meta.ldDescription,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: r.priceNum,
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Header />

      <div className="wrap crumbs">
        <Link href="/">All platforms</Link> › <Link href={`/?q=${encodeURIComponent(r.maker)}#catalog`}>{r.maker}</Link> › {r.name}
      </div>

      <div className="wrap pdp-title">
        <Link className="maker" href={`/?q=${encodeURIComponent(r.maker)}#catalog`}>{r.maker}</Link>
        <h1>{r.name}</h1>
        <div className="subline">
          <Rating rating={r.rating} count={r.reviewCount} />
          {r.badges.map((b) => (
            <Badge key={b} tone={b.startsWith("CE") ? "ok" : undefined}>{b}</Badge>
          ))}
          {r.chips.map((c) => (
            <Badge key={c} tone="chip">{c}</Badge>
          ))}
        </div>
      </div>

      <div className="wrap pdp">
        <div>
          <ProductGallery r={r} />
          <p className="lede" style={{ fontSize: 15.5, color: "var(--ink-soft)", marginTop: 18, maxWidth: "70ch" }}>{r.lede}</p>
          <ul className="benefits">
            <li><b>{r.proof}.</b></li>
            {r.useCases.map(([t, body]) => (
              <li key={t}><b>{t}:</b> {body}</li>
            ))}
          </ul>
        </div>
        <BuyBox r={r} />
      </div>

      <section style={{ paddingTop: 6 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Technical specifications</h2>
          </div>
          <table className="specs">
            <tbody>
              {r.specs.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className={k === "Indicative price" ? "mono" : undefined}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ paddingTop: 6 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Buying the {r.name.split(" ").slice(-1)} in EMEA</h2>
          </div>
          <div className="faq">
            {r.faq.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="related">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>Related platforms</h2>
              <p className="sub">Same channel, same one-day quote — different budgets and jobs.</p>
            </div>
            <Link className="btn" href="/#catalog">View all</Link>
          </div>
          <div className="grid-products">
            {related.map((x) => (
              <ProductCard r={x} key={x.slug} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
