# DESIGN.md — Ultimate Alumni Travel Club (UATC)

## Direction sources
- Greg's meeting notes (2026-09-08, in PROJECT_BRIEF.md): collegiate/alumni, energetic, fun, U.S.-focused, conversion-first (savings → Join → Sign In)
- Greg's color direction: black + red base, college colors woven throughout
- Greg's signature visual: Andy Warhol-style grid of the UATC logo in different college color combos ("people recognize their school")
- Greg's key section: "Follow Your Team" — U.S. map / Big Ten / Pac-12 / SEC, alumni traveling to games
- Current site (uatc-travel-club.netlify.app) as content baseline; its navy/champagne luxury direction is REPLACED

## Palette (functional names — brand core is 3, plus a sanctioned guest array)
- primary (action/brand red): #C8102E — collegiate athletic red (reads across conferences; NOT any single school's red so it stays UATC's own)
- surface-dark: #0A0A0A (black) — hero, map, CTA bands
- surface-light: #FAF7F0 (cream) — adventures, savings, light bands (breaks the dark-only pattern per standing rule)
- text-on-dark: #FFFFFF / rgba(255,255,255,.6+) (min /60 secondary, /80 body — WCAG AA)
- text-on-light: #141414
- GUEST PALETTE (content, not decoration): college two-color pairs used ONLY in the Warhol logo grid, map pins, and per-section accent bands — e.g. IU cream#EEE5C8+crimson#9E1B32, Michigan maize#FFCB05+blue#00274C, OSU scarlet#BB0000+gray#666666, Alabama crimson#9E1B32... (final school set TBD via Big Man consult). Guest colors are DATA (school recognition), never random accent fills.

## Type (exactly 2 fonts)
- Display: Anton (tall condensed athletic — stadium/scoreboard energy) — headlines, section labels, oversized numerals
- Body: Archivo (grotesque with athletic character, full weight range) — body, UI labels, nav
- Scale ratio: 1.333 (perfect fourth) — 12 / 16 / 21 / 28 / 37 / 50 / 67px; hero clamp(2.8rem, 6vw, 5.5rem) per standing size ceiling
- Pending Big Man reaction: Anton vs Archivo Black for display (Anton = instant athletic read, Archivo Black = more premium/editorial)

## Layout primitive (ONE repeated idea)
- **Ticket stubs on full-bleed bands.** Every travel package / game trip / reunion is a TICKET-STUB card: notched/perforated edge, college-color edge band, big condensed destination type, "limited capacity" seat count. Sections are full-bleed horizontal bands (scoreboard rhythm) — alternating black/cream. The Warhol logo grid and the U.S. map are the two full-width art moments between bands. No uniform card grids — stubs tilt/offset, bento-asymmetric where 3+ appear.

## Motion language
- Ease: expo.out (0.16,1,0.3,1) reveals; power2.inOut transitions; spring {stiffness 120, damping 10} for nav entrance (AquariumPremium pattern)
- Durations: 0.4 / 0.8 / 1.2s scale; stagger 0.08-0.1s (energetic — faster than default 0.25)
- Allowed: entrance reveals (blur-fade, slide-up, staggered), hover feedback (premium, one-shot), scroll-linked sections (map routes draw on scroll, Warhol grid color-flood on scroll), scoreboard counter flips
- Banned motion: bouncing buttons, wiggling icons, infinite loops on buttons, gradient-text animation, TextReveal/glimmer on headlines
- Every section animates in (nothing just appears); reduced-motion = static + visible

