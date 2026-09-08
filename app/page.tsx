"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Plane, Compass, Users, Award, ArrowRight, ChevronDown,
  MapPin, Calendar, Star, Menu, X, Globe, Shield, Sparkles,
  Mountain, Camera, Utensils, Hotel, CheckCircle, Quote, ArrowUpRight,
} from "lucide-react";

// ============================================================
// DATA
// ============================================================
const heroSlides = [
  {
    eyebrow: "Featured Journey",
    title: "Santorini Sunset Retreat",
    subtitle: "Greek Islands · 7 Days",
    image: "/images/hero-santorini.jpg",
  },
  {
    eyebrow: "New for 2026",
    title: "African Safari Adventure",
    subtitle: "Tanzania & Kenya · 12 Days",
    image: "/images/hero-safari.jpg",
  },
  {
    eyebrow: "Member Favorite",
    title: "Northern Lights Expedition",
    subtitle: "Iceland & Finland · 8 Days",
    image: "/images/hero-northern-lights.jpg",
  },
  {
    eyebrow: "Coming Soon",
    title: "Patagonia Wilderness Trek",
    subtitle: "Chile & Argentina · 14 Days",
    image: "/images/hero-patagonia.jpg",
  },
];

const stats = [
  { value: 35, label: "Years of Experience", suffix: "+" },
  { value: 120, label: "Destinations", suffix: "+" },
  { value: 8000, label: "Alumni Travelers", suffix: "+" },
  { value: 500, label: "Curated Trips", suffix: "+" },
];

const destinations = [
  { name: "Greek Islands", image: "/images/dest-greek-islands.jpg", trips: 12, region: "Mediterranean" },
  { name: "Tanzania Safari", image: "/images/dest-tanzania.jpg", trips: 8, region: "Africa" },
  { name: "Japan Discovery", image: "/images/dest-japan.jpg", trips: 6, region: "Asia" },
  { name: "Iceland Aurora", image: "/images/dest-iceland.jpg", trips: 5, region: "Nordic" },
  { name: "Peru & Machu Picchu", image: "/images/dest-peru.jpg", trips: 7, region: "South America" },
  { name: "Croatian Coast", image: "/images/dest-croatia.jpg", trips: 4, region: "Europe" },
];

const experiences = [
  {
    title: "Bali & Beyond: Island Loop",
    duration: "15 Days",
    image: "/images/exp-bali.jpg",
    description: "Loop through Indonesia's greatest hits — surf, treks, culture, and island chill. Start in Ubud and end on the beaches of Nusa Penida.",
    tag: "Adventure",
  },
  {
    title: "Active Croatia Discovery",
    duration: "10 Days",
    image: "/images/dest-peru.jpg",
    description: "Lace up your hiking boots to conquer the rugged beauty of the Dalmatian Coast. Kayak hidden coves, walk ancient walls, and sail between islands.",
    tag: "Active",
  },
  {
    title: "Absolute Peru",
    duration: "14 Days",
    image: "/images/exp-peru.jpg",
    description: "Scan the Amazon canopy for wildlife, contemplate mountain vistas, and stand in awe at Machu Picchu. The ultimate South American adventure.",
    tag: "Trekking",
  },
  {
    title: "Japan Cultural Immersion",
    duration: "12 Days",
    image: "/images/exp-japan.jpg",
    description: "From Tokyo's neon streets to Kyoto's serene temples. Experience tea ceremonies, stay in a ryokan, and witness the cherry blossoms.",
    tag: "Cultural",
  },
];

const stories = [
  {
    name: "Sarah Mitchell",
    school: "Class of '98, University of Michigan",
    quote: "The Santorini trip was beyond anything I imagined. Reconnecting with fellow alumni while watching that sunset... it was pure magic.",
    image: "/images/story-sarah.jpg",
    trip: "Santorini Sunset Retreat",
  },
  {
    name: "James Chen",
    school: "Class of '05, Stanford University",
    quote: "I've traveled with a lot of groups. UATC curates experiences that feel personal yet grand. The safari was a once-in-a-lifetime journey.",
    image: "/images/story-james.jpg",
    trip: "African Safari Adventure",
  },
  {
    name: "Maria Rodriguez",
    school: "Class of '92, UCLA",
    quote: "The Northern Lights trip exceeded every expectation. Expert guides, seamless logistics, and alumni friendships that will last a lifetime.",
    image: "/images/story-maria.jpg",
    trip: "Northern Lights Expedition",
  },
];

