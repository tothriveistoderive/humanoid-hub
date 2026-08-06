"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import { ROBOTS } from "@/lib/robots";

// Field length caps. Mirrored by CHECK constraints in Postgres (see
// supabase-hardening.sql) so they also apply to anything hitting the REST
// endpoint directly, bypassing this form.
const MAX = { name: 120, org: 160, email: 254, country: 80, message: 2000 };

// Stricter than type="email", which accepts "a@b" and "test@localhost".
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const EMAIL_PATTERN = "[^@\\s]+@[^@\\s]+\\.[A-Za-z]{2,}";

const clean = (v) => (typeof v === "string" ? v.trim() : v) || null;

// Destination country drives freight, duties, VAT and CE documentation, so it
// needs to be consistent. Free text produced "NL" / "Holland" / "netherlands".
const COUNTRIES = [
  "Austria", "Bahrain", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
  "Denmark", "Egypt", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Israel", "Italy", "Jordan", "Kuwait", "Latvia",
  "Lithuania", "Luxembourg", "Malta", "Morocco", "Netherlands", "Norway",
  "Oman", "Poland", "Portugal", "Qatar", "Romania", "Saudi Arabia", "Serbia",
  "Slovakia", "Slovenia", "South Africa", "Spain", "Sweden", "Switzerland",
  "Türkiye", "Ukraine", "United Arab Emirates", "United Kingdom", "Other",
];

