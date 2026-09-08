"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SCHOOLS, GRID_SCHOOL_IDS } from "@/lib/uatc";

// THE VARSITY PATCH DROP — Big Man spec 2026-09-08.
// 12 patches fly in from z-depth FACE-DOWN (cream patch backing showing),
// slam into the 4x3 wall with overshoot-settle, then flip 180deg
// corner->center in a stadium wave, igniting the 12 school-color crests.
//
// Deterministic choreography table (no Math.random at render -> no hydration
// mismatch). Transform/opacity only. will-change cleared after settle.
// Reduced-motion: fully assembled colored grid, static.

// Per-tile start values [z, x, y, rotZ, rotX, rotY, scale] — art-directed chaos.
const CHOREO: Array<[number, number, number, number, number, number, number]> = [
  [-760, -120, -80, 12, -6, 10, 0.7],   // 0  IU
  [-880, 130, -60, -11, 7, -9, 0.72],   // 1  UM
  [-640, -60, 90, 9, -6, 10, 0.8],      // 2  OSU
  [-820, 140, -80, -13, 8, -9, 0.7],    // 3  PSU
  [-700, -150, 70, 12, -7, 8, 0.72],    // 4  UW
  [-700, 90, -110, -10, 6, -11, 0.72],  // 5  iowa
  [-880, -150, -40, -12, -6, 11, 0.68], // 6  neb
  [-680, 60, 100, 10, 6, -8, 0.74],     // 7  ill
  [-880, -120, 100, 13, -8, -12, 0.68], // 8  ala
  [-680, 150, 60, -10, -8, 9, 0.76],    // 9  uga
  [-700, -110, 120, 11, 7, -10, 0.72],  // 10 ucla
  [-880, -40, -120, -14, 7, 12, 0.68],  // 11 ore
];

// stadium flip wave: outside corners -> center
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
        // static assembled grid: force fronts visible, no timeline
        gsap.set(".patch-tile", { rotationY: 0, opacity: 1 });
        return;
      }

      const isMobile = window.innerWidth <= 768;
      const m = isMobile ? 0.5 : 1; // travel multiplier
      const tiles = gsap.utils.toArray<HTMLElement>(".patch-tile");
      if (!tiles.length) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tiles.forEach((tile, i) => {
        const [z, x, y, rz, rx, ry, s] = CHOREO[i];
        const delay = LAUNCH_BASE + Math.floor(i / 3) * WAVE_GAP + (i % 3) * TILE_GAP;

        // FACE-DOWN ARRIVAL: rotationY ends at 180 (back face showing)
        tl.fromTo(
          tile,
          {
            opacity: 0,
            z: z * m,
            x: x * m,
            y: y * m,
            rotationZ: rz * m,
            rotationX: rx * m,
            rotationY: ry * m,
            scale: s,
          },
          {
            opacity: 1,
            z: 25,
            x: 0,
            y: 0,
            rotationZ: i % 2 === 0 ? -2 : 2,
            rotationX: 0,
            rotationY: 180,
            scale: 1.035,
            duration: FLY_DUR,
          },
          delay
        );

        // SETTLE: overshoot -> exact slot
        tl.to(
          tile,
          {
            z: 0,
            scale: 1,
            rotationZ: 0,
            duration: SETTLE_DUR,
            ease: "power2.inOut",
          },
          delay + FLY_DUR
        );
      });

      // STADIUM FLIP WAVE: 180 -> 0 corner->center, crest ignites
      FLIP_ORDER.forEach((idx, k) => {
        tl.to(
          tiles[idx],
          {
            rotationY: 0,
            duration: FLIP_DUR,
            ease: "power2.inOut",
          },
          FLIP_BASE + k * FLIP_STAGGER
        );
      });

      // FINAL LOCK
      tl.to(
        tiles,
        { scale: 1, duration: 0.24, ease: "power2.out" },
        FLIP_BASE + FLIP_ORDER.length * FLIP_STAGGER + 0.1
      );

      // clear will-change
      tl.call(
        () => tiles.forEach((t) => (t.style.willChange = "auto")),
        [],
        FLIP_BASE + FLIP_ORDER.length * FLIP_STAGGER + 0.35
      );

      // set will-change during intro for compositor acceleration
      gsap.set(tiles, { willChange: "transform" } as never);
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative pb-10 [perspective:1200px]">
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto lg:ml-auto lg:mr-0">
        {gridSchools.map((s, i) => (
          <div
            key={s.id}
            className="patch-tile aspect-square rounded-md overflow-hidden relative [transform-style:preserve-3d]"
          >
            {/* FRONT = school crest (revealed by flip) */}
            <div
              className="absolute inset-0 [backface-visibility:hidden] rounded-md overflow-hidden"
              style={{ background: s.c1 }}
            >
              <img
                src={`/images/gen/logos/logo-tile${String(i + 1).padStart(2, "0")}.png`}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            {/* BACK = cream/silver patch backing, rotated 180 so it shows when tile is face-down */}
            <div
              className="absolute inset-0 rounded-md [backface-visibility:hidden]"
              style={{
                transform: "rotateY(180deg)",
                background:
                  "repeating-linear-gradient(45deg, #f4ead6 0 6px, #efe3cb 6px 12px)",
                boxShadow: "inset 0 0 0 4px rgba(150,145,135,0.4), inset 0 0 24px rgba(0,0,0,0.08)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display select-none"
                  style={{ fontSize: "3rem", color: "rgba(150,145,135,0.5)" }}
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