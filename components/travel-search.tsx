"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, CarFront, FerrisWheel, Plane, Ship, Ticket } from "lucide-react";
import { TravelStripe } from "@/components/brand";

type TravelView = "hotels" | "cars" | "cruises" | "events" | "flights" | "parks";
type TravelStatus = "checking" | "connecting" | "ready" | "error" | "local-blocked";

type TravelClientEvent = {
  error_message?: string;
  update_code?: string;
};

type TravelClient = {
  start: (options: {
    session_token: string;
    container: string;
    width?: string | number;
    height?: string | number;
    navigate_to?: { view: "home"; start_tab: TravelView };
  }) => void;
  navigateTo: (options: { view: "home"; start_tab: TravelView }) => void;
  on: (type: "error" | "update", callback: (event: TravelClientEvent) => void) => void;
};

declare global {
  interface Window {
    travelClient?: TravelClient;
  }
}

const SDK_URL =
  process.env.NEXT_PUBLIC_ACCESS_TRAVEL_SDK_URL ??
  "https://booking.accessdevelopment-stage.com/scripts/travel.client.v2.js";

const PRODUCTS: Array<{
  view: TravelView;
  label: string;
  icon: typeof BedDouble;
}> = [
  { view: "hotels", label: "Hotels", icon: BedDouble },
  { view: "cars", label: "Cars", icon: CarFront },
  { view: "flights", label: "Flights", icon: Plane },
  { view: "cruises", label: "Cruises", icon: Ship },
  { view: "events", label: "Events", icon: Ticket },
  { view: "parks", label: "Parks", icon: FerrisWheel },
];

function getMemberKey() {
  const storageKey = "uatc_access_member_key";
  const existing = window.localStorage.getItem(storageKey);
  if (existing && /^[a-zA-Z0-9_-]{1,255}$/.test(existing)) return existing;

  const memberKey = `uatc_${window.crypto.randomUUID().replaceAll("-", "_")}`;
  window.localStorage.setItem(storageKey, memberKey);
  return memberKey;
}

export function TravelSearch() {
  const [status, setStatus] = useState<TravelStatus>("checking");
  const [message, setMessage] = useState("");
  const [canLoadSdk, setCanLoadSdk] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const isLocal = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
      if (isLocal) {
        setStatus("local-blocked");
        setMessage(
          "Access blocks localhost by design. The integration is ready for a whitelisted staging or production domain.",
        );
        return;
      }

      setStatus("connecting");
      setCanLoadSdk(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const initialize = useCallback(async () => {
    if (started.current || !window.travelClient) return;

    setStatus("connecting");
    setMessage("");
    setCanRetry(false);

    try {
      const response = await fetch("/api/travel-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberKey: getMemberKey() }),
        cache: "no-store",
      });
      const data = (await response.json()) as { session_token?: string; error?: string };

      if (!response.ok || !data.session_token) {
        throw new Error(data.error ?? "Travel search could not be started.");
      }

      window.travelClient.on("error", (event) => {
        setStatus("error");
        setMessage(event.error_message ?? "Access reported a travel search error.");
        setCanRetry(false);
      });

      window.travelClient.on("update", (event) => {
        if (event.update_code === "TRAVEL_CLIENT_LOADED") setStatus("ready");
        if (
          event.update_code === "SESSION_NOT_FOUND" ||
          event.update_code === "TRAVEL_CLIENT_SESSION_EXPIRED"
        ) {
          setStatus("error");
          setMessage("Your travel session expired. Refresh the page to start a new search.");
        }
      });

      started.current = true;
      window.travelClient.start({
        session_token: data.session_token,
        container: "#access-travel-client",
        width: "100%",
        height: "fit",
        navigate_to: { view: "home", start_tab: "hotels" },
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Travel search is unavailable.");
      setCanRetry(!started.current);
    }
  }, []);

  const showProduct = (view: TravelView) => {
    if (status !== "ready" || !window.travelClient) return;
    window.travelClient.navigateTo({ view: "home", start_tab: view });
    document.getElementById("access-travel-client")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section id="travel" className="relative bg-cream text-ink py-20 md:py-28 overflow-hidden">
      {canLoadSdk && (
        <Script
          id="access-travel-sdk"
          src={SDK_URL}
          strategy="afterInteractive"
          onReady={() => void initialize()}
          onError={() => {
            setStatus("error");
            setMessage("The Access travel search library could not be loaded.");
            setCanRetry(true);
          }}
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0a0a0a 0 1px, transparent 1px 96px)",
        }}
      />

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-9"
        >
          <div className="flex items-center gap-3 mb-4">
            <TravelStripe a="#0a0a0a" b="#c8102e" className="w-16 h-[3px]" />
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-ink/60">
              Member booking
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.6rem)] leading-[0.98] text-ink">
            MEMBER RATES.
            <br />
            <span className="text-red">ONE SEARCH AWAY.</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-ink/65 leading-relaxed max-w-2xl">
            Compare hotels, rental cars, flights, cruises, events, and park tickets in one place —
            with UATC member pricing built in.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-4" aria-label="Travel categories">
          {PRODUCTS.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              type="button"
              onClick={() => showProduct(view)}
              disabled={status !== "ready"}
              className="group flex min-h-16 items-center justify-center gap-2 border border-ink/15 bg-white px-3 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all duration-300 hover:border-red hover:text-red disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="relative bg-white border border-ink/10 shadow-[0_24px_80px_rgba(10,10,10,0.14)] min-h-[640px] md:min-h-[80vh]">
          <TravelStripe a="#c8102e" b="#0a0a0a" className="h-2.5 w-full" />
          <div
            id="access-travel-client"
            className="w-full min-h-[630px] md:min-h-[80vh]"
            aria-busy={status === "checking" || status === "connecting"}
          />

          {status !== "ready" && (
            <div className="absolute inset-x-0 top-2.5 bottom-0 flex items-center justify-center p-6 md:p-12 bg-white">
              <div className="max-w-xl text-center">
                <div className="font-display text-3xl md:text-4xl text-ink">
                  {status === "local-blocked" ? "READY FOR WHITELISTING" : "OPENING MEMBER SEARCH"}
                </div>
                <p className="mt-4 text-ink/60 leading-relaxed">
                  {message || "Connecting securely to Access Development…"}
                </p>
                {status === "error" && canRetry && (
                  <button
                    type="button"
                    onClick={initialize}
                    className="mt-7 font-display uppercase tracking-wider bg-red text-white px-7 py-3.5 rounded-sm hover:bg-red-2 transition-colors"
                  >
                    Try again
                  </button>
                )}
                {status === "local-blocked" && (
                  <div className="mt-7 inline-flex items-center gap-3 border-t border-ink/15 pt-5 text-sm text-ink/55">
                    <span className="font-bold text-red">Next:</span>
                    Whitelist the UATC stage domain with Access Development.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
