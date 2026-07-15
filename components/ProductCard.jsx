import Link from "next/link";
import Diagram from "@/components/Diagram";
import Badge from "@/components/Badge";
import Rating from "@/components/Rating";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function ProductCard({ r }) {
  return (
    <article className="pcard">
      <div className="shot">
        {r.image ? (
          <img src={`${BASE}${r.image}`} alt={`${r.name} product photo`} />
        ) : (
          <Diagram d={r.diagram} name={r.name} />
        )}
      </div>
      <div className="body">
        <div className="title">
          <Link href={`/robots/${r.slug}/`}>{r.name}</Link>
        </div>
        <div className="maker">{r.maker}</div>
        <div className="cls">{r.cls}</div>
        <div className="pricerow">
          <span className="from">from</span>
          <span className="p">{r.price.replace("from ", "")}</span>
        </div>
        <div className="pnote">ex-works · confirmed on quote</div>
        <div className="badges">
          {r.badges.map((b) => (
            <Badge key={b} tone={b.startsWith("CE") ? "ok" : undefined}>{b}</Badge>
          ))}
          {r.chips.slice(0, 2).map((c) => (
            <Badge key={c} tone="chip">{c}</Badge>
          ))}
        </div>
        <Rating rating={r.rating} count={r.reviewCount} />
        <div className="proof"><b>{r.proof}</b></div>
        <div className="cta-row">
          <Link className="btn cta block" href={`/?robot=${r.slug}#quote`}>Request a quote</Link>
        </div>
      </div>
    </article>
  );
}
