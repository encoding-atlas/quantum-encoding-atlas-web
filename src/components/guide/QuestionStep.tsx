"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { slideStep } from "@/lib/animation-variants";

interface QuestionStepProps {
  stepKey: string;
  direction: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export function QuestionStep({
  stepKey,
  direction,
  title,
  description,
  children,
}: QuestionStepProps) {
  return (
    <motion.div
      key={stepKey}
      custom={direction}
      variants={slideStep}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            {description}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  );
}
