"use client";

import { useEffect } from "react";

/**
 * Re-applies the URL fragment after hydration.
 *
 * On a cold load of /#quote or /?robot=x#quote the browser jumps to the anchor
 * before React hydrates, and hydration resets scroll to the top — so anyone
 * opening a shared "request a quote" link in a new tab landed on the hero
 * instead of the form. Same-page clicks and client-side navigation were always
 * fine; this only fixes the first paint.
 */
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!id) return;

    let frames = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
      // Sections below the fold can mount a beat later; retry for ~1s.
      if (frames++ < 60) requestAnimationFrame(tryScroll);
    };
    requestAnimationFrame(tryScroll);
  }, []);

  return null;
}
