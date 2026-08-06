"use client";

import { useState } from "react";
import Diagram from "@/components/Diagram";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Photo-ready gallery. Today: SVG schematic + styled empty slots.
// Add paths to `gallery` in robots.js and real thumbnails take over with zero rework.
export default function ProductGallery({ r }) {
  const photos = r.gallery && r.gallery.length ? r.gallery : [];
  const slots = [null, ...photos]; // slot 0 = schematic
  const [active, setActive] = useState(photos.length ? 1 : 0);
  const emptyCount = Math.max(0, 3 - photos.length);

  return (
    <div className="gallery">
      <div className="thumbs">
        {slots.map((src, i) => (
          <button
            key={i}
            type="button"
            className={"thumb" + (active === i ? " on" : "")}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            aria-label={src ? `${r.name} photo ${i}` : `${r.name} technical schematic`}
          >
            {src ? <img src={`${BASE}${src}`} alt="" /> : <span>spec<br />view</span>}
          </button>
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div key={`e${i}`} className="thumb empty" aria-hidden="true">
            <span>photo<br />soon</span>
          </div>
        ))}
      </div>
      <div className="main">
        {slots[active] ? (
          <img src={`${BASE}${slots[active]}`} alt={`${r.name} product photo`} />
        ) : (
          <Diagram d={r.diagram} name={r.name} />
        )}
      </div>
      <div className="caption" role="status" aria-live="polite">
        <span>{r.name} — {slots[active] ? "product photo" : "side elevation, schematic"}</span>
        <span>{r.cls}</span>
      </div>
    </div>
  );
}
