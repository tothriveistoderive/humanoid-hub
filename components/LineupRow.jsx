"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LineupRow({ r }) {
  const router = useRouter();
  return (
    <tr
      className="rowlink"
      onClick={(e) => {
        if (e.target.tagName !== "A") router.push(`/robots/${r.slug}/`);
      }}
    >
      <td className="model">
        <Link href={`/robots/${r.slug}/`}>{r.name}</Link>
        <span className="mfr">{r.maker}</span>
      </td>
      <td className="hide-m">{r.cls}</td>
      <td className="hide-m">
        {r.chips.map((c) => (
          <span className="chip" key={c}>{c}</span>
        ))}
      </td>
      <td className="price">
        {r.price}
        <small>confirmed on quote</small>
      </td>
    </tr>
  );
}
