"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/encodings/CategoryBadge";
import { RadarChartSkeleton } from "@/components/visualization/RadarChartSkeleton";
import { ConfidenceBar } from "./ConfidenceBar";
import type { Encoding } from "@/data/encodings/types";

const PropertyRadar = dynamic(
  () =>
    import("@/components/visualization/PropertyRadar").then((m) => ({
      default: m.PropertyRadar,
    })),
  { ssr: false, loading: () => <RadarChartSkeleton /> }
);

interface RecommendationCardProps {
  encoding: Encoding;
  explanation: string;
  confidence: number;
}

export function RecommendationCard({
  encoding,
  explanation,
  confidence,
}: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
    >
      <Card className="overflow-hidden border-2">
        <CardContent className="p-0">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: info */}
            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <CategoryBadge categoryId={encoding.category} />
                <h3 className="text-2xl font-bold tracking-tight">
                  {encoding.name}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {explanation}
              </p>

              <ConfidenceBar confidence={confidence} />

              {/* Key properties */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Qubits: </span>
                  <span className="font-medium">
                    {encoding.properties.nQubits}
                  </span>
                </div>
                <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Depth: </span>
                  <span className="font-medium">
                    {encoding.properties.depth}
                  </span>
                </div>
                <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Entangling: </span>
                  <span className="font-medium">
                    {encoding.properties.isEntangling ? "Yes" : "No"}
                  </span>
                </div>
                <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
                  <span className="text-muted-foreground">Simulable: </span>
                  <span className="font-medium">
                    {encoding.properties.simulability === "simulable"
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
              </div>

              <Button asChild variant="default" size="sm">
                <Link href={`/encodings/${encoding.slug}`}>
                  View Full Details
                  <ArrowRight
                    className="ml-2 h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>

            {/* Right: radar chart */}
            <div className="flex items-center justify-center bg-muted/30 p-4">
              <PropertyRadar encoding={encoding} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
