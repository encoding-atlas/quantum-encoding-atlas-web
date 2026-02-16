"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Github, Check, Copy, BookOpen, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG, EXTERNAL_LINKS, INSTALL_COMMAND } from "@/lib/constants";
import { fadeUpBlur, staggerContainer } from "@/lib/animation-variants";
import { HeroBackground } from "./HeroBackground";
import { BlochSphere } from "./BlochSphere";

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
      <HeroBackground />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        {/* Split layout: text left, Bloch sphere right on lg+ */}
        <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Text content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl text-center lg:text-left"
          >
            {/* Overline badge */}
            <motion.div variants={fadeUpBlur}>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium tracking-wide text-primary">
                Open Source Quantum ML Toolkit
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUpBlur}
              className="mt-6 text-5xl font-extrabold tracking-tight gradient-text-quantum sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              {SITE_CONFIG.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={fadeUpBlur}
              className="mt-6 text-lg text-muted-foreground sm:text-xl lg:text-2xl lg:leading-relaxed"
            >
              {SITE_CONFIG.tagline}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeUpBlur}
              className="mt-4 max-w-xl text-sm text-muted-foreground/80 sm:text-base"
            >
              16 encoding implementations, multi-framework support, analysis
              tools, and an evidence-based decision guide — all in one Python
              package.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUpBlur}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button size="lg" className="glow-primary" asChild>
                <Link href="/encodings">
                  Explore Encodings
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <a
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <a
                  href={EXTERNAL_LINKS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="size-4" />
                  Docs
                </a>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <a
                  href={EXTERNAL_LINKS.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Package className="size-4" />
                  PyPI
                </a>
              </Button>
            </motion.div>

            {/* Pip install */}
            <motion.div variants={fadeUpBlur} className="mt-6">
              <button
                onClick={handleCopy}
                className="group inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 font-mono text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:glow-ring"
                aria-label={`Copy install command: ${INSTALL_COMMAND}`}
              >
                <span className="text-primary/70">$</span>
                <span>{INSTALL_COMMAND}</span>
                {copied ? (
                  <Check className="size-3.5 text-quantum-emerald" />
                ) : (
                  <Copy className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
                )}
              </button>
            </motion.div>
          </motion.div>

          {/* Bloch Sphere — desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 80,
              delay: 0.4,
            }}
            className="hidden lg:block"
          >
            <BlochSphere size={320} className="opacity-80" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