const benefits = [
  { icon: Compass, title: "Expertly Curated", desc: "Every itinerary handcrafted by travel veterans with 30+ years of experience" },
  { icon: Users, title: "Alumni Community", desc: "Travel with like-minded university graduates who share your curiosity" },
  { icon: Shield, title: "Worry-Free Travel", desc: "Comprehensive insurance, 24/7 support, and seamless logistics included" },
  { icon: Award, title: "Exclusive Access", desc: "Private tours, members-only events, and VIP experiences you can't book elsewhere" },
  { icon: Utensils, title: "Fine Dining", desc: "Curated culinary experiences at each destination — from street food to Michelin" },
  { icon: Camera, title: "Pro Photography", desc: "Professional trip photographer captures every moment so you can be present" },
];

const navItems = [
  { label: "Destinations", href: "#destinations" },
  { label: "Experiences", href: "#experiences" },
  { label: "Stories", href: "#stories" },
  { label: "Membership", href: "#membership" },
  { label: "About", href: "#about" },
];

// ============================================================
// COMPONENTS
// ============================================================

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-navy-deep">
      {/* Slides */}
      <AnimatePresence mode="sync">
        {heroSlides.map((slide, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === current ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            style={{ pointerEvents: i === current ? "auto" : "none" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: loaded && i === current ? "scale(1.05)" : "scale(1)",
                transition: "transform 6s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 via-navy-deep/40 to-navy-deep/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/60 to-transparent" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="eyebrow text-champagne mb-4">
                {heroSlides[current].eyebrow}
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-3">
                {heroSlides[current].title}
              </h1>
              <p className="text-xl md:text-2xl text-cream/80 font-sans">
                {heroSlides[current].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <button className="btn-primary px-8 py-3.5 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 w-full sm:w-auto">
              Explore Trips <ArrowRight size={16} />
            </button>
            <button className="btn-secondary px-8 py-3.5 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 w-full sm:w-auto">
              Become a Member
            </button>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-6 md:left-12 lg:left-20 z-20 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? "w-12 bg-champagne" : "w-6 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        className="absolute bottom-10 right-6 md:right-12 lg:right-20 z-20 flex flex-col items-center gap-2 text-cream/50"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.div>
    </section>
  );
}

function Header({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 bg-navy-deep/95 backdrop-blur-md" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full border-2 border-champagne flex items-center justify-center">
            <span className="font-display text-champagne text-lg">U</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-white text-sm tracking-wide">ULTIMATE ALUMNI</div>
            <div className="font-display text-champagne text-sm tracking-wide">TRAVEL CLUB</div>
          </div>
        </motion.a>

        {/* Desktop nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex items-center gap-1"
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center gap-1 rounded-full p-1 nav-pill-bg">
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(item.href)}
                className="relative px-4 py-1.5 text-sm font-label tracking-wide text-cream/80 hover:text-white rounded-full"
              >
                {hovered === item.href && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-champagne/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </motion.a>
            ))}
          </div>
          <motion.a
            href="#membership"
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="btn-primary px-5 py-2 text-sm font-semibold ml-3"
          >
            Join Now
          </motion.a>
        </motion.nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white p-2"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-navy-deep/98 backdrop-blur-md"
          >
            <nav className="flex flex-col px-6 py-4 gap-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-cream/80 hover:text-champagne py-2 text-sm font-label"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#membership"
                onClick={() => setMenuOpen(false)}
                className="btn-primary px-5 py-2.5 text-sm font-semibold text-center mt-2"
              >
                Join Now
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function StatsSection() {
  return (
    <section className="relative py-20 md:py-28 bg-navy overflow-hidden">
      <div className="absolute inset-0 dot-texture pointer-events-none" />
      <div className="absolute left-0 top-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="font-display text-4xl md:text-6xl text-gradient-champagne mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base text-cream/60 font-label tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-cream-warm overflow-hidden">
      <div className="absolute inset-0 diagonal-texture pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow text-champagne-dark mb-4">Your Journey Awaits</div>
          <h2 className="font-display text-4xl md:text-6xl text-navy mb-6 leading-[1.1]">
            Adventure is Calling
          </h2>
          <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8">
            Ultimate Alumni Travel Club is your passport to the world's most sought-after
            destinations. Discover journeys worth sharing, planned with precision, and
            shared with fellow alumni who understand the value of seeing the world.
          </p>
          <div className="flex items-center justify-center gap-2 text-champagne-dark">
            <Sparkles size={20} />
            <span className="text-sm font-label tracking-wide">
              Earn travel rewards every time you book
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DestinationsSection() {
  return (
    <section id="destinations" className="relative py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="eyebrow text-champagne-dark mb-4">Where We Go</div>
          <h2 className="font-display text-4xl md:text-5xl text-navy">Featured Destinations</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card-premium relative overflow-hidden group cursor-pointer h-[420px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s]"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent" />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-label bg-champagne/90 text-navy rounded-full">
                  {dest.trips} trips
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-1.5 text-champagne text-xs font-label mb-2">
                  <MapPin size={12} /> {dest.region}
                </div>
                <h3 className="font-display text-2xl text-white mb-2">{dest.name}</h3>
                <div className="flex items-center gap-1 text-cream/60 text-sm">
                  Explore <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperiencesSection() {
  return (
    <section id="experiences" className="relative py-24 md:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 dot-texture pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="eyebrow text-champagne mb-4">Curated for You</div>
          <h2 className="font-display text-4xl md:text-5xl text-white">Featured Adventures</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="card-premium relative overflow-hidden group cursor-pointer bg-navy-light"
            >
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] group-hover:scale-110"
                  style={{ backgroundImage: `url(${exp.image})` }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-label bg-navy-deep/80 text-champagne rounded-full backdrop-blur-sm border border-champagne/20">
                    {exp.tag}
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-champagne/60 text-xs font-label mb-3">
                  <Calendar size={12} /> {exp.duration}
                </div>
                <h3 className="font-display text-2xl text-white mb-3 group-hover:text-champagne transition-colors duration-500">
                  {exp.title}
                </h3>
                <p className="text-sm text-cream/60 leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoriesSection() {
  return (
    <section id="stories" className="relative py-24 md:py-32 bg-cream-warm overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="eyebrow text-champagne-dark mb-4">Alumni Voices</div>
          <h2 className="font-display text-4xl md:text-5xl text-navy">Stories from the Road</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="card-premium bg-white p-8 flex flex-col"
            >
              <Quote className="text-champagne/30 mb-4" size={32} />
              <p className="text-sm text-text-muted leading-relaxed mb-6 italic flex-1">
                "{story.quote}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy">{story.name}</div>
                  <div className="text-xs text-text-muted">{story.school}</div>
                  <div className="text-xs text-champagne-dark mt-0.5">{story.trip}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section id="membership" className="relative py-24 md:py-32 bg-navy-light overflow-hidden">
      <div className="absolute inset-0 diagonal-texture pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="eyebrow text-champagne mb-4">Why Join</div>
          <h2 className="font-display text-4xl md:text-5xl text-white">Member Benefits</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl bg-navy/50 border border-champagne/10 hover:border-champagne/30 group"
            >
              <div className="w-12 h-12 rounded-xl bg-champagne/10 flex items-center justify-center mb-4 group-hover:bg-champagne/20 transition-colors duration-500">
                <benefit.icon className="text-champagne" size={24} />
              </div>
              <h3 className="font-display text-lg text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-cream/50 leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 md:py-32 bg-navy-deep overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)" }}
        />
      </div>
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow text-champagne mb-4">Join the Club</div>
          <h2 className="font-display text-4xl md:text-6xl text-white mb-6 leading-[1.1]">
            Your Next Journey<br />Starts Here
          </h2>
          <p className="text-lg text-cream/60 mb-10 max-w-2xl mx-auto">
            Become a member of the Ultimate Alumni Travel Club and unlock a world of
            curated adventures, exclusive access, and a community of travelers who
            share your passion for discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-10 py-4 text-base font-semibold tracking-wide flex items-center justify-center gap-2">
              Start Your Adventure <ArrowRight size={18} />
            </button>
            <button className="btn-secondary px-10 py-4 text-base font-semibold tracking-wide">
              View All Trips
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-deep border-t border-champagne/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-champagne flex items-center justify-center">
                <span className="font-display text-champagne text-lg">U</span>
              </div>
              <div className="leading-tight">
                <div className="font-display text-white text-sm tracking-wide">ULTIMATE ALUMNI</div>
                <div className="font-display text-champagne text-sm tracking-wide">TRAVEL CLUB</div>
              </div>
            </div>
            <p className="text-xs text-cream/40 leading-relaxed">
              Curated group travel experiences for university alumni worldwide.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <div className="text-xs font-label text-champagne tracking-widest uppercase mb-4">Discover</div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-cream/50 hover:text-champagne transition-colors duration-300">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <div className="text-xs font-label text-champagne tracking-widest uppercase mb-4">Helpful Info</div>
            <ul className="space-y-2 text-sm text-cream/50">
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">How It Works</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">Travel Insurance</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="text-xs font-label text-champagne tracking-widest uppercase mb-4">Connect</div>
            <ul className="space-y-2 text-sm text-cream/50">
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">Newsletter</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">Instagram</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">Facebook</a></li>
              <li><a href="#" className="hover:text-champagne transition-colors duration-300">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="divider-line mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/30">
          <div>(c) 2026 Ultimate Alumni Travel Club. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-champagne transition-colors duration-300">Terms of Use</a>
            <a href="#" className="hover:text-champagne transition-colors duration-300">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      <Header scrolled={scrolled} />
      <HeroSlider />
      <StatsSection />
      <IntroSection />
      <DestinationsSection />
      <ExperiencesSection />
      <StoriesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </main>
  );
}