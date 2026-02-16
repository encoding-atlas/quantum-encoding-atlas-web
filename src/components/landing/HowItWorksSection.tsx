"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUpBlur, staggerContainer } from "@/lib/animation-variants";

interface Step {
  number: number;
  title: string;
  language: string;
  code: ReactNode;
}

/* Syntax‑highlighted code fragments using design‑token colors */
const steps: Step[] = [
  {
    number: 1,
    title: "Install",
    language: "bash",
    code: (
      <>
        <span className="text-muted-foreground/60">$ </span>
        <span>pip install encoding-atlas</span>
      </>
    ),
  },
  {
    number: 2,
    title: "Choose Your Encoding",
    language: "python",
    code: (
      <>
        <span className="text-quantum-magenta">from</span>{" "}
        <span>encoding_atlas</span>{" "}
        <span className="text-quantum-magenta">import</span>{" "}
        <span className="text-quantum-cyan">IQPEncoding</span>
        {"\n\n"}
        <span>encoding = </span>
        <span className="text-quantum-cyan">IQPEncoding</span>
        <span>(</span>
        <span className="text-cat-angle">n_features</span>
        <span>=</span>
        <span className="text-cat-angle">4</span>
        <span>, </span>
        <span className="text-cat-angle">reps</span>
        <span>=</span>
        <span className="text-cat-angle">2</span>
        <span>)</span>
        {"\n"}
        <span className="text-quantum-cyan">print</span>
        <span>(</span>
        <span className="text-quantum-emerald">f&quot;Qubits: </span>
        <span className="text-quantum-emerald">{"{"}</span>
        <span>encoding.n_qubits</span>
        <span className="text-quantum-emerald">{"}"}&quot;</span>
        <span>)</span>
      </>
    ),
  },
  {
    number: 3,
    title: "Analyze & Compare",
    language: "python",
    code: (
      <>
        <span className="text-quantum-magenta">from</span>{" "}
        <span>encoding_atlas.analysis</span>{" "}
        <span className="text-quantum-magenta">import</span>{" "}
        <span className="text-quantum-cyan">compute_expressibility</span>
        {"\n\n"}
        <span>score = </span>
        <span className="text-quantum-cyan">compute_expressibility</span>
        <span>(</span>
        {"\n"}
        <span>{"    "}encoding, </span>
        <span className="text-cat-angle">n_samples</span>
        <span>=</span>
        <span className="text-cat-angle">1000</span>
        {"\n"}
        <span>)</span>
        {"\n"}
        <span className="text-quantum-cyan">print</span>
        <span>(</span>
        <span className="text-quantum-emerald">f&quot;Expressibility: </span>
        <span className="text-quantum-emerald">{"{"}</span>
        <span>score</span>
        <span className="text-quantum-emerald">{":"}​.4f{"}"}&quot;</span>
        <span>)</span>
      </>
    ),
  },
];

export function HowItWorksSection() {
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
            Get Started in Three Steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From installation to analysis in under a minute.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Quantum wire connector — desktop only */}
          <div className="absolute left-0 right-0 top-[22px] hidden lg:block" aria-hidden="true">
            <svg className="mx-auto" width="100%" height="8" preserveAspectRatio="none">
              <line x1="16.5%" y1="4" x2="83.5%" y2="4" stroke="var(--border)" strokeWidth="1.5" />
              {/* Gate nodes at each step */}
              <rect x="16%" y="0" width="8" height="8" rx="2" fill="var(--primary)" opacity="0.3" />
              <rect x="49.5%" y="0" width="8" height="8" rx="2" fill="var(--primary)" opacity="0.3" />
              <rect x="83%" y="0" width="8" height="8" rx="2" fill="var(--primary)" opacity="0.3" />
            </svg>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-12 lg:grid-cols-3 lg:gap-8"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeUpBlur}
                className="relative"
              >
                {/* Step number — gate-styled square */}
                <div className="relative z-10 mx-auto mb-6 flex size-11 items-center justify-center rounded-lg border-2 border-primary bg-background font-mono text-sm font-bold text-primary lg:mx-0">
                  {step.number}
                </div>

                <h3 className="mb-4 text-center text-lg font-semibold lg:text-left">
                  {step.title}
                </h3>

                {/* Code block with terminal dots */}
                <div className="overflow-hidden rounded-xl border border-border bg-secondary/50">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                    {/* Terminal dots */}
                    <span className="size-2.5 rounded-full bg-red-400/60" />
                    <span className="size-2.5 rounded-full bg-yellow-400/60" />
                    <span className="size-2.5 rounded-full bg-green-400/60" />
                    <span className="ml-2 text-xs text-muted-foreground/70">
                      {step.language}
                    </span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                    <code className="font-mono text-foreground">
                      {step.code}
                    </code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
