"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CTA_URL, SIGN_IN_URL } from "@/lib/uatc";

const links = [
  { id: "travel", label: "Search Travel" },
  { id: "follow", label: "Follow Your Team" },
  { id: "adventures", label: "Adventures" },
  { id: "savings", label: "Savings" },
  { id: "how", label: "How It Works" },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.5, delayChildren: 0.3 } },
};

const item: Variants = {
  hidden: { y: -15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuHovered, setMenuHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const activeItem = menu.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    if (!activeItem) return;

    const menuRect = menu.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const targetX = itemRect.left - menuRect.left + itemRect.width / 2;

    animate(ambienceX.current, targetX, {
      type: "spring",
      stiffness: 200,
      damping: 20,
      onUpdate: (value) => {
        ambienceX.current = value;
        menu.style.setProperty("--ambience-x", `${value}px`);
      },
    });

    if (!menuHovered) {
      animate(spotlightX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (value) => {
          spotlightX.current = value;
          menu.style.setProperty("--spotlight-x", `${value}px`);
        },
      });
    }
  }, [activeIndex, menuHovered]);

  const moveSpotlight = (event: React.MouseEvent<HTMLDivElement>) => {
    const menu = menuRef.current;
    if (!menu) return;
    const x = event.clientX - menu.getBoundingClientRect().left;
    spotlightX.current = x;
    menu.style.setProperty("--spotlight-x", `${x}px`);
  };

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 10, mass: 1 }}
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: scrolled ? "rgba(10,10,10,0.96)" : "rgba(10,10,10,0.85)",
        backdropFilter: scrolled
          ? "blur(28px) saturate(175%)"
          : "blur(20px) saturate(140%)",
        WebkitBackdropFilter: scrolled
          ? "blur(28px) saturate(175%)"
          : "blur(20px) saturate(140%)",
        boxShadow: scrolled
          ? "0 10px 40px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(0,0,0,0.3)",
        transition:
          "background 0.5s ease, backdrop-filter 0.5s ease, box-shadow 0.5s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2 flex items-center justify-between">
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          initial={{ scale: 3, rotate: 0, opacity: 0, y: -30 }}
          animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex items-center gap-3 group"
        >
          <img
            src="/images/uatc-navbar-logo.png"
            alt="University Alumni Travel Club"
            className="h-28 w-28 md:h-32 md:w-32 object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <span className="font-display text-4xl tracking-wide text-cream leading-none">
            UNIVERSITY ALUMNI
            <br />
            <span className="text-red">TRAVEL CLUB</span>
          </span>
        </motion.a>

        <motion.div
          className="hidden lg:flex items-center gap-3"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            ref={menuRef}
            variants={item}
            onMouseMove={moveSpotlight}
            onMouseEnter={() => setMenuHovered(true)}
            onMouseLeave={() => setMenuHovered(false)}
            className="relative flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.045] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_40px_rgba(0,0,0,0.24)]"
          >
            <div className="relative z-10 flex items-center">
              {links.map((l, index) => (
                <button
                  key={l.id}
                  data-index={index}
                  onClick={() => {
                    setActiveIndex(index);
                    go(l.id);
                  }}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    activeIndex === index
                      ? "text-white"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
              <a
                href={SIGN_IN_URL}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-cream/60 transition-colors duration-200 hover:text-cream"
              >
                Sign In
              </a>
            </div>

            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 ${
                menuHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(130px circle at var(--spotlight-x) 100%, rgba(200,16,46,0.28) 0%, rgba(250,247,240,0.08) 38%, transparent 68%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 z-[2] h-[2px] w-full"
              style={{
                background:
                  "radial-gradient(64px circle at var(--ambience-x) 0%, #e7334f 0%, rgba(200,16,46,0.5) 45%, transparent 100%)",
              }}
            />
          </motion.div>
          <motion.a
            variants={item}
            href={CTA_URL}
            onClick={(e) => CTA_URL === "#" && e.preventDefault()}
            className="font-display text-sm tracking-wider uppercase bg-red text-white px-6 py-2.5 rounded-sm hover:bg-red-2 transition-all duration-500 shadow-[0_2px_16px_rgba(200,16,46,0.45)] hover:shadow-[0_4px_32px_rgba(200,16,46,0.7)]"
          >
            Join the Club
          </motion.a>
        </motion.div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-black/98 backdrop-blur-xl border-t border-white/10"
        >
          <div className="px-6 py-4 space-y-3">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="block w-full text-left text-white/80 hover:text-red transition-colors py-2 font-semibold"
              >
                {l.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <a
                href={SIGN_IN_URL}
                className="flex-1 text-center border border-cream/30 text-cream px-4 py-2.5 rounded-sm font-semibold"
              >
                Sign In
              </a>
              <a
                href={CTA_URL}
                onClick={(e) => CTA_URL === "#" && e.preventDefault()}
                className="flex-1 text-center bg-red text-white px-4 py-2.5 rounded-sm font-display uppercase tracking-wider"
              >
                Join
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
