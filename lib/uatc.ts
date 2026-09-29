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

// 2026 football membership across the Big Ten, SEC, and Pac-12.
// Gonzaga is intentionally excluded because it does not sponsor football.
export const SCHOOLS: School[] = [
  { id: "iu", name: "Indiana", city: "Bloomington", state: "IN", x: 63.6, y: 33, conf: "B1G", c1: "#9E1B32", c2: "#EEE5C8" },
  { id: "um", name: "Michigan", city: "Ann Arbor", state: "MI", x: 67.7, y: 25.8, conf: "B1G", c1: "#00274C", c2: "#FFCB05" },
  { id: "msu", name: "Michigan State", city: "East Lansing", state: "MI", x: 66.6, y: 24.8, conf: "B1G", c1: "#18453B", c2: "#FFFFFF" },
  { id: "osu", name: "Ohio State", city: "Columbus", state: "OH", x: 68.7, y: 31.2, conf: "B1G", c1: "#BB0000", c2: "#E8E8E8" },
  { id: "psu", name: "Penn State", city: "State College", state: "PA", x: 76.3, y: 29.2, conf: "B1G", c1: "#1C2940", c2: "#F5F5F5" },
  { id: "uw", name: "Wisconsin", city: "Madison", state: "WI", x: 59.3, y: 24, conf: "B1G", c1: "#C5050C", c2: "#F5F5F5" },
  { id: "minn", name: "Minnesota", city: "Minneapolis", state: "MN", x: 53.7, y: 19.6, conf: "B1G", c1: "#7A0019", c2: "#FFCC33" },
  { id: "neb", name: "Nebraska", city: "Lincoln", state: "NE", x: 48.6, y: 29.2, conf: "B1G", c1: "#D00000", c2: "#FDF5E6" },
  { id: "iowa", name: "Iowa", city: "Iowa City", state: "IA", x: 56.2, y: 27.2, conf: "B1G", c1: "#FFCC00", c2: "#111111" },
  { id: "ill", name: "Illinois", city: "Champaign", state: "IL", x: 61, y: 30.8, conf: "B1G", c1: "#13294B", c2: "#FF552E" },
  { id: "pur", name: "Purdue", city: "West Lafayette", state: "IN", x: 63, y: 30.1, conf: "B1G", c1: "#191919", c2: "#CEB888" },
  { id: "nu", name: "Northwestern", city: "Evanston", state: "IL", x: 61.9, y: 26.4, conf: "B1G", c1: "#4E2A84", c2: "#FFFFFF" },
  { id: "umd", name: "Maryland", city: "College Park", state: "MD", x: 77.7, y: 33.4, conf: "B1G", c1: "#E21833", c2: "#FFD520" },
  { id: "rut", name: "Rutgers", city: "Piscataway", state: "NJ", x: 81.3, y: 29.8, conf: "B1G", c1: "#CC0033", c2: "#FFFFFF" },
  { id: "ucla", name: "UCLA", city: "Los Angeles", state: "CA", x: 16.6, y: 44.8, conf: "B1G", c1: "#2774AE", c2: "#FFD100" },
  { id: "usc", name: "USC", city: "Los Angeles", state: "CA", x: 16.9, y: 44.9, conf: "B1G", c1: "#9D2235", c2: "#F5F5F5" },
  { id: "uwash", name: "Washington", city: "Seattle", state: "WA", x: 11, y: 13.4, conf: "B1G", c1: "#4B2E83", c2: "#E8E3D3" },
  { id: "ore", name: "Oregon", city: "Eugene", state: "OR", x: 9.8, y: 21.7, conf: "B1G", c1: "#154733", c2: "#FEE123" },
  { id: "ala", name: "Alabama", city: "Tuscaloosa", state: "AL", x: 62, y: 46.7, conf: "SEC", c1: "#9E1B32", c2: "#F5F5F5" },
  { id: "ark", name: "Arkansas", city: "Fayetteville", state: "AR", x: 52.3, y: 40.1, conf: "SEC", c1: "#9D2235", c2: "#FFFFFF" },
  { id: "aub", name: "Auburn", city: "Auburn", state: "AL", x: 65.1, y: 48.1, conf: "SEC", c1: "#0C2340", c2: "#F26522" },
  { id: "fla", name: "Florida", city: "Gainesville", state: "FL", x: 69.7, y: 55, conf: "SEC", c1: "#0021A5", c2: "#FA4616" },
  { id: "uga", name: "Georgia", city: "Athens", state: "GA", x: 68.2, y: 45, conf: "SEC", c1: "#BA0C2F", c2: "#111111" },
  { id: "uk", name: "Kentucky", city: "Lexington", state: "KY", x: 66.5, y: 35.6, conf: "SEC", c1: "#0033A0", c2: "#FFFFFF" },
  { id: "lsu", name: "LSU", city: "Baton Rouge", state: "LA", x: 56.7, y: 53.1, conf: "SEC", c1: "#461D7C", c2: "#FDD023" },
  { id: "msst", name: "Mississippi State", city: "Starkville", state: "MS", x: 60.2, y: 46.2, conf: "SEC", c1: "#5D1725", c2: "#FFFFFF" },
  { id: "mizz", name: "Missouri", city: "Columbia", state: "MO", x: 55, y: 33.5, conf: "SEC", c1: "#000000", c2: "#F1B82D" },
  { id: "ou", name: "Oklahoma", city: "Norman", state: "OK", x: 47.5, y: 42.1, conf: "SEC", c1: "#841617", c2: "#FDF9D8" },
  { id: "olemiss", name: "Ole Miss", city: "Oxford", state: "MS", x: 59.2, y: 44.1, conf: "SEC", c1: "#CE1126", c2: "#14213D" },
  { id: "sc", name: "South Carolina", city: "Columbia", state: "SC", x: 71.6, y: 44.9, conf: "SEC", c1: "#73000A", c2: "#000000" },
  { id: "tenn", name: "Tennessee", city: "Knoxville", state: "TN", x: 67.4, y: 40.4, conf: "SEC", c1: "#FF8200", c2: "#F5F5F5" },
  { id: "tam", name: "Texas A&M", city: "College Station", state: "TX", x: 49.1, y: 52.7, conf: "SEC", c1: "#500000", c2: "#F5F5F5" },
  { id: "tex", name: "Texas", city: "Austin", state: "TX", x: 47.1, y: 53.5, conf: "SEC", c1: "#BF5700", c2: "#F5F5F5" },
  { id: "vandy", name: "Vanderbilt", city: "Nashville", state: "TN", x: 63.2, y: 40, conf: "SEC", c1: "#000000", c2: "#CFAE70" },
  { id: "orst", name: "Oregon State", city: "Corvallis", state: "OR", x: 9.6, y: 20.5, conf: "P12", c1: "#DC4405", c2: "#000000" },
  { id: "wast", name: "Washington State", city: "Pullman", state: "WA", x: 18.5, y: 15.5, conf: "P12", c1: "#981E32", c2: "#5E6A71" },
  { id: "boise", name: "Boise State", city: "Boise", state: "ID", x: 19.9, y: 22.8, conf: "P12", c1: "#0033A0", c2: "#D64309" },
  { id: "csu", name: "Colorado State", city: "Fort Collins", state: "CO", x: 36.3, y: 29.8, conf: "P12", c1: "#1E4D2B", c2: "#C8C372" },
  { id: "fresno", name: "Fresno State", city: "Fresno", state: "CA", x: 14.7, y: 38.4, conf: "P12", c1: "#DB0032", c2: "#002E6D" },
  { id: "sdsu", name: "San Diego State", city: "San Diego", state: "CA", x: 18.7, y: 47.7, conf: "P12", c1: "#A6192E", c2: "#000000" },
  { id: "usu", name: "Utah State", city: "Logan", state: "UT", x: 26.4, y: 27.1, conf: "P12", c1: "#0F2439", c2: "#FFFFFF" },
  { id: "txst", name: "Texas State", city: "San Marcos", state: "TX", x: 46.8, y: 54.4, conf: "P12", c1: "#501214", c2: "#B9975B" },
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
