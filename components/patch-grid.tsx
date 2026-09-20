"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SCHOOLS, GRID_SCHOOL_IDS } from "@/lib/uatc";

// THE VARSITY PATCH DROP v2 — Big Man spec + Damon ruling:
// NO colored crest is ever visible during flight. Tiles fly in showing ONLY
// the neutral cream patch backing (single visible layer — no 3D backface
// culling involved). After ALL 12 are seated, a stadium flip wave runs
// corner->center: each tile folds to 90deg, swaps backing->crest, folds open.

const CHOREO: Array<[number, number, number, number, number, number]> = [
  [-760, -120, -80, 12, -6, 0.7],
  [-880, 130, -60, -11, 7, 0.72],
  [-640, -60, 90, 9, -6, 0.8],
  [-820, 140, -80, -13, 8, 0.7],
  [-700, -150, 70, 12, -7, 0.72],
  [-700, 90, -110, -10, 6, 0.72],
  [-880, -150, -40, -12, -6, 0.68],
  [-680, 60, 100, 10, 6, 0.74],
  [-880, -120, 100, 13, -8, 0.68],
  [-680, 150, 60, -10, -8, 0.76],
  [-700, -110, 120, 11, 7, 0.72],
  [-880, -40, -120, -14, 7, 0.68],
];

const FLIP_ORDER = [0, 3, 8, 11, 1, 2, 9, 10, 4, 7, 5, 6];

const LAUNCH_BASE = 0.82;
const WAVE_GAP = 0.22;
const TILE_GAP = 0.07;
const FLY_DUR = 0.6;
const SETTLE_DUR = 0.2;
const FLIP_BASE = 1.72;
const FLIP_DUR = 0.38;
const FLIP_STAGGER = 0.05;

export function PatchGrid() {
  const root = useRef<HTMLDivElement>(null);
  const gridSchools = GRID_SCHOOL_IDS.map((id) => SCHOOLS.find((s) => s.id === id)!);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // assembled grid immediately; crest visible, backing hidden
        gsap.set(".patch-back", { autoAlpha: 0 });
        return;
      }

      const isMobile = window.innerWidth <= 768;
      const m = isMobile ? 0.5 : 1;
      const tiles = gsap.utils.toArray<HTMLElement>(".patch-tile");
      if (!tiles.length) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tiles.forEach((tile, i) => {
        const [z, x, y, rz, ry, s] = CHOREO[i];
        const delay = LAUNCH_BASE + Math.floor(i / 3) * WAVE_GAP + (i % 3) * TILE_GAP;

        tl.fromTo(
          tile,
          {
            opacity: 0,
            z: z * m,
            x: x * m,
            y: y * m,
            rotationZ: rz * m,
            rotationY: ry * m,
            scale: s,
          },
          {
            opacity: 1,
            z: 25,
            x: 0,
            y: 0,
            rotationZ: i % 2 === 0 ? -2 : 2,
            rotationY: 0,
            scale: 1.035,
            duration: FLY_DUR,
          },
          delay
        );

        tl.to(
          tile,
          { z: 0, scale: 1, rotationZ: 0, duration: SETTLE_DUR, ease: "power2.inOut" },
          delay + FLY_DUR
        );
      });

      // STADIUM FLIP WAVE — fold to 90, swap layers, fold open.
      FLIP_ORDER.forEach((idx, k) => {
        const inner = tiles[idx].querySelector(".patch-inner") as HTMLElement;
        const front = tiles[idx].querySelector(".patch-front") as HTMLElement;
        const back = tiles[idx].querySelector(".patch-back") as HTMLElement;
        const t0 = FLIP_BASE + k * FLIP_STAGGER;
        const half = FLIP_DUR / 2;

        tl.to(inner, { scaleX: 0, duration: half, ease: "power2.in" }, t0)
          .call(() => {
            back.style.visibility = "hidden";
            front.style.visibility = "visible";
          }, [], t0 + half)
          .fromTo(inner, { scaleX: -1 }, { scaleX: 1, duration: half, ease: "power2.out" }, t0 + half);
      });

      // FINAL LOCK + clear will-change
      const lockT = FLIP_BASE + FLIP_ORDER.length * FLIP_STAGGER + 0.15;
      tl.call(() => {
        tiles.forEach((t) => (t.style.willChange = "auto"));
      }, [], lockT + 0.3);
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative pb-10">
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto lg:ml-auto lg:mr-0">
        {gridSchools.map((s, i) => (
          <div key={s.id} className="patch-tile aspect-square rounded-md overflow-hidden relative">
            {/* FRONT = school crest — hidden until its flip */}
            <div
              className="patch-front absolute inset-0 rounded-md overflow-hidden"
              style={{ background: s.c1, visibility: "hidden" }}
            >
              <img
                src={`/images/gen/logos/logo-tile${String(i + 1).padStart(2, "0")}.png`}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            {/* BACK = cream/silver patch backing — the ONLY thing visible until flip */}
            <div
              className="patch-back absolute inset-0 rounded-md"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #e9dfc8 0 6px, #e2d6ba 6px 12px)",
                boxShadow:
                  "inset 0 0 0 4px rgba(120,115,105,0.35), inset 0 0 24px rgba(0,0,0,0.10)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display select-none"
                  style={{ fontSize: "2.6rem", color: "rgba(120,115,105,0.45)" }}
                >
                  U
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}