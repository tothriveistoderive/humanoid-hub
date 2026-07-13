"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import { ROBOTS } from "@/lib/robots";

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

export function QuoteForm() {
  const [status, setStatus] = useState(null); // null | "busy" | "ok" | "err"
  const selRef = useRef(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("robot");
    if (p && selRef.current && ROBOTS.some((r) => r.slug === p)) selRef.current.value = p;
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("busy");
    try {
      await insertLead({
        type: "quote",
        name: data.name || null,
        org: data.org || null,
        email: data.email,
        country: data.country || null,
        robot: data.robot || null,
        use_case: data.use_case || null,
        budget: data.budget || null,
        message: data.message || null,
        page: window.location.pathname,
      });
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <form className="quote" onSubmit={onSubmit}>
      <div><label>Name</label><input name="name" required autoComplete="name" /></div>
      <div><label>Organization</label><input name="org" required autoComplete="organization" /></div>
      <div><label>Work email</label><input type="email" name="email" required autoComplete="email" /></div>
      <div><label>Country</label><input name="country" required autoComplete="country-name" /></div>
      <div>
        <label>Platform of interest</label>
        <select name="robot" ref={selRef} defaultValue="">
          <option value="">Not sure yet</option>
          {ROBOTS.map((r) => (
            <option key={r.slug} value={r.slug}>{r.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Budget range</label>
        <select name="budget" defaultValue="">
          <option value="">Prefer not to say</option>
          <option>Under $10k</option>
          <option>$10k – $30k</option>
          <option>$30k – $60k</option>
          <option>$60k+</option>
        </select>
      </div>
      <div className="full">
        <label>Use case</label>
        <select name="use_case" defaultValue="">
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
      <div className="full"><label>Anything else</label><textarea name="message" placeholder="Timeline, quantity, questions…" /></div>
      <div className="full">
        <button className="btn accent" type="submit" disabled={status === "busy"}>Request the quote</button>{" "}
        <span className={"form-msg " + (status === "ok" ? "ok" : status === "err" ? "err" : "")}>
          {status === "ok" && "Received. We reply within one business day."}
          {status === "err" && `Something failed — email us at ${CONFIG.CONTACT_EMAIL}.`}
        </span>
      </div>
    </form>
  );
}

export function PricelistForm() {
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("busy");
    try {
      await insertLead({ type: "pricelist", email: data.email, page: window.location.pathname });
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <form className="pricelist" onSubmit={onSubmit}>
      <input type="email" name="email" required placeholder="work email" />
      <button className="btn accent" type="submit" disabled={status === "busy"}>Send the price list</button>
      <span className={"form-msg " + (status === "ok" ? "ok" : status === "err" ? "err" : "")}>
        {status === "ok" && "Sent — check your inbox shortly."}
        {status === "err" && "Something failed — try again."}
      </span>
    </form>
  );
}
