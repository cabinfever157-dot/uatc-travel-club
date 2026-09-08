"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { TravelStripe } from "@/components/brand";
import { STATS, SAVINGS_POINTS, CTA_URL } from "@/lib/uatc";

// Scoreboard flip counter — savings band signature
function FlipNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 1800;
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Savings() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section id="savings" ref={ref} className="relative bg-black py-20 md:py-28 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 travel-stripe opacity-[0.035] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TravelStripe className="w-16 h-[3px]" />
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-cream/60">
              The savings scoreboard
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-cream leading-[1.02] max-w-3xl">
            MEMBERSHIP PAYS FOR ITSELF
            <br />
            <span className="text-red">ON THE FIRST TRIP.</span>
          </h2>
        </motion.div>

        {/* scoreboard stats */}
        <div className="mt-10 md:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-md border border-white/10 bg-white/[0.03] p-6 overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute top-0 left-0 h-1 w-10 travel-stripe-h opacity-80"
              />
              <div className="font-display text-4xl md:text-5xl text-cream">
                <FlipNumber value={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[11px] font-bold tracking-[0.16em] uppercase text-cream/50">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* savings points + CTA */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
          <motion.ul
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } } }}
            className="space-y-4"
          >
            {SAVINGS_POINTS.map((p) => (
              <motion.li
                key={p}
                variants={{
                  hidden: { opacity: 0, x: -18 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="flex items-start gap-3 text-cream/80"
              >
                <span className="mt-0.5 w-5 h-5 rounded-sm bg-red flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed">{p}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-lg border border-red/25 bg-gradient-to-br from-red/15 to-transparent p-8 md:p-10 relative overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(200,16,46,0.22), transparent 70%)" }}
            />
            <div className="font-display text-3xl md:text-4xl text-cream leading-[1.05]">
              $250 BACK
              <br />
              <span className="text-red">ON AVERAGE, PER TRIP.</span>
            </div>
            <p className="mt-3 text-sm text-cream/70 leading-relaxed max-w-md">
              Group rates members can&apos;t get booking alone — negotiated
              hotels, coach seats, game blocks, and dinners, all in one
              sign-up.
            </p>
            <a
              href={CTA_URL}
              onClick={(e) => CTA_URL === "#" && e.preventDefault()}
              className="mt-6 inline-flex items-center gap-2 font-display uppercase tracking-wider text-base bg-red text-white px-8 py-4 rounded-sm shadow-[0_4px_28px_rgba(200,16,46,0.5)] transition-all duration-500 hover:bg-red-2 hover:shadow-[0_8px_44px_rgba(200,16,46,0.75)]"
            >
              Join and start saving
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}