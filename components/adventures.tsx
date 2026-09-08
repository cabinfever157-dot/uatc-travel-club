"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TravelStripe } from "@/components/brand";
import { TRIPS, SCHOOLS, CTA_URL, type Trip } from "@/lib/uatc";

function TicketStub({ trip, i }: { trip: Trip; i: number }) {
  const school = trip.schoolId
    ? SCHOOLS.find((s) => s.id === trip.schoolId)
    : undefined;
  const stripeA = school?.c1 ?? "#c8102e";
  const stripeB = school?.c2 ?? "#faf7f0";

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
      // ticket stub: asymmetric tilt per index (bento rule), hover = tear-off lift
      whileHover={{ y: -10, rotate: i % 2 === 0 ? -1.1 : 1.1 }}
      className={`group relative bg-cream text-ink rounded-lg overflow-hidden shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition-shadow duration-500 hover:shadow-[0_24px_64px_rgba(0,0,0,0.45)] ${
        trip.featured ? "lg:col-span-2 lg:row-span-1" : ""
      }`}
      style={{ rotate: i % 2 === 0 ? -0.7 : 0.7 }}
    >
      {/* college-color edge band = Travel Stripe in school colors */}
      <TravelStripe a={stripeA} b={stripeB} className="h-2 w-full" />

      <div className={trip.featured ? "grid md:grid-cols-2" : ""}>
        {/* image with permanent grade (no white-box) + subtle hover effect */}
        <div className={`img-grade overflow-hidden ${trip.featured ? "h-56 md:h-full min-h-[240px]" : "h-44"}`}>
          <img
            src={trip.image}
            alt={trip.title}
            loading="lazy"
            className="w-full h-full object-cover relative z-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:brightness-[1.08] group-hover:saturate-[1.15]"
          />
          {/* one-shot accent scanline sweep on hover */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        <div className={`p-6 md:p-7 flex flex-col ${trip.featured ? "" : "flex-1"}`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span
              className="text-[11px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-sm"
              style={{ background: stripeA, color: stripeB }}
            >
              {trip.tag}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-ink/50">
              {trip.days} {trip.days === 2 ? "days" : "days"} · {trip.dates}
            </span>
          </div>

          <h3 className="font-display text-2xl md:text-[1.7rem] leading-[1.05] text-ink">
            {trip.title.toUpperCase()}
          </h3>
          <p className="mt-1 text-xs font-bold tracking-wider uppercase text-ink/45">
            {trip.from} → {trip.to}
          </p>

          <p className="mt-3.5 text-sm text-ink/70 leading-relaxed flex-1">
            {trip.blurb}
          </p>

          {/* perforation divider */}
          <div className="perforation my-4" style={{ "--notch": "#d9d2c2" } as React.CSSProperties} />

          {/* footer row: capacity meter + CTA */}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <motion.span
                  key={trip.seatsLeft}
                  className="font-display text-xl"
                  style={{ color: stripeA }}
                >
                  {trip.seatsLeft}
                </motion.span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
                  of {trip.seats} seats left
                </span>
              </div>
              {/* capacity meter */}
              <div className="mt-1.5 h-1.5 w-32 rounded-full bg-ink/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${((trip.seats - trip.seatsLeft) / trip.seats) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: stripeA }}
                />
              </div>
            </div>
            <a
              href={CTA_URL}
              onClick={(e) => CTA_URL === "#" && e.preventDefault()}
              className="shrink-0 inline-flex items-center gap-1.5 font-display uppercase tracking-wider text-sm px-5 py-2.5 rounded-sm transition-all duration-500"
              style={{ background: stripeA, color: stripeB }}
            >
              Hold a seat
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Adventures() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section id="adventures" ref={ref} className="relative bg-cream py-20 md:py-28 overflow-hidden text-ink">
      {/* light band gets its own subtle line texture */}
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
              Alumni adventures
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-ink leading-[1.02] max-w-3xl">
            PLANNED FOR YOU.
            <br />
            <span className="text-red">Priced for members.</span>
          </h2>
          <p className="mt-4 text-ink/70 max-w-xl leading-relaxed">
            Reunions, weekend getaways, and once-a-season game trips — limited
            seats, organized end to end, and always with your people.
          </p>
        </motion.div>

        {/* Asymmetric stub grid: featured spans 2 cols */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {TRIPS.map((t, i) => (
            <TicketStub key={t.id} trip={t} i={i} />
          ))}

          {/* Join tile fills the asymmetric grid — uses the adventures photo */}
          <motion.a
            href={CTA_URL}
            onClick={(e) => CTA_URL === "#" && e.preventDefault()}
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.8, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-black text-cream rounded-lg overflow-hidden min-h-[300px] flex"
          >
            <img
              src="/images/gen/uatc-adventures.png"
              alt="Alumni friends walking a small-town main street at dusk"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-45 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-60 group-hover:scale-[1.05]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
            <div className="relative p-7 flex flex-col justify-between w-full">
              <div>
                <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-cream/60 mb-3">
                  New trips drop monthly
                </div>
                <div className="font-display text-2xl leading-[1.05] text-cream">
                  MEMBERS SEE
                  <br />
                  EVERY TRIP FIRST.
                </div>
                <p className="mt-3 text-sm text-cream/70 leading-relaxed">
                  Seats are held for members 7 days before public release. The
                  good ones never make it that far.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 font-display uppercase tracking-wider text-sm text-red group-hover:text-[#e04b5e] transition-colors duration-500">
                Join the club
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}