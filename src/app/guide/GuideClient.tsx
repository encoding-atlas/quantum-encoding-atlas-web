"use client";

import { AnimatePresence, motion } from "motion/react";
import { useGuideWizard } from "@/hooks/useGuideWizard";
import { GuideWizard } from "@/components/guide/GuideWizard";
import { GuideResults } from "@/components/guide/GuideResults";

export function GuideClient() {
  const wizard = useGuideWizard();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {wizard.showResults ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <GuideResults
              answers={wizard.answers}
              onEdit={wizard.editAnswers}
              onReset={wizard.reset}
            />
          </motion.div>
        ) : (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-tight">
                Encoding Decision Guide
              </h1>
              <p className="mt-2 text-muted-foreground">
                Answer a few questions about your data and hardware to get a
                personalized encoding recommendation.
              </p>
            </div>
            <GuideWizard wizard={wizard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
