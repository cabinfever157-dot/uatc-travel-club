"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { TravelStripe } from "@/components/brand";
import { SCHOOLS, CONFS, type Conf } from "@/lib/uatc";

// Simplified US outline (stylized, low-poly — an art direction choice, not cartography)
const US_PATH =
  "M13.5,27.5 L12.2,35 L11,42 L12,48.5 L11.5,53 L15.5,54.5 L21,54 L26,52.5 L30,50.5 L33,49.5 L35,49 L37.5,50.5 L38.5,52.5 L39.5,55.5 L41.5,56.5 L45.5,58 L47,60 L46.5,63.5 L49,66.5 L52,67.5 L55.5,68 L58.5,69 L60.5,71 L63,71.5 L64.5,69.5 L67,68.5 L69,67.5 L70.5,65.5 L72,63 L74.5,61.5 L76.5,59.5 L79,58.5 L80.5,56.5 L83,54.5 L84,52 L85,49 L86.5,46.5 L86.5,44 L85.5,41 L84.5,38 L84,34.5 L85,31 L84,27.5 L82.5,24 L80.5,21 L78,19.5 L75,19 L72.5,20.5 L70.5,22.5 L68,24.5 L65,26 L62,26.5 L59,26.5 L56,26 L53,25.5 L50,24.5 L47,24 L44,23.5 L41,23.5 L38,23.5 L35,24 L32,24.5 L29,25.5 L26,26 L23,26.5 L20,26.5 L17,27 L15,27.5 Z";

function hubFor(conf: Conf) {
  // Alumni hub cities where motorcoaches originate, per conference
  if (conf === "SEC") return { x: 60, y: 63 }; // Atlanta-ish
  if (conf === "P12") return { x: 16, y: 40 }; // West coast
  return { x: 62.5, y: 41 }; // Big Ten belt (Chicago/Indy)
}

