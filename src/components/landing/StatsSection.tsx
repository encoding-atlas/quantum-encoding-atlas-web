"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Grid3X3,
  Layers,
  BarChart3,
  Scale,
  FolderTree,
} from "lucide-react";
import { fadeUpBlur } from "@/lib/animation-variants";
import type { LucideIcon } from "lucide-react";

interface Stat {
  value: string;
  numericValue?: number;
  label: string;
  icon: LucideIcon;
  suffix?: string;
}

const stats: Stat[] = [
  { value: "16", numericValue: 16, label: "Encoding Methods", icon: Grid3X3 },
  { value: "3", numericValue: 3, label: "Quantum Frameworks", icon: Layers },
  { value: "5", numericValue: 5, label: "Analysis Dimensions", icon: BarChart3 },
  { value: "7", numericValue: 7, label: "Encoding Categories", icon: FolderTree },
  { value: "MIT", label: "Open Source License", icon: Scale },
];

function useCountUp(target: number, duration: number, shouldStart: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    let frame: number;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, shouldStart]);

  return count;
}

function AnimatedStat({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(stat.numericValue ?? 0, 1200, inView);
  const Icon = stat.icon;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-4 py-8">
      <Icon className="size-5 text-muted-foreground/50" />
      <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {stat.numericValue != null ? count : stat.value}
        {stat.suffix ?? ""}
      </span>
      <span className="text-xs text-muted-foreground">{stat.label}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <motion.div
        variants={fadeUpBlur}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
