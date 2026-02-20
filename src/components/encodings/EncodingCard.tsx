"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Zap, Layers, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";
import type { Encoding, EncodingCategoryId } from "@/data/encodings";

const COLOR_MAP: Record<EncodingCategoryId, string> = {
  "angle-based": "var(--cat-angle)",
  "amplitude-based": "var(--cat-amplitude)",
  basis: "var(--cat-basis)",
  entangling: "var(--cat-entangling)",
  variational: "var(--cat-variational)",
  "physics-inspired": "var(--cat-physics)",
  symmetry: "var(--cat-symmetry)",
};

interface EncodingCardProps {
  encoding: Encoding;
  className?: string;
}

export function EncodingCard({ encoding, className }: EncodingCardProps) {
  const color = COLOR_MAP[encoding.category];
  const { properties } = encoding;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", damping: 25, stiffness: 120 },
        },
      }}
    >
      <Link
        href={`/encodings/${encoding.slug}`}
        className={cn(
          "group block h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          className,
        )}
        style={{
          borderTopWidth: "3px",
          borderTopColor: color,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge categoryId={encoding.category} />
          {properties.isEntangling && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `color-mix(in oklch, ${color} 8%, transparent)`,
                color,
              }}
            >
              <Zap className="size-2.5" />
              Entangling
            </span>
          )}
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight">
          {encoding.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {encoding.shortDescription}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Cpu className="size-3 opacity-60" />
            {properties.nQubits} qubits
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3 opacity-60" />
            Depth {properties.depth}
          </span>
          <span className="inline-flex items-center gap-1">
            {properties.simulability === "simulable"
              ? "Simulable"
              : properties.simulability === "conditionally_simulable"
                ? "Conditional"
                : "Not simulable"}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-muted-foreground/70 transition-colors group-hover:text-foreground">
          View details
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
