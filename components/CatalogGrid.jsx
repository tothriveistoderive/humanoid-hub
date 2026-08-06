"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ROBOTS } from "@/lib/robots";

export const CATS = ["All", "Education", "Research", "Competition", "Content"];

const catLabel = (c) => (c === "Content" ? "Content & events" : c);

export default function CatalogGrid() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    // Accept initial state from URL (?q=…&cat=…) and live events from the header.
    const params = new URLSearchParams(window.location.search);
    const q0 = params.get("q");
    const c0 = params.get("cat");
    if (q0) setQ(q0);
    if (c0 && CATS.includes(c0)) setCat(c0);
    const onSearch = (e) => { setQ(e.detail || ""); };
    const onCat = (e) => { if (CATS.includes(e.detail)) setCat(e.detail); };
    window.addEventListener("hub:search", onSearch);
    window.addEventListener("hub:cat", onCat);
    return () => {
      window.removeEventListener("hub:search", onSearch);
      window.removeEventListener("hub:cat", onCat);
    };
  }, []);

  const list = useMemo(() => {
    let out = ROBOTS.filter((r) => {
      const hay = `${r.name} ${r.maker} ${r.cls} ${r.chips.join(" ")} ${r.proof}`.toLowerCase();
      const okQ = !q || hay.includes(q.toLowerCase());
      const okC = cat === "All" || r.chips.some((c) => c.toLowerCase().includes(cat.toLowerCase()));
      return okQ && okC;
    });
    if (sort === "price-asc") out = [...out].sort((a, b) => +a.priceNum - +b.priceNum);
    if (sort === "price-desc") out = [...out].sort((a, b) => +b.priceNum - +a.priceNum);
    return out;
  }, [q, cat, sort]);

  return (
    <div id="catalog">
      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by use case">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              className={cat === c ? "on" : ""}
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
            >
              {catLabel(c)}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <span className="count" role="status" aria-live="polite">
          {list.length} platform{list.length === 1 ? "" : "s"}
          {q ? ` for “${q}”` : ""}
        </span>
        <label className="muted" style={{ fontSize: 13 }} htmlFor="sort">Sort</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      <div className="grid-products">
        {list.map((r) => (
          <ProductCard r={r} key={r.slug} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="muted" style={{ padding: "18px 0" }}>
          Nothing matches — clear the search or ask us directly via the quote form; we source beyond the listed lineup.
        </p>
      )}
    </div>
  );
}
