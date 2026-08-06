"use client";

import { useEffect } from "react";

/**
 * Re-applies the URL fragment after hydration.
 *
 * On a cold load of /#quote or /?robot=x#quote the browser jumps to the anchor
 * before React hydrates, then hydration resets scroll to the top — so anyone
 * opening a shared "request a quote" link in a new tab landed on the hero
 * instead of the form. Same-page clicks and client-side navigation were always
 * fine; this only fixes the first paint.
 *
 * Scrolling once isn't enough: Next.js's own scroll restoration runs *after*
 * a single rAF and puts you back at the top. So we disable restoration and
 * re-assert the position across the first second, stopping as soon as it
 * sticks or the user takes over.
 */
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!id) return;

    // Stop the browser/router putting us back at the top.
    const previous = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {}

    let cancelled = false;
    const stop = () => {
      cancelled = true;
    };
    // If the visitor starts scrolling themselves, get out of the way.
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });

    const target = () => document.getElementById(id);
    const settle = () => {
      if (cancelled) return;
      const el = target();
      if (!el) return;
      const wanted = el.getBoundingClientRect().top + window.scrollY;
      // globals.css sets `scroll-behavior: smooth`, so a normal scroll here
      // animates — and the hydration reset interrupts it mid-flight. Jump.
      if (Math.abs(window.scrollY - wanted) > 4) {
        window.scrollTo({ top: wanted, behavior: "instant" });
      }
    };

    // Element may mount a beat later, and the reset can land at any point in
    // the first few hundred ms, so re-assert on a short schedule.
    const timers = [0, 60, 120, 250, 400, 600, 900].map((ms) =>
      setTimeout(settle, ms)
    );

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      try {
        history.scrollRestoration = previous || "auto";
      } catch {}
    };
  }, []);

  return null;
}
