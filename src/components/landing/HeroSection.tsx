"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Github,
  Check,
  Copy,
  BookOpen,
  Package,
  ChevronDown,
} from "lucide-react";
import type { Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG, EXTERNAL_LINKS, INSTALL_COMMAND } from "@/lib/constants";
import { HeroBackground } from "./HeroBackground";
import { BlochSphere } from "./BlochSphere";

/* ------------------------------------------------------------------ */
/*  Local animation variants                                          */
/* ------------------------------------------------------------------ */

const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 25, stiffness: 100 },
  },
};

const wordReveal: Variants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 22,
      stiffness: 80,
      delay: 0.25 + i * 0.18,
    },
  }),
};

const lineExpand: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { delay: 0.85, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const ketFloat: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { delay, duration: 1.2 },
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = INSTALL_COMMAND;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Animated quantum-circuit canvas background (kept as-is) */}
      <HeroBackground />

      {/* Bloch sphere — atmospheric backdrop behind text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <BlochSphere size={520} className="opacity-[0.05] dark:opacity-[0.08]" />
      </motion.div>

      {/* Decorative ket notation — floating quantum symbols */}
      <motion.span
        custom={1.6}
        variants={ketFloat}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute left-[8%] top-[22%] hidden font-mono text-xl text-quantum-violet/[0.12] dark:text-quantum-violet/[0.15] lg:block hero-float"
        aria-hidden="true"
      >
        |&psi;&#x27E9;
      </motion.span>
      <motion.span
        custom={2.0}
        variants={ketFloat}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute right-[10%] top-[30%] hidden font-mono text-lg text-quantum-cyan/[0.10] dark:text-quantum-cyan/[0.14] lg:block hero-float-reverse"
        aria-hidden="true"
      >
        &#x27E8;&phi;|
      </motion.span>
      <motion.span
        custom={2.4}
        variants={ketFloat}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute bottom-[25%] left-[12%] hidden font-mono text-base text-quantum-emerald/[0.10] dark:text-quantum-emerald/[0.13] lg:block hero-float"
        aria-hidden="true"
      >
        H|0&#x27E9;
      </motion.span>
      <motion.span
        custom={2.8}
        variants={ketFloat}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute bottom-[20%] right-[8%] hidden font-mono text-sm text-quantum-magenta/[0.10] dark:text-quantum-magenta/[0.13] lg:block hero-float-reverse"
        aria-hidden="true"
      >
        &alpha;|0&#x27E9; + &beta;|1&#x27E9;
      </motion.span>

      {/* ---- Main content ---- */}
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Overline badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-primary backdrop-blur-sm">
              <span className="inline-block size-1.5 animate-quantum-pulse rounded-full bg-quantum-emerald" />
              Open Source Quantum ML
            </span>
          </motion.div>

          {/* ---- Title block ---- */}
          <div className="mt-10 flex flex-col items-center sm:mt-12">
            {/* "Quantum" — ultra-light, wide tracking */}
            <motion.span
              custom={0}
              variants={wordReveal}
              initial="hidden"
              animate="visible"
              className="block font-display text-4xl font-extralight uppercase tracking-[0.3em] text-foreground/70 sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Quantum
            </motion.span>

            {/* "Encoding Atlas" — heavy, gradient */}
            <motion.span
              custom={1}
              variants={wordReveal}
              initial="hidden"
              animate="visible"
              className="-mt-1 block font-display text-5xl font-black tracking-tight gradient-text-quantum sm:text-7xl lg:text-8xl xl:text-[8.5rem] xl:leading-[0.95]"
            >
              Encoding Atlas
            </motion.span>
          </div>

          {/* Animated gradient divider */}
          <motion.div
            variants={lineExpand}
            initial="hidden"
            animate="visible"
            className="mt-8 h-px w-28 origin-center sm:w-40 lg:w-52"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--quantum-violet), var(--quantum-cyan), transparent)",
            }}
          />

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl"
          >
            {SITE_CONFIG.tagline}
          </motion.p>

          {/* Quick stats strip */}
          <motion.div
            variants={fadeUp}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-medium tracking-wide uppercase text-muted-foreground/60 sm:text-sm sm:gap-x-3"
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-quantum-violet/60" />
              16 Encodings
            </span>
            <span className="text-border/60">&#x2022;</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-quantum-cyan/60" />
              3 Frameworks
            </span>
            <span className="text-border/60">&#x2022;</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-quantum-emerald/60" />
              Decision Guide
            </span>
            <span className="text-border/60">&#x2022;</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-quantum-magenta/60" />
              MIT Licensed
            </span>
          </motion.div>

          {/* Primary CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button size="lg" className="glow-primary px-8 text-base" asChild>
              <Link href="/encodings">
                Explore Encodings
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base" asChild>
              <a
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                View on GitHub
              </a>
            </Button>
          </motion.div>

          {/* Secondary links */}
          <motion.div
            variants={fadeUp}
            className="mt-4 flex items-center gap-6 text-sm text-muted-foreground/70"
          >
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4 decoration-border transition-colors hover:text-foreground hover:decoration-primary"
            >
              <BookOpen className="size-3.5" />
              Documentation
            </a>
            <a
              href={EXTERNAL_LINKS.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline underline-offset-4 decoration-border transition-colors hover:text-foreground hover:decoration-primary"
            >
              <Package className="size-3.5" />
              PyPI Package
            </a>
          </motion.div>

          {/* Install command — glass card */}
          <motion.div variants={fadeUp} className="mt-8">
            <button
              onClick={handleCopy}
              className="group inline-flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 px-5 py-3 font-mono text-sm text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/60 hover:text-foreground hover:glow-ring"
              aria-label={`Copy install command: ${INSTALL_COMMAND}`}
            >
              <span className="font-bold text-quantum-violet">$</span>
              <span>{INSTALL_COMMAND}</span>
              {copied ? (
                <Check className="size-4 text-quantum-emerald" />
              ) : (
                <Copy className="size-4 opacity-40 transition-opacity group-hover:opacity-100" />
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
            <span className="text-[10px] uppercase tracking-[0.2em]">
              Scroll
            </span>
            <ChevronDown className="size-4 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
