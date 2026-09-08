"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { UatcMark, TravelStripe } from "@/components/brand";
import { SCHOOLS, GRID_SCHOOL_IDS, CTA_URL } from "@/lib/uatc";

// HERO — Warhol grid color-flood signature.
// Tiles stagger in monochrome; college colors flood row-by-row.
export function Hero() {
  const grid = GRID_SCHOOL_IDS.map((id) => SCHOOLS.find((s) => s.id === id)!);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-black pt-28 md:pt-32">
      {/* base texture — faint end-zone stripe, red pair, very low opacity */}
      <div
        aria-hidden
        className="absolute inset-0 travel-stripe opacity-[0.035] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center flex-1">
        {/* Copy block */}
        <div className="pt-6 pb-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <TravelStripe className="w-16 h-[3px]" />
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-cream/60">
              Group travel for alumni
            </span>
          </motion.div>

          {/* Word-by-word blur-fade reveal — mr on EVERY word (G173) */}
          <h1 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.97] text-cream">
            {["YOUR", "CREW.", "YOUR", "COLORS.", "YOUR", "NEXT", "TRIP."].map(
              (w, i) => (
                <span
                  key={i}
                  className={`inline-block mr-[0.25em] ${
                    w === "COLORS." || w === "TRIP." ? "text-red" : ""
                  }`}
                  style={{ overflow: "visible" }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.25 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {w}
                  </motion.span>
                </span>
              )
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg md:text-xl text-cream/80 max-w-xl leading-relaxed"
          >
            Football weekends, class reunions, and bucket-list adventures —
            organized for alumni, priced for members, and run with your school
            colors on the bus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col sm:flex-row gap-4"
          >
            <a
              href={CTA_URL}
              onClick={(e) => CTA_URL === "#" && e.preventDefault()}
              className="group inline-flex items-center justify-center gap-2 font-display uppercase tracking-wider text-base bg-red text-white px-8 py-4 rounded-sm shadow-[0_4px_28px_rgba(200,16,46,0.5)] transition-all duration-500 hover:bg-red-2 hover:shadow-[0_8px_44px_rgba(200,16,46,0.75)]"
            >
              Join the Club
              <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1.5" />
            </a>
            <a
              href="#adventures"
              className="inline-flex items-center justify-center font-display uppercase tracking-wider text-base text-cream border-b-2 border-red/60 px-2 py-4 transition-colors duration-500 hover:border-red hover:text-white"
            >
              See upcoming trips
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mt-6 text-sm text-cream/60"
          >
            Members save an average of $250 per trip. First trips fill fast —
            seats are held for members.
          </motion.p>
        </div>

        {/* Warhol grid — 12 tiles, 4×3, pure mark, color flood by row */}
        <div className="relative pb-10">
          <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto lg:ml-auto lg:mr-0">
            {grid.map((s, i) => {
              const row = Math.floor(i / 4); // 0,1,2
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 210,
                    damping: 16,
                    delay: 0.45 + i * 0.07,
                  }}
                  className="aspect-square rounded-md overflow-hidden bg-cream/5 border border-white/10"
                >
                  {/* color flood: starts UATC monochrome, floods school colors */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 1.55 + row * 0.55 }}
                    className="w-full h-full"
                  >
                    <UatcMark
                      c1={s.c2}
                      c2={s.c1}
                      className="w-full h-full"
                      title=""
                    />
                  </motion.div>
                  {/* monochrome underlay shown until flood covers it */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.9, delay: 1.55 + row * 0.55 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <UatcMark
                      c1="#5a5a5a"
                      c2="#141414"
                      className="w-[62%] h-[62%]"
                      title=""
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4, duration: 0.8 }}
            className="mt-4 text-xs tracking-[0.18em] uppercase text-cream/40 text-center lg:text-right max-w-md mx-auto lg:mr-0"
          >
            Your colors are already on the bus
          </motion.p>
        </div>
      </div>

      {/* bottom Travel Stripe seam into Follow Your Team */}
      <TravelStripe className="h-2.5 w-full opacity-90" />
    </section>
  );
}