import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Diagram from "@/components/Diagram";
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
  const quoteHref = `/?robot=${r.slug}#quote`;
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
        <Link href="/">Lineup</Link> / {r.maker.replace(" Robotics", "").replace(" Dynamics", "")} / {r.name.split(" ").slice(-1)}
      </div>

      <section className="product-head">
        <div className="wrap grid">
          <div>
            <span className="kicker">{r.kicker}</span>
            <h1>{r.name}</h1>
            <p className="lede" style={{ marginTop: 20 }}>{r.lede}</p>
            <div className="usecases">
              {r.useCases.map(([t, body]) => (
                <div className="usecase" key={t}><b>{t}</b>{body}</div>
              ))}
            </div>
          </div>
          <div className="pricebox">
            <div className="p">{r.price}</div>
            <div className="note">{r.priceNote}</div>
            <Link className="btn accent" href={quoteHref}>Request a {r.name.split(" ").slice(-1)} quote</Link>
            <ul>
              {r.priceboxBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="wrap spec-grid">
          <div className="diagram">
            <Diagram d={r.diagram} name={r.name} />
            <div className="cap"><span>{r.name} — side elevation</span><span>schematic</span></div>
          </div>
          <div>
            <span className="kicker">Specifications</span>
            <h2>Datasheet</h2>
            <table className="specs" style={{ marginTop: 24 }}>
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
        </div>
      </section>

      <section className="rule">
        <div className="wrap">
          <span className="kicker">Buying in EMEA</span>
          <h2 style={{ marginBottom: 24 }}>{r.name.split(" ").slice(-1)} — common questions</h2>
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

      <Footer />
    </>
  );
}
