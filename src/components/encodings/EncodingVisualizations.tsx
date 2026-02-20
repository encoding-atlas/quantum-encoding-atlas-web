"use client";

import dynamic from "next/dynamic";
import type { Encoding } from "@/data/encodings";
import { CircuitDiagramSkeleton } from "@/components/visualization/CircuitDiagramSkeleton";
import { RadarChartSkeleton } from "@/components/visualization/RadarChartSkeleton";

const CircuitDiagram = dynamic(
  () =>
    import("@/components/visualization/CircuitDiagram").then((m) => ({
      default: m.CircuitDiagram,
    })),
  { ssr: false, loading: () => <CircuitDiagramSkeleton /> },
);

const PropertyRadar = dynamic(
  () =>
    import("@/components/visualization/PropertyRadar").then((m) => ({
      default: m.PropertyRadar,
    })),
  { ssr: false, loading: () => <RadarChartSkeleton /> },
);

export function LazyCircuitDiagram({ encoding }: { encoding: Encoding }) {
  return <CircuitDiagram encoding={encoding} />;
}

export function LazyPropertyRadar({ encoding }: { encoding: Encoding }) {
  return <PropertyRadar encoding={encoding} />;
}
