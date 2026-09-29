"use client";

// UATC homepage — composed against DESIGN.md (direction-lock 2026-09-08)
// Bands: Nav / Hero (Warhol grid) / TailgateBand / Follow Your Team (map) /
// StadiumBand / Adventures (ticket stubs) / Savings (scoreboard) /
// How It Works + Join / Footer
// Rhythm: dark → dark-photo → dark-map → dark-photo → light-adventures →
// dark-savings → light-how → dark-footer (light bands break the dark run)
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { TravelSearch } from "@/components/travel-search";
import { PhotoBand } from "@/components/photo-band";
import { FollowYourTeam } from "@/components/follow-your-team";
import { StadiumBand } from "@/components/stadium-band";
import { Adventures } from "@/components/adventures";
import { Savings } from "@/components/savings";
import { HowItWorks } from "@/components/how-it-works";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <TravelSearch />
      <PhotoBand
        image="/images/gen/uatc-hero-tailgate.png"
        alt="Alumni tailgate with grills and string lights"
        eyebrow="Tailgate central"
        headlineTop="THE TAILGATE STARTS"
        headlineAccent="BEFORE THE BUS PARKS."
        sub="Reserved spots, grills going, music up — arrive with your class and let the morning take care of itself."
      />
      <FollowYourTeam />
      <StadiumBand />
      <Adventures />
      <Savings />
      <HowItWorks />
      <Footer />
    </main>
  );
}