export function FollowYourTeam() {
  const [filter, setFilter] = useState<Conf | "ALL">("ALL");
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? SCHOOLS
        : SCHOOLS.filter((s) => s.conf === filter),
    [filter]
  );

  const activeSchool = active ? SCHOOLS.find((s) => s.id === active) : null;

  // One cinematic entry: routes draw from each conf hub to its schools
  const routes = useMemo(() => {
    const groups: { conf: Conf; schools: typeof SCHOOLS }[] = [
      { conf: "B1G", schools: SCHOOLS.filter((s) => s.conf === "B1G") },
      { conf: "SEC", schools: SCHOOLS.filter((s) => s.conf === "SEC") },
      { conf: "P12", schools: SCHOOLS.filter((s) => s.conf === "P12") },
    ];
    const paths: { d: string; conf: Conf; i: number }[] = [];
    for (const g of groups) {
      const hub = hubFor(g.conf);
      g.schools.forEach((s, i) => {
        const mx = (hub.x + s.x) / 2 + (i % 3 === 0 ? -3 : 2);
        const my = (hub.y + s.y) / 2 + (i % 2 === 0 ? 2.5 : -2.5);
        paths.push({
          d: `M${hub.x},${hub.y} Q${mx},${my} ${s.x},${s.y}`,
          conf: g.conf,
          i,
        });
      });
    }
    return paths;
  }, []);

  return (
    <section id="follow" ref={ref} className="relative bg-black py-20 md:py-28 overflow-hidden">
      {/* section eyebrow + heading */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TravelStripe className="w-16 h-[3px]" />
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-cream/60">
              Follow your team
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-cream leading-[1.02] max-w-3xl">
            EVERY GAME IS A ROAD TRIP
            <br />
            <span className="text-red">WHEN YOUR CREW GOES.</span>
          </h2>
          <p className="mt-4 text-cream/70 max-w-xl leading-relaxed">
            Motorcoaches from your city to the stadium. Tailgate spots reserved.
            Seats together. Pick your conference and find your people.
          </p>
        </motion.div>

        {/* Conference filter — utility-first (Big Man ruling) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {CONFS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setFilter(c.id);
                setActive(null);
              }}
              className={`font-display uppercase tracking-wider text-sm px-5 py-2.5 rounded-sm transition-all duration-500 ${
                filter === c.id
                  ? "bg-red text-white shadow-[0_4px_24px_rgba(200,16,46,0.55)]"
                  : "bg-white/5 text-cream/60 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Map + side panel */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.35fr_1fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <svg viewBox="0 0 100 78" className="w-full h-auto" role="img" aria-label="US map with alumni travel routes">
            {/* US silhouette */}
            <path
              d={US_PATH}
              fill="#141414"
              stroke="#2a2a2a"
              strokeWidth="0.4"
            />
            {/* grid graticule hints */}
            <g stroke="#222" strokeWidth="0.15" opacity="0.6">
              {[20, 35, 50, 65, 80].map((x) => (
                <line key={x} x1={x} y1="12" x2={x} y2="72" />
              ))}
              {[25, 40, 55].map((y) => (
                <line key={y} x1="10" y1={y} x2="90" y2={y} />
              ))}
            </g>

            {/* Cinematic route draw on entry — then hand control to user */}
            {inView &&
              routes.map((r) => (
                <motion.path
                  key={`${r.conf}-${r.i}`}
                  d={r.d}
                  fill="none"
                  stroke={
                    filter !== "ALL" && r.conf !== filter
                      ? "transparent"
                      : r.conf === "B1G"
                      ? "#c8102e"
                      : r.conf === "SEC"
                      ? "#e04b5e"
                      : "#f5f0e8"
                  }
                  strokeWidth="0.35"
                  strokeDasharray="1.6 1.1"
                  opacity="0.55"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.4,
                    delay: 0.7 + r.i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}

            {/* School pins */}
            {visible.map((s, i) => (
              <motion.g
                key={s.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 15,
                  delay: 0.9 + i * 0.045,
                }}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(s.id)}
              >
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={active === s.id ? "1.9" : "1.25"}
                  fill={s.c1}
                  stroke={s.c2}
                  strokeWidth="0.5"
                  style={{ transition: "r 0.35s cubic-bezier(0.16,1,0.3,1)" }}
                />
                {active === s.id && (
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r="3.1"
                    fill="none"
                    stroke={s.c1}
                    strokeWidth="0.3"
                    opacity="0.7"
                  />
                )}
              </motion.g>
            ))}
          </svg>
          <p className="mt-2 text-xs text-cream/40 tracking-wide">
            Tap a pin to see trips from that school&apos;s alumni network.
          </p>
        </motion.div>

        {/* Side panel — school detail */}
        <div className="relative min-h-[210px]">
          <AnimatePresence mode="wait">
            {activeSchool ? (
              <motion.div
                key={activeSchool.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-md border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-sm overflow-hidden shrink-0"
                    style={{ background: activeSchool.c1 }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="48" fill={activeSchool.c1} />
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke={activeSchool.c2}
                        strokeWidth="5.5"
                      />
                      <path
                        d="M30 26 h9 v32 c0 4 1.5 6 4 7.5 c2.5 1.5 4.5 2 7 2 s4.5 -0.5 7 -2 c2.5 -1.5 4 -3.5 4 -7.5 v-32 h9 v33 c0 8 -2.5 13.5 -7 16.5 c-4 2.7 -8.5 4 -13 4 s-9 -1.3 -13 -4 c-4.5 -3 -7 -8.5 -7 -16.5 z"
                        fill={activeSchool.c2}
                      />
                      <rect x="27" y="21" width="15" height="6" fill={activeSchool.c2} />
                      <rect x="58" y="21" width="15" height="6" fill={activeSchool.c2} />
                    </svg>
                  </div>
                  <div>
                    <div className="font-display text-2xl text-cream leading-tight">
                      {activeSchool.name}
                    </div>
                    <div className="text-xs text-cream/50 tracking-wider uppercase">
                      {activeSchool.conf === "B1G"
                        ? "Big Ten"
                        : activeSchool.conf === "SEC"
                        ? "SEC"
                        : "Pac-12"}{" "}
                      · {activeSchool.city}
                    </div>
                  </div>
                </div>
                <p className="text-cream/70 text-sm leading-relaxed mb-5">
                  Away-game weekends, tailgate packages, and reunion trips
                  organized with the {activeSchool.name} alumni network. Seats
                  held for members first.
                </p>
                <a
                  href="#adventures"
                  className="inline-flex items-center gap-2 text-sm font-bold text-red hover:text-[#e04b5e] transition-colors duration-300"
                >
                  View {activeSchool.name} trips
                  <span aria-hidden>→</span>
                </a>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-md border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="font-display text-xl text-cream/80 mb-2">
                  24 SCHOOLS. 3 CONFERENCES.
                </div>
                <p className="text-cream/60 text-sm leading-relaxed">
                  Hover or tap any pin. Filter by conference to see where your
                  alumni network travels this season.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(["B1G", "SEC", "P12"] as Conf[]).map((c) => {
                    const n = SCHOOLS.filter((s) => s.conf === c).length;
                    return (
                      <span
                        key={c}
                        className="text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-cream/60"
                      >
                        {c === "B1G" ? "Big Ten" : c === "SEC" ? "SEC" : "Pac-12"} · {n}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Travel stripe seam into next band */}
      <TravelStripe className="absolute bottom-0 left-0 right-0 h-2.5 opacity-90" />
    </section>
  );
}