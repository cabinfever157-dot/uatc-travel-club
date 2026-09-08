// UATC site data — single source of truth
// CTA wiring: swap CTA_URL when the real join/sign-in destination exists.
export const CTA_URL = "#";
export const SIGN_IN_URL = "#";

export type Conf = "B1G" | "SEC" | "P12";

export interface School {
  id: string;
  name: string; // used in map tooltips + filters (utility, not branding art)
  city: string;
  state: string;
  x: number; // % position on the map artboard (0-100)
  y: number;
  conf: Conf;
  c1: string; // primary school color (pin / tile bg)
  c2: string; // secondary school color (mark fg)
}

// 12 Warhol-grid schools + map pins. Colors are the recognition cue.
export const SCHOOLS: School[] = [
  { id: "iu", name: "Indiana", city: "Bloomington", state: "IN", x: 63.5, y: 42.5, conf: "B1G", c1: "#9E1B32", c2: "#EEE5C8" },
  { id: "um", name: "Michigan", city: "Ann Arbor", state: "MI", x: 64.5, y: 33.5, conf: "B1G", c1: "#00274C", c2: "#FFCB05" },
  { id: "msu", name: "Michigan State", city: "East Lansing", state: "MI", x: 65.5, y: 34.5, conf: "B1G", c1: "#18453B", c2: "#FFFFFF" },
  { id: "osu", name: "Ohio State", city: "Columbus", state: "OH", x: 66.5, y: 42, conf: "B1G", c1: "#BB0000", c2: "#E8E8E8" },
  { id: "psu", name: "Penn State", city: "State College", state: "PA", x: 76.5, y: 39.5, conf: "B1G", c1: "#1C2940", c2: "#F5F5F5" },
  { id: "uw", name: "Wisconsin", city: "Madison", state: "WI", x: 58.5, y: 34, conf: "B1G", c1: "#C5050C", c2: "#F5F5F5" },
  { id: "minn", name: "Minnesota", city: "Minneapolis", state: "MN", x: 54.5, y: 28.5, conf: "B1G", c1: "#7A0019", c2: "#FFCC33" },
  { id: "neb", name: "Nebraska", city: "Lincoln", state: "NE", x: 47.5, y: 44.5, conf: "B1G", c1: "#D00000", c2: "#FDF5E6" },
  { id: "iowa", name: "Iowa", city: "Iowa City", state: "IA", x: 57.5, y: 39.5, conf: "B1G", c1: "#FFCC00", c2: "#111111" },
  { id: "ill", name: "Illinois", city: "Champaign", state: "IL", x: 61.5, y: 45, conf: "B1G", c1: "#13294B", c2: "#FF552E" },
  { id: "pur", name: "Purdue", city: "West Lafayette", state: "IN", x: 62, y: 44, conf: "B1G", c1: "#191919", c2: "#CEB888" },
  { id: "nu", name: "Northwestern", city: "Evanston", state: "IL", x: 63.5, y: 40.5, conf: "B1G", c1: "#4E2A84", c2: "#FFFFFF" },
  { id: "umd", name: "Maryland", city: "College Park", state: "MD", x: 80, y: 43, conf: "B1G", c1: "#E21833", c2: "#FFD520" },
  { id: "rut", name: "Rutgers", city: "Piscataway", state: "NJ", x: 81.5, y: 41.5, conf: "B1G", c1: "#CC0033", c2: "#FFFFFF" },
  { id: "ala", name: "Alabama", city: "Tuscaloosa", state: "AL", x: 65.5, y: 62.5, conf: "SEC", c1: "#9E1B32", c2: "#F5F5F5" },
  { id: "uga", name: "Georgia", city: "Athens", state: "GA", x: 69, y: 60, conf: "SEC", c1: "#BA0C2F", c2: "#111111" },
  { id: "lsu", name: "LSU", city: "Baton Rouge", state: "LA", x: 59.5, y: 65.5, conf: "SEC", c1: "#461D7C", c2: "#FDD023" },
  { id: "tenn", name: "Tennessee", city: "Knoxville", state: "TN", x: 70, y: 53.5, conf: "SEC", c1: "#FF8200", c2: "#F5F5F5" },
  { id: "tam", name: "Texas A&M", city: "College Station", state: "TX", x: 50.5, y: 63, conf: "SEC", c1: "#500000", c2: "#F5F5F5" },
  { id: "tex", name: "Texas", city: "Austin", state: "TX", x: 49, y: 65.5, conf: "SEC", c1: "#BF5700", c2: "#F5F5F5" },
  { id: "ucla", name: "UCLA", city: "Los Angeles", state: "CA", x: 14, y: 52, conf: "P12", c1: "#2774AE", c2: "#FFD100" },
  { id: "usc", name: "USC", city: "Los Angeles", state: "CA", x: 15, y: 53.5, conf: "P12", c1: "#9D2235", c2: "#F5F5F5" },
  { id: "uwash", name: "Washington", city: "Seattle", state: "WA", x: 13.5, y: 28, conf: "P12", c1: "#4B2E83", c2: "#E8E3D3" },
  { id: "ore", name: "Oregon", city: "Eugene", state: "OR", x: 12.5, y: 38, conf: "P12", c1: "#154733", c2: "#FEE123" },
];

