"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TravelStripe } from "@/components/brand";
import { CTA_URL, SIGN_IN_URL } from "@/lib/uatc";

const STEPS = [
  {
    n: "01",
    title: "JOIN THE CLUB",
    body: "One membership unlocks every trip — game weekends, reunions, and adventures, all member-priced.",
  },
  {
    n: "02",
    title: "PICK YOUR TRIP",
    body: "Browse by school, conference, or crew. Reserve a seat in seconds — the planning is already done.",
  },
  {
    n: "03",
    title: "SHOW UP. WE HANDLE THE REST.",
    body: "Coach, hotel, tailgate, tickets, dinner. You bring the school colors; we bring the logistics.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section id="how" ref={ref} className="relative bg-cream py-20 md:py-28 overflow-hidden text-ink">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0a0a0a 0 1px, transparent 1px 96px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <TravelStripe a="#0a0a0a" b="#c8102e" className="w-16 h-[3px]" />
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-ink/60">
              How it works
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-ink leading-[1.02]">
            THREE STEPS.
            <br />
            <span className="text-red">Zero spreadsheets.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 34 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.18 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-t-2 border-ink/15 pt-6 pl-1"
            >
              {/* hairline rule + red tick (no empty decorative outlines) */}
              <div className="absolute -top-[2px] left-0 w-10 h-[2px] bg-red" />
              <div className="font-display text-5xl text-ink/15 select-none">{s.n}</div>
              <div className="font-display text-xl mt-2 mb-2.5">{s.title}</div>
              <p className="text-sm text-ink/65 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Join band — conversion moment */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 md:mt-20 relative rounded-lg overflow-hidden bg-black text-cream"
        >
          <div aria-hidden className="absolute inset-0 travel-stripe opacity-[0.05]" />
          <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-8 p-8 md:p-12 items-center">
            <div>
              <div className="font-display text-3xl md:text-[2.6rem] leading-[1.03]">
                YOUR ALMA MATER PLANned THE TRIP.
                <br />
                <span className="text-red">YOU JUST SHOW UP.</span>
              </div>
              <p className="mt-4 text-cream/70 text-sm md:text-base leading-relaxed max-w-md">
                Join the University Alumni Travel Club today — your first trip
                is waiting, and your seats are held.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-4">
                <a
                  href={CTA_URL}
                  onClick={(e) => CTA_URL === "#" && e.preventDefault()}
                  className="inline-flex items-center justify-center font-display uppercase tracking-wider text-base bg-red text-white px-8 py-4 rounded-sm shadow-[0_4px_28px_rgba(200,16,46,0.5)] transition-all duration-500 hover:bg-red-2 hover:shadow-[0_8px_44px_rgba(200,16,46,0.75)]"
                >
                  Join the Club
                </a>
                <a
                  href={SIGN_IN_URL}
                  onClick={(e) => SIGN_IN_URL === "#" && e.preventDefault()}
                  className="inline-flex items-center justify-center font-display uppercase tracking-wider text-base text-cream/80 border border-cream/25 px-8 py-4 rounded-sm transition-all duration-500 hover:border-cream/60 hover:text-white"
                >
                  Sign In
                </a>
              </div>
            </div>
            <div className="hidden md:block" aria-hidden>
              <svg viewBox="0 0 200 130" className="w-full">
                {/* road through stripes — the Travel Stripe as destination art */}
                {[0, 14, 28, 42, 56, 70, 84, 98, 112].map((y) => (
                  <g key={y}>
                    <rect x="0" y={y} width="200" height="7" fill="#c8102e" opacity={y % 28 === 0 ? 0.9 : 0} />
                    <rect x="0" y={y} width="200" height="7" fill="#faf7f0" opacity={y % 28 === 14 ? 0.9 : 0} />
                  </g>
                ))}
                <path d="M100,0 L92,130 L108,130 Z" fill="#0a0a0a" />
                <path d="M100,0 L98,130 L102,130 Z" fill="#faf7f0" opacity="0.85" />
                {[18, 48, 78, 108].map((y) => (
                  <rect key={y} x="99.2" y={y} width="1.6" height="12" fill="#faf7f0" />
                ))}
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}