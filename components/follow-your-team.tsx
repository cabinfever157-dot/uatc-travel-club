"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { feature, merge } from "topojson-client";
import type {
  GeometryCollection,
  MultiPolygon as TopoMultiPolygon,
  Polygon as TopoPolygon,
  Topology,
} from "topojson-specification";
import type { Feature, MultiPolygon, Polygon, Position } from "geojson";
import usAtlas from "us-atlas/states-10m.json";
import { TravelStripe } from "@/components/brand";
import { CTA_URL, SCHOOLS, CONFS, type Conf } from "@/lib/uatc";

type StateProperties = { name?: string };
type UsTopology = Topology<{
  states: GeometryCollection<StateProperties>;
  nation: GeometryCollection<StateProperties>;
}>;

const MAP = {
  left: 7,
  top: 8,
  width: 86,
  height: 60,
  minLon: -125,
  maxLon: -66.5,
  minLat: 24,
  maxLat: 50,
};

function projectPoint([longitude, latitude]: Position) {
  return {
    x:
      MAP.left +
      ((longitude - MAP.minLon) / (MAP.maxLon - MAP.minLon)) * MAP.width,
    y:
      MAP.top +
      ((MAP.maxLat - latitude) / (MAP.maxLat - MAP.minLat)) * MAP.height,
  };
}

function ringToPath(ring: Position[]) {
  return ring
    .map((point, index) => {
      const { x, y } = projectPoint(point);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ") + " Z";
}

function geometryToPath(geometry: Polygon | MultiPolygon) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon) => polygon.map(ringToPath)).join(" ");
}

// Real Census-derived state geometry, excluding Alaska, Hawaii, and territories
// so the travel network can use one legible contiguous-U.S. artboard.
const topology = usAtlas as unknown as UsTopology;
const excludedStateIds = new Set(["02", "15", "60", "66", "69", "72", "78"]);
const stateGeometries = topology.objects.states.geometries.filter(
  (geometry): geometry is TopoPolygon<StateProperties> | TopoMultiPolygon<StateProperties> =>
    (geometry.type === "Polygon" || geometry.type === "MultiPolygon") &&
    !excludedStateIds.has(String(geometry.id).padStart(2, "0"))
);
const US_PATH = geometryToPath(merge(topology, stateGeometries));
const STATE_PATHS = stateGeometries.map((geometry) => {
  const stateFeature = feature(topology, geometry) as Feature<
    Polygon | MultiPolygon,
    StateProperties
  >;
  return {
    id: String(geometry.id),
    d: geometryToPath(stateFeature.geometry),
  };
});

const TRAVEL_NODES = [
  { x: 11, y: 13.4, delay: 0.2 },
  { x: 10.5, y: 31, delay: 3.4 },
  { x: 16.8, y: 44.8, delay: 1.7 },
  { x: 28, y: 48, delay: 4.8 },
  { x: 31.5, y: 27, delay: 2.5 },
  { x: 40.5, y: 33, delay: 5.4 },
  { x: 48.5, y: 50, delay: 0.9 },
  { x: 53.7, y: 19.6, delay: 3.9 },
  { x: 56.7, y: 53.1, delay: 2.1 },
  { x: 62, y: 26.7, delay: 5.8 },
  { x: 66.7, y: 45.5, delay: 1.2 },
  { x: 73, y: 63.5, delay: 4.4 },
  { x: 77.7, y: 33.4, delay: 2.9 },
  { x: 81.3, y: 29.8, delay: 0.5 },
  { x: 86, y: 22.5, delay: 5.1 },
];

