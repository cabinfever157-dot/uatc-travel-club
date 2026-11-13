"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { TravelStripe } from "@/components/brand";
import { TravelSearch } from "@/components/travel-search";
import { CTA_URL } from "@/lib/uatc";

const FORM_NAME = "uatc-membership";
const JOINED_KEY = "uatc_membership_completed";
// The fixed navigation is 128px tall, or 144px at the md breakpoint.
const BOOKING_SCROLL_OFFSET = "scroll-mt-[156px] md:scroll-mt-[172px]";

const FIELDS = [
  { name: "first-name", label: "First name", autoComplete: "given-name", type: "text", maxLength: 100 },
  { name: "last-name", label: "Last name", autoComplete: "family-name", type: "text", maxLength: 100 },
  { name: "email", label: "Email address", autoComplete: "email", type: "email", maxLength: 254 },
] as const;

export function MembershipBooking() {
  const [joined, setJoined] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [error, setError] = useState("");
  const booking = useRef<HTMLDivElement>(null);
  const focusBooking = useRef(false);
  const submitted = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        if (sessionStorage.getItem(JOINED_KEY) === "1") setJoined(true);
      } catch {
        // The form still works when browser storage is unavailable.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!joined || !focusBooking.current) return;

    focusBooking.current = false;
    booking.current?.focus({ preventScroll: true });
    booking.current?.scrollIntoView({ block: "start" });
    if (window.location.hash === CTA_URL) window.history.replaceState(null, "", "#travel");
  }, [joined]);

  async function joinClub(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted.current) return;

    const fields = new FormData(event.currentTarget);
    const body = new URLSearchParams({ "form-name": FORM_NAME, "bot-field": String(fields.get("bot-field") ?? "") });
    for (const { name } of FIELDS) {
      const value = String(fields.get(name) ?? "").trim();
      if (!value) {
        setError("Please fill in your first name, last name, and email address.");
        return;
      }
      body.set(name, value);
    }

    submitted.current = true;
    try {
      sessionStorage.setItem(JOINED_KEY, "1");
    } catch {
      // Booking can still open on this page without browser storage.
    }

    focusBooking.current = true;
    setJoined(true);

    try {
      const response = await fetch("/membership-form.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        keepalive: true,
      });
      if (!response.ok) setSaveFailed(true);
    } catch {
      setSaveFailed(true);
    }
  }

  return (
    <div id="travel" className={BOOKING_SCROLL_OFFSET}>
      {joined ? (
        <div id="join-club" ref={booking} tabIndex={-1} aria-label="Member booking" className={BOOKING_SCROLL_OFFSET + " outline-none"}>
          {saveFailed && (
            <p role="status" className="bg-cream px-4 py-3 text-center text-sm text-ink">
              We couldn’t save your signup. You can still search member rates below.
            </p>
          )}
          <TravelSearch />
        </div>
      ) : (
        <section className="bg-cream text-ink px-4 py-16 sm:px-6 md:py-24 lg:px-8" aria-labelledby="travel-savings-title">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <TravelStripe a="#0a0a0a" b="#c8102e" className="mb-5 h-[3px] w-16" />
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-ink/65">Member booking</p>
              <h2 id="travel-savings-title" className="font-display text-[clamp(2.75rem,5.6vw,5rem)] uppercase leading-none">
                See how much <span className="text-red">you can save.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/75 md:text-lg">
                Join the club for free to compare member rates on hotels, rental cars, flights, cruises, events, and park tickets.
              </p>
              <a href={CTA_URL} className="mt-7 inline-flex items-center gap-2 rounded-sm bg-red px-6 py-3.5 font-display uppercase tracking-wider text-white hover:bg-red-2">
                See member rates <ArrowRight aria-hidden="true" className="size-5" />
              </a>
            </div>

            <form id="join-club" method="post" action="/membership-form.html" onSubmit={joinClub} className={BOOKING_SCROLL_OFFSET + " border border-ink/15 bg-white shadow-lg"}>
              <TravelStripe a="#c8102e" b="#0a0a0a" className="h-2.5 w-full" />
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-3xl uppercase">Join the Club</h3>
                <p className="mt-2 text-sm text-ink/75">Sign up to unlock member travel search.</p>
                <input type="hidden" name="form-name" value={FORM_NAME} />
                <div hidden>
                  <label>Leave this field blank <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {FIELDS.map(({ name, label, autoComplete, type, maxLength }) => (
                    <label key={name} className={name === "email" ? "sm:col-span-2" : ""}>
                      <span className="block text-sm font-bold">{label}</span>
                      <input name={name} type={type} autoComplete={autoComplete} maxLength={maxLength} required className="mt-1.5 w-full rounded-sm border border-ink/30 px-3 py-2.5 outline-offset-2 focus:outline-red" />
                    </label>
                  ))}
                </div>
                {error && <p role="alert" className="mt-4 text-sm text-red-2">{error}</p>}
                <button type="submit" className="mt-6 w-full rounded-sm bg-red px-5 py-3.5 font-display uppercase tracking-wider text-white hover:bg-red-2">
                  Join the Club &amp; See Rates
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
