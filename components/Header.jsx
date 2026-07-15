"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const CATS = ["All", "Education", "Research", "Competition", "Content"];
const catLabel = (c) => (c === "Content" ? "Content & events" : c);

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [q, setQ] = useState("");

  function goCatalog(kind, value) {
    if (onHome) {
      window.dispatchEvent(new CustomEvent(`hub:${kind}`, { detail: value }));
      const el = document.getElementById("catalog");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/?${kind === "search" ? "q" : "cat"}=${encodeURIComponent(value)}#catalog`);
    }
  }

  return (
    <header>
      <div className="topnav">
        <div className="bar">
          <Link className="brand" href="/">
            Humanoid Hub <span className="tag">EMEA</span>
          </Link>
          <form
            className="searchbox"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              goCatalog("search", q);
            }}
          >
            <input
              type="search"
              placeholder="Search humanoid robots, makers, use cases…"
              aria-label="Search the catalog"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <Link className="btn cta navcta" href="/#quote">Request a quote</Link>
        </div>
      </div>
      <nav className="chipbar" aria-label="Browse by use case">
        <div className="bar">
          {CATS.map((c) => (
            <button key={c} type="button" onClick={() => goCatalog("cat", c)}>
              {catLabel(c)}
            </button>
          ))}
          <Link href="/#pricelist">Full price list</Link>
          <Link href="/#process">How buying works</Link>
        </div>
      </nav>
      <div className="truststrip">
        We officially represent <b>EngineAI · Booster Robotics · LimX Dynamics</b> —{" "}
        <span className="ok">CE-documented EMEA delivery</span> · formal quote within one business day
      </div>
    </header>
  );
}
