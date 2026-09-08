"use client";

// Stadium night band — the second editorial photo moment (variant of PhotoBand
// kept separate for its dedicated art direction: night floodlights, taller crop)
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TravelStripe } from "@/components/brand";

export function StadiumBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative h-[68vh] min-h-[460px] overflow-hidden grain">
      <motion.div style={{ y }} className="absolute inset-0 scale-[1.25] img-grade">
        <img
          src="/images/gen/uatc-stadium-night.png"
          alt="Friday night under the stadium lights"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black/85 backdrop-blur-sm border border-cream/10 rounded-lg px-6 py-6 md:px-10 md:py-8 max-w-xl text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <TravelStripe className="w-12 h-[3px]" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-cream/60">
              Kickoff
            </span>
          </div>
          <div className="font-display text-2xl md:text-4xl text-cream leading-[1.05]">
            SATURDAY NIGHT
            <br />
            <span className="text-red">UNDER THE LIGHTS.</span>
          </div>
          <p className="mt-3 text-sm text-cream/70 leading-relaxed">
            Your class, section by section, on its feet as the band plays the
            fight song one more time.
          </p>
        </motion.div>
      </div>

      <TravelStripe className="absolute bottom-0 left-0 right-0 h-2.5 opacity-90" />
    </section>
  );
}