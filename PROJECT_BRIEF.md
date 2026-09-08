# UATC — Ultimate Alumni Travel Club (PROJECT BRIEF)

Source of truth for this project. Read this FIRST before any work.

## Project facts
- Location: `C:/Projects/uatc` (moved from C:/Users/info/uatc on 2026-09-08 — never work out of C:/Users/info, that path is deleted)
- Stack: Next.js 16.3.0, Tailwind v4, framer-motion, lucide-react
- Live site: https://uatc-travel-club.netlify.app/ (Netlify, name: uatc-travel-club)
- Git: local repo only, NO remote configured yet. 5 files have uncommitted changes (globals.css, layout.tsx, page.tsx, next.config.ts, package.json) from the Aug 4 build. Initial commit `e319097` is the bare create-next-app; the real site is entirely in the uncommitted working tree. COMMIT THESE before any edits.
- Prior state: built Aug 4 2026 (navy/champagne luxury palette, hero slider, destinations, experiences, stories, benefits, CTA). Damon said "leave it" Aug 24. Now being reworked per Greg's meeting notes below.

## MEETING NOTES (from Damon's pocketAI device, 2026-09-08 — client: Greg)
- Give UATC a much more collegiate/alumni feel — energetic, fun, travel-oriented, primarily U.S.-focused.
- Keep the site tight, modern, and conversion-focused: emphasize travel savings → Join → Sign In.
- Earlier color direction was black + red, but Greg also specifically liked incorporating different college colors throughout.
- Greg's visual idea: repeat the UATC logo in different college-color combinations, almost like an Andy Warhol grid, so people recognize "their" school colors.
- Create a major "Follow Your Team" / football-tailgating section. Greg specifically described a U.S. map / Big Ten / Pac-12 / SEC-type concept, showing alumni traveling to games.
- Work in Alumni Adventures / group travel — alumni traveling together, reunions, weekend trips, organized packages, etc.
- Example discussed: an Indiana University → Branson trip, limited group capacity.
- The marketing site's main job is simply to make people want to join, then connect the Join/Login buttons to Access.

## Open questions (ask Damon or Big Man before building)
1. **Join/Sign In → Access**: what is the Access URL/endpoint for the buttons? (Access is the app behind the marketing site — need the real link, not #)
2. **UATC logo asset**: where is the logo file? The Warhol college-colors grid needs a clean logo mark (ideally SVG or transparent PNG). If no asset exists, consult Big Man via Chrome browser interface for generation.
3. **College colors scope**: how many schools in the Warhol grid + "Follow Your Team" map — Big Ten + Pac-12 + SEC only, or broader?
4. **Netlify deploy**: currently deploys from a repo Damon/Manus controls. Does Damon want to take over the Netlify site from his own GitHub (per github-lanes rule: his PATs never for backups, live-project pushes via cabinfever157-dot)?

## Design-gate requirements (MANDATORY per governance)
- Run `direction-lock` skill BEFORE generating: DESIGN.md with palette/type/layout/motion/banned-patterns locks.
- Use `motion-system` skill for the shared GSAP+ScrollTrigger+Lenis baseline.
- `webgl-3d-patterns` stays DEFAULT OFF unless a 3D brief is explicit.
- Per 9/8 Damon profile: judges by live URL — build at the URL existing links point to; "Plain Jane" = wants awwwards-tier signature moments (scroll-scrub text, pinned banners, duotone grades).
- Image effects: subtle not gaudy; no empty oval graphics; no white box look on images.

## Big Man consultation protocol
If images/logo/assets are needed or anything is questionable: consult Big Man via Chrome browser interface.

## Environment
- Windows 10, bash (git-bash/MSYS) shell. Node v22.22.3, npm 10.9.8.
- Dev server port 3000 currently held by tardigrades-in-space-modern (PID 54604) — use a different port (e.g. 3002) for uatc dev.