async function insertLead(payload) {
  const res = await fetch(CONFIG.SUPABASE_URL + "/rest/v1/leads", {
    method: "POST",
    headers: {
      apikey: CONFIG.SUPABASE_ANON_KEY,
      Authorization: "Bearer " + CONFIG.SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("supabase " + res.status);
}

function NoScriptNotice() {
  return (
    <noscript>
      <p className="form-msg err" style={{ display: "block", marginBottom: 12 }}>
        This form needs JavaScript to send. Please email{" "}
        <a href={`mailto:${CONFIG.CONTACT_EMAIL}`}>{CONFIG.CONTACT_EMAIL}</a> instead and we'll
        reply within one business day.
      </p>
    </noscript>
  );
}

// Hidden from humans and assistive tech; bots fill it in. If it has a value we
// drop the submission silently rather than telling the bot it failed.
function Honeypot() {
  return (
    <div aria-hidden="true" className="hp-field">
      <label htmlFor="hp-website">Website</label>
      <input id="hp-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function QuoteForm() {
  const [status, setStatus] = useState(null); // null | "busy" | "ok" | "err"
  const [fieldError, setFieldError] = useState(null);
  const selRef = useRef(null);
  const inFlight = useRef(false); // synchronous — React state is too slow to block a double-click

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("robot");
    if (p && selRef.current && ROBOTS.some((r) => r.slug === p)) selRef.current.value = p;
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (data.website) {
      // Honeypot tripped. Show the normal success state and send nothing.
      setStatus("ok");
      form.reset();
      return;
    }

    const name = clean(data.name);
    const org = clean(data.org);
    const email = clean(data.email);
    const country = clean(data.country);
    const message = clean(data.message);

    // Whitespace-only input passes HTML5 `required`, so re-check after trimming.
    if (!name || !org || !country) {
      setFieldError("Please fill in your name, organization and country.");
      setStatus("err");
      return;
    }
    if (!email || !EMAIL_RE.test(email)) {
      setFieldError("Please enter a valid work email address.");
      setStatus("err");
      return;
    }

    inFlight.current = true;
    setFieldError(null);
    setStatus("busy");
    try {
      await insertLead({
        type: "quote",
        name,
        org,
        email,
        country,
        robot: clean(data.robot),
        use_case: clean(data.use_case),
        budget: clean(data.budget),
        message,
        page: window.location.pathname,
      });
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    // method="post" so that if JavaScript never loads, the browser's fallback
    // submission cannot put the visitor's name and email into the URL.
    <form className="quote" method="post" onSubmit={onSubmit}>
      <NoScriptNotice />
      <Honeypot />

      <div>
        <label htmlFor="q-name">Name</label>
        <input id="q-name" name="name" required maxLength={MAX.name} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="q-org">Organization</label>
        <input id="q-org" name="org" required maxLength={MAX.org} autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="q-email">Work email</label>
        <input
          id="q-email"
          type="email"
          name="email"
          required
          maxLength={MAX.email}
          pattern={EMAIL_PATTERN}
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="q-country">Country</label>
        <input
          id="q-country"
          name="country"
          required
          maxLength={MAX.country}
          autoComplete="country-name"
          list="country-list"
        />
        <datalist id="country-list">
          {COUNTRIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div>
        <label htmlFor="q-robot">Platform of interest</label>
        <select id="q-robot" name="robot" ref={selRef} defaultValue="">
          <option value="">Not sure yet</option>
          {ROBOTS.map((r) => (
            <option key={r.slug} value={r.slug}>{r.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="q-budget">Budget range</label>
        <select id="q-budget" name="budget" defaultValue="">
          <option value="">Prefer not to say</option>
          <option>Under $10k</option>
          <option>$10k – $30k</option>
          <option>$30k – $60k</option>
          <option>$60k+</option>
        </select>
      </div>
      <div className="full">
        <label htmlFor="q-usecase">Use case</label>
        <select id="q-usecase" name="use_case" defaultValue="">
          <option value="">Select one</option>
          <option>University / research lab</option>
          <option>Robotics or AI startup</option>
          <option>Corporate innovation lab</option>
          <option>Education / training program</option>
          <option>Museum / exhibition / events</option>
          <option>Media / content production</option>
          <option>Other</option>
        </select>
      </div>
      <div className="full">
        <label htmlFor="q-message">Anything else</label>
        <textarea
          id="q-message"
          name="message"
          maxLength={MAX.message}
          placeholder="Timeline, quantity, questions…"
        />
      </div>
      <div className="full">
        <button className="btn cta" type="submit" disabled={status === "busy"}>
          {status === "busy" ? "Sending…" : "Request the quote"}
        </button>{" "}
        <span
          role="status"
          aria-live="polite"
          className={"form-msg " + (status === "ok" ? "ok" : status === "err" ? "err" : "")}
        >
          {status === "ok" && "Received. We reply within one business day."}
          {status === "err" &&
            (fieldError || `Something failed — email us at ${CONFIG.CONTACT_EMAIL}.`)}
        </span>
      </div>
      <p className="full muted" style={{ fontSize: 12, marginTop: -4 }}>
        We use these details only to prepare your quote. See our{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
    </form>
  );
}

export function PricelistForm() {
  const [status, setStatus] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const inFlight = useRef(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (data.website) {
      setStatus("ok");
      form.reset();
      return;
    }

    const email = clean(data.email);
    if (!email || !EMAIL_RE.test(email)) {
      setFieldError("Please enter a valid work email address.");
      setStatus("err");
      return;
    }

    inFlight.current = true;
    setFieldError(null);
    setStatus("busy");
    try {
      await insertLead({ type: "pricelist", email, page: window.location.pathname });
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <form className="pricelist" method="post" onSubmit={onSubmit}>
      <NoScriptNotice />
      <Honeypot />
      <label htmlFor="pl-email" className="sr-only">
        Work email
      </label>
      <input
        id="pl-email"
        type="email"
        name="email"
        required
        maxLength={MAX.email}
        pattern={EMAIL_PATTERN}
        autoComplete="email"
        placeholder="work email"
      />
      <button className="btn cta" type="submit" disabled={status === "busy"}>
        {status === "busy" ? "Sending…" : "Send the price list"}
      </button>
      <span
        role="status"
        aria-live="polite"
        className={"form-msg " + (status === "ok" ? "ok" : status === "err" ? "err" : "")}
      >
        {status === "ok" && "Received — the price list lands in your inbox within one business day."}
        {status === "err" && (fieldError || "Something failed — try again.")}
      </span>
    </form>
  );
}
