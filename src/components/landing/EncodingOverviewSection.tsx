"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { fadeUpBlur, staggerContainer } from "@/lib/animation-variants";

const ENCODING_DISPLAY_NAMES: Record<string, string> = {
  angle: "Angle",
  "higher-order-angle": "Higher-Order Angle",
  amplitude: "Amplitude",
  basis: "Basis",
  iqp: "IQP",
  "zz-feature-map": "ZZ Feature Map",
  "pauli-feature-map": "Pauli Feature Map",
  "data-reuploading": "Data Reuploading",
  "hardware-efficient": "Hardware-Efficient",
  qaoa: "QAOA",
  hamiltonian: "Hamiltonian",
  trainable: "Trainable",
  "symmetry-inspired": "Symmetry-Inspired",
  "so2-equivariant": "SO(2) Equivariant",
  "cyclic-equivariant": "Cyclic Equivariant",
  "swap-equivariant": "Swap Equivariant",
};

interface CategoryCard {
  label: string;
  colorVar: string;
  description: string;
  encodings: string[];
}

const categories: CategoryCard[] = [
  {
    label: "Angle-based",
    colorVar: "var(--cat-angle)",
    description: "Map features to qubit rotation angles",
    encodings: ["angle", "higher-order-angle"],
  },
  {
    label: "Amplitude-based",
    colorVar: "var(--cat-amplitude)",
    description: "Encode data into quantum state amplitudes",
    encodings: ["amplitude"],
  },
  {
    label: "Basis",
    colorVar: "var(--cat-basis)",
    description: "Map binary data to computational basis states",
    encodings: ["basis"],
  },
  {
    label: "Entangling Feature Maps",
    colorVar: "var(--cat-entangling)",
    description: "Capture feature correlations via entanglement",
    encodings: ["iqp", "zz-feature-map", "pauli-feature-map"],
  },
  {
    label: "Variational",
    colorVar: "var(--cat-variational)",
    description: "Parameterized circuits with trainable layers",
    encodings: ["data-reuploading", "hardware-efficient", "qaoa", "trainable"],
  },
  {
    label: "Physics-inspired",
    colorVar: "var(--cat-physics)",
    description: "Encodings modeled on physical time evolution",
    encodings: ["hamiltonian"],
  },
  {
    label: "Symmetry & Equivariant",
    colorVar: "var(--cat-symmetry)",
    description: "Respect symmetry structures in data",
    encodings: [
      "symmetry-inspired",
      "so2-equivariant",
      "cyclic-equivariant",
      "swap-equivariant",
    ],
  },
];

export function EncodingOverviewSection() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore 16 Quantum Encodings
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Organized into seven families based on circuit structure and
            mathematical properties.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat) => (
            <motion.div key={cat.label} variants={fadeUpBlur}>
              <Link
                href="/encodings"
                className="group block h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  borderTopWidth: "3px",
                  borderTopColor: cat.colorVar,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{cat.label}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.encodings.map((slug) => (
                    <span
                      key={slug}
                      className="rounded-md px-2 py-0.5 text-xs"
                      style={{
                        backgroundColor: `color-mix(in oklch, ${cat.colorVar} 10%, transparent)`,
                        color: cat.colorVar,
                      }}
                    >
                      {ENCODING_DISPLAY_NAMES[slug] ?? slug}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground/70">
                  {cat.encodings.length}{" "}
                  {cat.encodings.length === 1 ? "encoding" : "encodings"}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