const NATIONAL_ROUTES = [
  { id: "nw-mountain", d: "M11,13.4 Q23,16 31.5,27", delay: 0.2 },
  { id: "west-coast", d: "M10.5,31 Q8.5,39 16.8,44.8", delay: 1.1 },
  { id: "southwest", d: "M16.8,44.8 Q22,48 28,48", delay: 2 },
  { id: "mountain-plains", d: "M31.5,27 Q36,29 40.5,33", delay: 2.9 },
  { id: "mountain-texas", d: "M40.5,33 Q43,43 48.5,50", delay: 3.8 },
  { id: "north-central", d: "M53.7,19.6 Q58,21 62,26.7", delay: 4.7 },
  { id: "plains-midwest", d: "M40.5,33 Q52,26 62,26.7", delay: 0.7 },
  { id: "texas-gulf", d: "M48.5,50 Q53,54 56.7,53.1", delay: 1.6 },
  { id: "gulf-southeast", d: "M56.7,53.1 Q62,49 66.7,45.5", delay: 2.5 },
  { id: "southeast-florida", d: "M66.7,45.5 Q70,52 73,63.5", delay: 3.4 },
  { id: "midwest-capital", d: "M62,26.7 Q70,29 77.7,33.4", delay: 4.3 },
  { id: "capital-northeast", d: "M77.7,33.4 Q80,31 81.3,29.8", delay: 5.2 },
  { id: "northeast-newengland", d: "M81.3,29.8 Q85,27 86,22.5", delay: 1.3 },
  { id: "coast-to-coast", d: "M10.5,31 Q47,12 81.3,29.8", delay: 3.1 },
  { id: "southern-crossing", d: "M16.8,44.8 Q47,59 73,63.5", delay: 4.9 },
];

