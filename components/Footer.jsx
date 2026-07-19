import Link from "next/link";
import { ROBOTS } from "@/lib/robots";
import { CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="site">
      <div className="cols">
        <div>
          <h4>Platforms</h4>
          {ROBOTS.map((r) => (
            <Link key={r.slug} href={`/robots/${r.slug}/`}>{r.name}</Link>
          ))}
        </div>
        <div>
          <h4>How it works</h4>
          <Link href="/#process">Inquiry → quote → delivery</Link>
          <Link href="/#pricelist">Get the full price list</Link>
          <Link href="/#quote">Request a quote</Link>
        </div>
        <div>
          <h4>For institutions</h4>
          <Link href="/#quote">Purchase orders welcome</Link>
          <Link href="/#quote">CE documentation, verified pre-delivery</Link>
          <Link href="/#quote">Multi-unit education pricing</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${CONFIG.CONTACT_EMAIL}`}>{CONFIG.CONTACT_EMAIL}</a>
          <p style={{ marginTop: 8 }}>Based in Israel · serving Europe, the Middle East &amp; Africa</p>
        </div>
      </div>
      <div className="legal">
        <div className="wrap">
          {CONFIG.BRAND_NAME} is an independent sales channel for the platforms shown on this
          site. We earn fees and commissions on referred and brokered sales — that&apos;s the business,
          openly. We are not a neutral review publication. © 2026 {CONFIG.BRAND_NAME} · EMEA
        </div>
      </div>
    </footer>
  );
}
