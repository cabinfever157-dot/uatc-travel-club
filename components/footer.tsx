"use client";

import { TravelStripe } from "@/components/brand";
import { CTA_URL, SIGN_IN_URL } from "@/lib/uatc";

const footerLinks = [
  { id: "travel", label: "Search Travel" },
  { id: "follow", label: "Follow Your Team" },
  { id: "adventures", label: "Adventures" },
  { id: "savings", label: "Savings" },
  { id: "how", label: "How It Works" },
];

export function Footer() {
  return (
    <footer className="relative bg-black text-cream overflow-hidden">
      <TravelStripe className="h-2.5 w-full opacity-90" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/uatc-crest.png"
                alt="University Alumni Travel Club"
                className="w-12 h-12 rounded-full ring-1 ring-cream/20 object-cover"
              />
              <div className="font-display text-lg leading-none">
                UNIVERSITY ALUMNI
                <br />
                <span className="text-red">TRAVEL CLUB</span>
              </div>
            </div>
            <p className="text-sm text-cream/55 leading-relaxed max-w-xs">
              Group travel for university alumni — football weekends, reunions,
              and adventures in your college colors.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={CTA_URL}
                onClick={(e) => CTA_URL === "#" && e.preventDefault()}
                className="font-display uppercase tracking-wider text-sm bg-red text-white px-5 py-2.5 rounded-sm hover:bg-red-2 transition-colors duration-500"
              >
                Join
              </a>
              <a
                href={SIGN_IN_URL}
                onClick={(e) => SIGN_IN_URL === "#" && e.preventDefault()}
                className="font-display uppercase tracking-wider text-sm text-cream/80 border border-cream/25 px-5 py-2.5 rounded-sm hover:border-cream/60 transition-colors duration-500"
              >
                Sign In
              </a>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-red mb-4">
              Trips
            </div>
            <ul className="space-y-2.5">
              {footerLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className="text-sm text-cream/55 hover:text-cream transition-colors duration-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-red mb-4">
              The fine print
            </div>
            <ul className="space-y-2.5 text-sm text-cream/55">
              <li>
                <a href="#" className="hover:text-cream transition-colors duration-300">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>Questions: hello@uatc.travel</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-cream/40">
          <div>© 2026 University Alumni Travel Club. All rights reserved.</div>
          <div className="tracking-wider uppercase">
            Your crew. Your colors. Your next trip.
          </div>
        </div>
      </div>
    </footer>
  );
}