// The 12 Warhol grid tiles (pure mark, no wordmarks)
export const GRID_SCHOOL_IDS = ["iu", "um", "osu", "psu", "uw", "iowa", "neb", "ill", "ala", "uga", "ucla", "ore"];

export const CONFS: { id: Conf | "ALL"; label: string }[] = [
  { id: "ALL", label: "All Conferences" },
  { id: "B1G", label: "Big Ten" },
  { id: "SEC", label: "SEC" },
  { id: "P12", label: "Pac-12" },
];

export interface Trip {
  id: string;
  title: string;
  from: string;
  to: string;
  dates: string;
  days: number;
  seats: number; // limited capacity
  seatsLeft: number;
  tag: string;
  image: string;
  blurb: string;
  featured?: boolean;
  schoolId?: string;
}

export const TRIPS: Trip[] = [
  {
    id: "iu-branson",
    title: "IU to Branson",
    from: "Bloomington, IN",
    to: "Branson, MO",
    dates: "Oct 16–20",
    days: 5,
    seats: 44,
    seatsLeft: 9,
    tag: "Alumni Adventure",
    image: "/images/gen/uatc-branson.png",
    blurb:
      "Chartered motorcoach from campus to the Ozarks — shows, lakeside dinners, and a whole bus of your people. Limited seats, one weekend, all taken care of.",
    featured: true,
    schoolId: "iu",
  },
  {
    id: "game-day-cbus",
    title: "Rivalry Weekend: Columbus",
    from: "Anywhere, IN",
    to: "Columbus, OH",
    dates: "Nov 22–23",
    days: 2,
    seats: 30,
    seatsLeft: 12,
    tag: "Follow Your Team",
    image: "/images/gen/uatc-game-day.png",
    blurb:
      "The trip every November is about. Tailgate pass, block of seats, and a pre-game rally with food, music, and friends you haven't seen since graduation.",
    schoolId: "iu",
  },
  {
    id: "reunion-nashville",
    title: "Reunion Weekend: Nashville",
    from: "Midwest hubs",
    to: "Nashville, TN",
    dates: "Sep 26–28",
    days: 3,
    seats: 40,
    seatsLeft: 17,
    tag: "Reunion",
    image: "/images/gen/uatc-reunion.png",
    blurb:
      "Class-year meetups with a Tennessee soundtrack. Group hotel downtown, a honky-tonk crawl, and a private rooftop dinner under the neon.",
  },
  {
    id: "weekend-great-lakes",
    title: "Small-Town Square Weekend",
    from: "Chicago + Indy",
    to: "Galena, IL",
    dates: "Oct 3–5",
    days: 3,
    seats: 36,
    seatsLeft: 22,
    tag: "Weekend Trip",
    image: "/images/gen/uatc-weekend.png",
    blurb:
      "Autumn on a courthouse square without a single plan to make yourself. Bed & breakfast row, cider stops, and a guide who knows every story in town.",
  },
];

export const STATS = [
  { value: 12, suffix: "", label: "Partner Conferences" },
  { value: 40, suffix: "+", label: "Trips a Year" },
  { value: 4800, suffix: "+", label: "Alumni Travelers" },
  { value: 250, prefix: "$", suffix: "", label: "Avg. Member Savings / Trip" },
];

export const SAVINGS_POINTS = [
  "Group rates on hotels, motorcoaches, and game blocks — negotiated for you",
  "No planning, no spreadsheets, no group-text chaos — one sign-up, done",
  "Member pricing on every trip, every year",
  "Seats held for members before any public release",
];