## Signature moments (per-section effects budget — one each)
1. **Hero:** Warhol logo grid color-flood — logo tiles stagger in monochrome, then college colors flood the grid row-by-row on scroll/load. THE site signature.
2. **Follow Your Team:** U.S. map (SVG) with conference filter (All / Big Ten / SEC / Pac-12) — college-color pins, routes from alumni hub cities to game sites draw on scroll. Hover pin = school + next big trip.
3. **Alumni Adventures:** ticket-stub cards with hover tear-off reveal (stub lifts, perforation shimmers, capacity counter ticks down) — IU→Branson example featured.
4. **Stats/savings band:** scoreboard-flip counters (travel savings $, alumni travelers, trips run).
5. **Join band:** conversion moment — savings math → Join button → Sign In link, both wired to Access (URL pending).

## Light-band plan (no-dark-only rule)
- Dark (black): hero + Warhol grid, Follow Your Team map, final Join CTA band
- Light (cream): Alumni Adventures stubs, savings/stats scoreboard, how-it-works, footer
- Red used as band accent/edge + CTA fills, never a full-page background

## Copy voice
- Energetic, fun, U.S.-collegiate. "Your crew. Your colors. Your next trip." tone. Locations + what you DO (tailgate, reunion, game day) — no invented anecdotes (standing rule). Savings language concrete: "Members save $X per trip."

## Banned (min 3 — project-specific)
1. Navy/champagne luxury palette + international-luxury copy tone ("curated luxury experiences", Santorini-first framing) — the OLD direction; zero residue allowed
2. Purple-blue gradient heroes, glassmorphism as decoration, BorderBeam, magnetic buttons (standing bans)
3. Empty decorative outlines/orbits (reads as loading spinner — Damon 9/8)
4. Uniform equal 3-column card grids — stubs must be asymmetric/tilted
5. Guest college colors used as RANDOM accent fills outside the grid/map/bands — school colors are content, not theme
6. Text overlaid on images (standing rule); parallax containers with colored backgrounds
7. Orphaned words in any text block (G162); hero font over 5.5rem ceiling

## Big Man amendments (consult 2026-09-08, CDP — binding)
1. LOGO: design a proper recolorable geometric mark FIRST. Bold varsity-inspired "U" monogram inside a simplified circular travel badge; negative space subtly forms a road/path or upward ticket notch. Flat, two-color, stroke-safe, NO gradients — so every tile inherits arbitrary college-color pairs cleanly. (The old U-in-ring is too generic; favicon is a default create-next-app asset.)
2. DISPLAY FONT: Anton CONFIRMED (scoreboard/poster authority). Archivo stays the supporting family — "collegiate without becoming a sports-bar theme."
3. WARHOL GRID: 12 tiles, 4×3 on desktop. PURE MARK — NO school wordmarks underneath (licensing/trademark complication + turns art into a logo directory). Color combinations create the recognition cue, not borrowed institutional branding.
4. MAP: interactive SVG US map LEADS (conference filter + selectable school/stadium pins — real utility: "find my school, travel to games"). ONE controlled route-drawing cinematic on section entry, then hand control to the user. Scroll-sequence as primary would weaken the sales utility.
5. UNIFYING SIGNATURE: "Travel Stripe" system — paired collegiate end-zone/varsity stripe as a controlled graphic thread through the whole site: section boundary, route line, ticket edge, map path, CTA underline, image crop accent, vertical nav marker. Changes into guest college-color pairs where appropriate. Proprietary visual grammar, not literal tickets everywhere ("costume design").
6. SLOP GUARD: "one hero metaphor per viewport" — every section gets ONE dominant branded device; everything else falls back to disciplined typography, editorial photography, whitespace, Travel Stripe. #1 risk = stacking every sports cliché simultaneously (varsity type + scoreboards + tickets + stadium lights + yard lines + tailgates + badges all competing). Sophistication = restraint + hierarchy.

## Wiring (part of the deliverable, not an afterthought)
- Join / Sign In buttons → Access app (URL pending from Damon/Greg — do not ship with #)
- Build replaces the current homepage IN PLACE at the existing route (/) — site is live at uatc-travel-club.netlify.app; no orphan routes (build-at-the-linked-URL rule)
- Netlify deploy path TBD (see PROJECT_BRIEF.md open questions)