"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Github,
  BookOpen,
  Package,
  FileCode2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXTERNAL_LINKS } from "@/lib/constants";
import { fadeUpBlur, staggerContainer } from "@/lib/animation-variants";

const resources = [
  { label: "GitHub", href: EXTERNAL_LINKS.github, icon: Github },
  { label: "PyPI", href: EXTERNAL_LINKS.pypi, icon: Package },
  { label: "Documentation", href: EXTERNAL_LINKS.docs, icon: BookOpen },
  { label: "API Reference", href: EXTERNAL_LINKS.apiReference, icon: FileCode2 },
];

export function FooterCTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "linear-gradient(135deg, var(--quantum-violet), var(--quantum-cyan))",
        }}
        aria-hidden="true"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.h2
          variants={fadeUpBlur}
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Ready to find the right encoding?
        </motion.h2>
        <motion.p
          variants={fadeUpBlur}
          className="mx-auto mt-4 max-w-xl text-muted-foreground"
        >
          Explore all 16 quantum data encodings, compare their properties, or
          let our decision guide recommend one for your specific use case.
        </motion.p>

        <motion.div
          variants={fadeUpBlur}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="glow-primary" asChild>
            <Link href="/encodings">
              Browse Encodings
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/guide">Try the Decision Guide</Link>
          </Button>
        </motion.div>

        {/* Resource links */}
        <motion.div
          variants={fadeUpBlur}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          {resources.map((res) => (
            <a
              key={res.label}
              href={res.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <res.icon className="size-4 opacity-60 group-hover:opacity-100" />
              {res.label}
            </a>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={fadeUpBlur}
          className="mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground/60"
        >
          <span>MIT Licensed</span>
          <span aria-hidden="true">&middot;</span>
          <span>Python 3.9+</span>
          <span aria-hidden="true">&middot;</span>
          <span>Framework Agnostic</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
