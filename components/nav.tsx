"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import { UatcMark } from "@/components/brand";
import { CTA_URL, SIGN_IN_URL } from "@/lib/uatc";

const links = [
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3.5 flex items-center justify-between">
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
          <UatcMark c1="#faf7f0" c2="#c8102e" className="w-11 h-11 group-hover:scale-110 transition-transform duration-500" />
          <span className="font-display text-lg tracking-wide text-cream leading-none">
            ULTIMATE ALUMNI
            <br />
            <span className="text-red">TRAVEL CLUB</span>
          </span>
        </motion.a>

        <motion.div
          className="hidden lg:flex items-center gap-8"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {links.map((l) => (
            <motion.button
              key={l.id}
              variants={item}
              onClick={() => go(l.id)}
              className="relative text-sm font-semibold text-white/60 hover:text-white transition-colors duration-500 cursor-pointer py-1"
            >
              {l.label}
              {/* CTA underline stripe on hover */}
              <span
                aria-hidden
                className="absolute left-0 -bottom-0.5 h-[3px] w-0 travel-stripe-h transition-all duration-500 group-hover:w-full"
              />
            </motion.button>
          ))}
          <motion.a
            variants={item}
            href={SIGN_IN_URL}
            className="text-sm font-semibold text-cream/70 hover:text-cream transition-colors duration-300"
          >
            Sign In
          </motion.a>
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