"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { getEncodingById } from "@/data/encodings";
import {
  recommendEncoding,
  getDecisionPath,
} from "@/lib/recommender";
import type { GuideInput } from "@/data/encodings/types";
import { RecommendationCard } from "./RecommendationCard";
import { AlternativeCard } from "./AlternativeCard";
import { InputSummary } from "./InputSummary";
import { DecisionTreeViz } from "./DecisionTreeViz";
import { ShareButton } from "./ShareButton";

interface GuideResultsProps {
  answers: Partial<GuideInput>;
  onEdit: () => void;
  onReset: () => void;
}

export function GuideResults({ answers, onEdit, onReset }: GuideResultsProps) {
  const result = useMemo(() => {
    try {
      return recommendEncoding(answers);
    } catch {
      return null;
    }
  }, [answers]);

  const decisionPath = useMemo(() => {
    try {
      return getDecisionPath(answers);
    } catch {
      return [];
    }
  }, [answers]);

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl text-center py-12">
        <p className="text-muted-foreground">
          Could not generate a recommendation. Please try again with different
          parameters.
        </p>
        <Button type="button" variant="outline" onClick={onReset} className="mt-4">
          Start Over
        </Button>
      </div>
    );
  }

  const primaryEncoding = getEncodingById(result.encodingId);
  const alternativeEncodings = result.alternatives
    .map((id) => ({ id, encoding: getEncodingById(id) }))
    .filter(
      (a): a is { id: string; encoding: NonNullable<typeof a.encoding> } =>
        a.encoding !== undefined
    );

  if (!primaryEncoding) {
    return (
      <div className="mx-auto max-w-2xl text-center py-12">
        <p className="text-muted-foreground">
          Encoding data not found. Please try again.
        </p>
        <Button type="button" variant="outline" onClick={onReset} className="mt-4">
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className="mx-auto max-w-4xl space-y-8"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Your Recommended Encoding
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on your problem characteristics
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Start Over
        </Button>
      </div>

      {/* Primary recommendation */}
      <RecommendationCard
        encoding={primaryEncoding}
        explanation={result.explanation}
        confidence={result.confidence}
      />

      {/* Alternatives */}
      {alternativeEncodings.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Alternatives
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alternativeEncodings.map((alt, index) => (
              <AlternativeCard
                key={alt.id}
                encoding={alt.encoding}
                rank={index + 2}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Decision tree */}
      {decisionPath.length > 0 && (
        <DecisionTreeViz
          steps={decisionPath}
          scoringResult={result.encodingId}
        />
      )}

      {/* Input summary */}
      <InputSummary input={answers} onEdit={onEdit} />

      {/* Share */}
      <div className="flex justify-center">
        <ShareButton />
      </div>
    </motion.div>
  );
}
