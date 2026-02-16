"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { fadeUpBlur } from "@/lib/animation-variants";
import { EncodingVisual } from "./EncodingVisual";

interface CarouselEncoding {
  name: string;
  slug: string;
  category: string;
  categoryColor: string;
  description: string;
}

const ENCODINGS: CarouselEncoding[] = [
  { name: "Angle Encoding", slug: "angle", category: "Angle-based", categoryColor: "var(--cat-angle)", description: "Maps each classical feature to a single-qubit rotation angle." },
  { name: "Higher-Order Angle", slug: "higher-order-angle", category: "Angle-based", categoryColor: "var(--cat-angle)", description: "Applies nonlinear functions of features as rotation angles." },
  { name: "Amplitude Encoding", slug: "amplitude", category: "Amplitude-based", categoryColor: "var(--cat-amplitude)", description: "Encodes normalized data into quantum state amplitudes." },
  { name: "Basis Encoding", slug: "basis", category: "Basis", categoryColor: "var(--cat-basis)", description: "Maps binary data directly to computational basis states." },
  { name: "IQP Encoding", slug: "iqp", category: "Entangling", categoryColor: "var(--cat-entangling)", description: "Diagonal gates with Hadamard layers creating hard-to-simulate circuits." },
  { name: "ZZ Feature Map", slug: "zz-feature-map", category: "Entangling", categoryColor: "var(--cat-entangling)", description: "Pairwise ZZ interactions capturing feature correlations." },
  { name: "Pauli Feature Map", slug: "pauli-feature-map", category: "Entangling", categoryColor: "var(--cat-entangling)", description: "Multi-Pauli entangling gates with tunable interaction order." },
  { name: "Data Reuploading", slug: "data-reuploading", category: "Variational", categoryColor: "var(--cat-variational)", description: "Feeds classical data multiple times into a parameterized circuit." },
  { name: "Hardware-Efficient", slug: "hardware-efficient", category: "Variational", categoryColor: "var(--cat-variational)", description: "Brick-layer ansatz matching native hardware gate connectivity." },
  { name: "QAOA Encoding", slug: "qaoa", category: "Variational", categoryColor: "var(--cat-variational)", description: "Alternating cost and mixer layers inspired by optimization." },
  { name: "Trainable Encoding", slug: "trainable", category: "Variational", categoryColor: "var(--cat-variational)", description: "Learnable parameters optimized jointly with the model." },
  { name: "Hamiltonian", slug: "hamiltonian", category: "Physics", categoryColor: "var(--cat-physics)", description: "Time evolution under a problem-specific Hamiltonian operator." },
  { name: "Symmetry-Inspired", slug: "symmetry-inspired", category: "Symmetry", categoryColor: "var(--cat-symmetry)", description: "Feature maps respecting the symmetry structure of the data." },
  { name: "SO(2) Equivariant", slug: "so2-equivariant", category: "Symmetry", categoryColor: "var(--cat-symmetry)", description: "Circuits equivariant under continuous rotational symmetry." },
  { name: "Cyclic Equivariant", slug: "cyclic-equivariant", category: "Symmetry", categoryColor: "var(--cat-symmetry)", description: "Preserves cyclic group symmetry in the encoding circuit." },
  { name: "Swap Equivariant", slug: "swap-equivariant", category: "Symmetry", categoryColor: "var(--cat-symmetry)", description: "Encoding invariant under permutation of input features." },
];

const AUTO_INTERVAL = 4000;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerSnapshot = () => false;

function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function EncodingCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const reducedMotion = useReducedMotion();

  const goTo = useCallback(
    (index: number, dir?: number) => {
      setDirection(dir ?? (index > activeIndex ? 1 : -1));
      setActiveIndex(((index % ENCODINGS.length) + ENCODINGS.length) % ENCODINGS.length);
    },
    [activeIndex],
  );

  const next = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || reducedMotion) return;
    intervalRef.current = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, next, reducedMotion]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [next, prev],
  );

  // Get visible encodings (3 centered around active)
  const getVisibleIndices = () => {
    const total = ENCODINGS.length;
    return [
      ((activeIndex - 1) + total) % total,
      activeIndex,
      (activeIndex + 1) % total,
    ];
  };

  const visible = getVisibleIndices();
  const encoding = ENCODINGS[activeIndex];

  return (
    <section className="border-t border-border bg-secondary/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Visualize Every Encoding
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Each of the 16 encoding techniques transforms classical data into
            quantum states differently. Explore how they work.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16"
          role="region"
          aria-roledescription="carousel"
          aria-label="Encoding techniques"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Cards container */}
          <div className="relative">
            {/* Nav arrows */}
            <button
              onClick={prev}
              className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:text-foreground sm:-left-5"
              aria-label="Previous encoding"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:text-foreground sm:-right-5"
              aria-label="Next encoding"
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Card display */}
            <div className="overflow-hidden px-8 sm:px-12">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((idx, pos) => {
                  const enc = ENCODINGS[idx];
                  const isCenter = pos === 1;
                  return (
                    <AnimatePresence key={`${idx}-${pos}`} mode="popLayout">
                      <motion.div
                        key={`card-${idx}`}
                        initial={reducedMotion ? {} : { opacity: 0, x: direction * 60, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={reducedMotion ? {} : { opacity: 0, x: -direction * 60, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`${pos === 0 ? "hidden md:block" : ""} ${pos === 2 ? "hidden lg:block" : ""}`}
                      >
                        <Link
                          href={`/encodings/${enc.slug}`}
                          className={`group block rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isCenter ? "border-primary/20 shadow-md" : "border-border"}`}
                          style={{
                            borderTopWidth: "3px",
                            borderTopColor: enc.categoryColor,
                          }}
                          aria-roledescription="slide"
                          aria-label={enc.name}
                        >
                          {/* Category badge */}
                          <span
                            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: `color-mix(in oklch, ${enc.categoryColor} 15%, transparent)`,
                              color: enc.categoryColor,
                            }}
                          >
                            {enc.category}
                          </span>

                          {/* Encoding name */}
                          <h3 className="mt-3 text-lg font-semibold">
                            {enc.name}
                          </h3>

                          {/* Visual */}
                          <div className="my-4 flex justify-center">
                            <EncodingVisual slug={enc.slug} size={90} />
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {enc.description}
                          </p>

                          {/* Learn more */}
                          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            Learn more
                            <ArrowRight className="size-3" />
                          </div>
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="mt-8 flex items-center justify-center gap-1.5">
            {ENCODINGS.map((enc, i) => (
              <button
                key={enc.slug}
                onClick={() => goTo(i)}
                className="group relative p-1"
                aria-label={`Go to ${enc.name}`}
                aria-current={i === activeIndex ? "true" : undefined}
              >
                <span
                  className="block h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "24px" : "8px",
                    backgroundColor:
                      i === activeIndex
                        ? enc.categoryColor
                        : "var(--border)",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Current encoding label */}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {activeIndex + 1} / {ENCODINGS.length} &middot; {encoding.name}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