export function FollowYourTeam() {
  const [filter, setFilter] = useState<Conf | "ALL">("ALL");
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? SCHOOLS
        : SCHOOLS.filter((s) => s.conf === filter),
    [filter]
  );

  const activeSchool = active ? SCHOOLS.find((s) => s.id === active) : null;

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
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-cream/60">
              Alumni travel network
            </span>
          </div>

          <div className="relative overflow-hidden rounded-md border border-white/[0.06] bg-[#0c0c0c] px-1 py-3 shadow-[0_26px_80px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_38%,rgba(200,16,46,0.16),transparent_30%),radial-gradient(circle_at_75%_55%,rgba(250,247,240,0.07),transparent_28%)]" />
            <svg
              viewBox="0 0 100 78"
              className="relative w-full h-auto"
              role="img"
              aria-label="Animated map of the contiguous United States with alumni travel routes"
            >
              <defs>
                <clipPath id="continental-us-clip">
                  <path d={US_PATH} />
                </clipPath>
                <filter id="route-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="0.55" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <pattern id="map-dots" width="2.2" height="2.2" patternUnits="userSpaceOnUse">
                  <circle cx="0.6" cy="0.6" r="0.16" fill="#faf7f0" opacity="0.18" />
                  <circle cx="1.7" cy="1.7" r="0.13" fill="#c8102e" opacity="0.28" />
                </pattern>
              </defs>

              {/* Continental silhouette, halftone texture, and restrained state-like seams. */}
              <path
                d={US_PATH}
                fill="#151515"
                fillRule="evenodd"
                stroke="#77736d"
                strokeWidth="0.38"
              />
              <path d={US_PATH} fill="url(#map-dots)" fillRule="evenodd" opacity="0.9" />
              <g
                clipPath="url(#continental-us-clip)"
                fill="none"
                stroke="#faf7f0"
                strokeWidth="0.14"
                opacity="0.13"
              >
                {STATE_PATHS.map((state) => (
                  <path key={state.id} d={state.d} fillRule="evenodd" />
                ))}
              </g>

              {/* Soft two-color transfer nodes fade through different regions. */}
              {inView &&
                TRAVEL_NODES.map((node, i) => (
                  <motion.g
                    key={`${node.x}-${node.y}`}
                    initial={{ opacity: 0 }}
                    animate={
                      reduceMotion
                        ? { opacity: 0.65 }
                        : { opacity: [0, 0.9, 0.9, 0], scale: [0.7, 1, 1.15, 0.8] }
                    }
                    transition={{
                      duration: reduceMotion ? 0.01 : 4.8,
                      delay: reduceMotion ? 0 : node.delay,
                      repeat: reduceMotion ? 0 : Infinity,
                      repeatDelay: reduceMotion ? 0 : 2.2,
                      ease: "easeInOut",
                    }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  >
                    <circle cx={node.x} cy={node.y} r="1.65" fill="none" stroke={i % 2 ? "#faf7f0" : "#c8102e"} strokeWidth="0.22" opacity="0.45" />
                    <circle cx={node.x} cy={node.y} r="0.7" fill={i % 2 ? "#c8102e" : "#faf7f0"} />
                    <circle cx={node.x} cy={node.y} r="0.25" fill={i % 2 ? "#faf7f0" : "#c8102e"} />
                  </motion.g>
                ))}

              {/* National routes draw, hold, and dissolve across the whole country. */}
              <g filter="url(#route-glow)">
                {inView &&
                  NATIONAL_ROUTES.map((route, i) => (
                      <motion.path
                        key={route.id}
                        d={route.d}
                        fill="none"
                        stroke={i % 3 === 0 ? "#faf7f0" : i % 2 === 0 ? "#e45a6c" : "#c8102e"}
                        strokeWidth={i % 5 === 0 ? "0.48" : "0.3"}
                        strokeLinecap="round"
                        strokeDasharray={i % 3 === 0 ? "2.2 1.2" : "1.1 1.7"}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={
                          reduceMotion
                            ? { pathLength: 1, opacity: 0.42 }
                            : {
                                pathLength: [0, 1, 1, 1],
                                pathOffset: [0, 0, 0.03, 0.08],
                                opacity: [0, 0.62, 0.48, 0],
                              }
                        }
                        transition={{
                          duration: reduceMotion ? 0.01 : 6.4,
                          delay: reduceMotion ? 0 : route.delay,
                          repeat: reduceMotion ? 0 : Infinity,
                          repeatDelay: reduceMotion ? 0 : 1.3,
                          ease: [0.45, 0, 0.55, 1],
                          times: [0, 0.3, 0.72, 1],
                        }}
                      />
                  ))}
              </g>

              {/* School pins retain their two-color identity. */}
              {visible.map((s, i) => (
                <motion.g
                  key={s.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 15,
                    delay: reduceMotion ? 0 : 0.9 + i * 0.045,
                  }}
                  style={{ cursor: "pointer", transformOrigin: `${s.x}px ${s.y}px` }}
                  onMouseEnter={() => setActive(s.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(s.id)}
                >
                  <circle cx={s.x} cy={s.y} r={active === s.id ? "2.45" : "1.7"} fill={s.c1} opacity="0.2" />
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={active === s.id ? "1.7" : "1.08"}
                    fill={s.c1}
                    stroke={s.c2}
                    strokeWidth="0.45"
                    style={{ transition: "r 0.35s cubic-bezier(0.16,1,0.3,1)" }}
                  />
                  <circle cx={s.x} cy={s.y} r="0.25" fill={s.c2} />
                  {active === s.id && (
                    <circle cx={s.x} cy={s.y} r="3.2" fill="none" stroke={s.c2} strokeWidth="0.28" opacity="0.78" />
                  )}
                </motion.g>
              ))}
            </svg>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.16em] text-cream/40">
            <span>Tap a two-color pin to explore</span>
            <span className="hidden sm:inline">Coast-to-coast alumni routes</span>
          </div>
        </motion.div>

        {/* Side panel — school detail */}
        <div className="relative flex flex-col gap-4">
          <div className="min-h-[210px]">
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
                  42 FOOTBALL SCHOOLS. 3 CONFERENCES.
                </div>
                <p className="text-cream/60 text-sm leading-relaxed">
                  Explore 42 football schools across three conferences. Choose a
                  conference, find your school, and start planning your next
                  game-day getaway.
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-md border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-red/15 blur-3xl transition-opacity duration-700 group-hover:opacity-90" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/80 to-transparent" />
            <div className="relative">
              <div className="font-display text-xl text-cream mb-2">
                MORE THAN GAME DAY.
              </div>
              <p className="text-cream/60 text-sm leading-relaxed">
                Reconnect with classmates. Follow your team. Turn rivalry weekends,
                bowl games and reunions into trips worth remembering.
              </p>
              <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                {["Rivalry Weekends", "Bowl Trips", "Alumni Reunions", "Group Getaways"].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-sm border border-white/[0.08] bg-black/25 px-3 py-2 text-xs font-semibold tracking-wide text-cream/75"
                  >
                    <span className="h-1.5 w-1.5 rotate-45 bg-red shadow-[0_0_10px_rgba(200,16,46,0.7)]" />
                    {feature}
                  </div>
                ))}
              </div>
              <a
                href={CTA_URL}
                onClick={(event) => CTA_URL === "#" && event.preventDefault()}
                className="flex w-full items-center justify-between rounded-sm bg-red px-5 py-3 font-display text-sm uppercase tracking-[0.12em] text-white shadow-[0_8px_30px_rgba(200,16,46,0.32)] transition-all duration-300 hover:bg-red-2 hover:shadow-[0_10px_36px_rgba(200,16,46,0.5)]"
              >
                <span>Join the Club — Free</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Travel stripe seam into next band */}
      <TravelStripe className="absolute bottom-0 left-0 right-0 h-2.5 opacity-90" />
    </section>
  );
}
