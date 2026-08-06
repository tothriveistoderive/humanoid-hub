import Link from "next/link";
import { CONFIG } from "@/lib/config";

export default function BuyBox({ r }) {
  return (
    <aside className="buybox" aria-label={`${r.name} pricing and quote`}>
      <span className="from">Indicative price, from</span>
      <div className="p">{r.price.replace("from ", "")}</div>
      <div className="pnote">{r.priceNote}</div>
      <div className="stockline">✓ Ships EMEA-wide · CE docs verified first</div>
      <Link className="btn cta block" href={`/?robot=${r.slug}#quote`}>Request a quote</Link>
      <ul>
        {r.priceboxBullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="contact">
        Prefer email? <a href={`mailto:${CONFIG.CONTACT_EMAIL}?subject=Quote request — ${r.name}`}>{CONFIG.CONTACT_EMAIL}</a>
      </div>
    </aside>
  );
}
