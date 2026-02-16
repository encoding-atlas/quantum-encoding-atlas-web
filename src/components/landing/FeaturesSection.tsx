"use client";

import { motion } from "motion/react";
import { Grid3X3, Layers, BarChart3, Compass } from "lucide-react";
import { fadeUpBlur, staggerContainer } from "@/lib/animation-variants";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const features: Feature[] = [
  {
    icon: Grid3X3,
    title: "16 Encodings",
    description:
      "From angle rotations to symmetry-equivariant feature maps. Unified API, comprehensive coverage.",
    accent: "var(--quantum-violet)",
  },
  {
    icon: Layers,
    title: "3 Frameworks",
    description:
      "PennyLane, Qiskit, Cirq. Write once, switch backends with a single parameter.",
    accent: "var(--quantum-cyan)",
  },
  {
    icon: BarChart3,
    title: "Deep Analysis",
    description:
      "Expressibility, entanglement capability, trainability, and resource costs — all quantified.",
    accent: "var(--quantum-emerald)",
  },
  {
    icon: Compass,
    title: "Decision Guide",
    description:
      "Evidence-based recommendations tailored to your data, hardware, and constraints.",
    accent: "var(--quantum-magenta)",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for quantum encoding
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A complete toolkit for exploring, implementing, and comparing
            quantum data encoding strategies.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUpBlur}>
              <div className="gradient-border group h-full rounded-xl bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
                <div
                  className="mb-4 inline-flex rounded-lg p-2.5 transition-shadow duration-300 group-hover:shadow-md"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${feature.accent} 12%, transparent)`,
                  }}
                >
                  <feature.icon
                    className="size-5"
                    style={{ color: feature.accent }}
                  />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
