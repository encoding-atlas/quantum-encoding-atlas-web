"use client";

import dynamic from "next/dynamic";
import { useCompareEncodings } from "@/hooks/useCompareEncodings";
import { EncodingSelector } from "@/components/visualization/EncodingSelector";
import { ComparisonTable } from "@/components/visualization/ComparisonTable";
import { CircuitDiagramSkeleton } from "@/components/visualization/CircuitDiagramSkeleton";
import { RadarChartSkeleton } from "@/components/visualization/RadarChartSkeleton";
import Link from "next/link";

const ComparisonRadar = dynamic(
  () =>
    import("@/components/visualization/ComparisonRadar").then((m) => ({
      default: m.ComparisonRadar,
    })),
  { ssr: false, loading: () => <RadarChartSkeleton /> },
);

const ComparisonBarChart = dynamic(
  () =>
    import("@/components/visualization/ComparisonBarChart").then((m) => ({
      default: m.ComparisonBarChart,
    })),
  { ssr: false },
);

const CircuitDiagram = dynamic(
  () =>
    import("@/components/visualization/CircuitDiagram").then((m) => ({
      default: m.CircuitDiagram,
    })),
  { ssr: false, loading: () => <CircuitDiagramSkeleton /> },
);

export function CompareClient() {
  const {
    selectedEncodings,
    selectedSlugs,
    canAdd,
    hasEnough,
    addEncoding,
    removeEncoding,
    clearAll,
  } = useCompareEncodings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Compare Encodings
      </h1>
      <p className="mt-2 text-muted-foreground">
        Select 2&ndash;4 encodings to compare properties, resource costs,
        and trade-offs.
      </p>

      {/* Encoding selector */}
      <div className="mt-8">
        <EncodingSelector
          selectedSlugs={selectedSlugs}
          canAdd={canAdd}
          onAdd={addEncoding}
          onRemove={removeEncoding}
          onClear={clearAll}
        />
      </div>

      {/* Content: only when >= 2 encodings selected */}
      {!hasEnough && (
        <div className="mt-12 flex items-center justify-center rounded-lg border border-dashed border-border bg-card p-16">
          <p className="text-sm text-muted-foreground">
            {selectedSlugs.length === 0
              ? "Select at least 2 encodings to start comparing."
              : "Select one more encoding to begin comparison."}
          </p>
        </div>
      )}

      {hasEnough && (
        <div className="mt-10 space-y-12">
          {/* Overlaid Radar Chart */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              Property Comparison
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Overlaid radar chart comparing encoding property profiles.
            </p>
            <div className="mt-4">
              <ComparisonRadar encodings={selectedEncodings} />
            </div>
          </section>

          {/* Bar Charts */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              Resource Comparison
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Side-by-side comparison of resource requirements and
              properties.
            </p>
            <div className="mt-4">
              <ComparisonBarChart encodings={selectedEncodings} />
            </div>
          </section>

          {/* Summary Table */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              Summary Table
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete property comparison across all selected encodings.
            </p>
            <div className="mt-4 rounded-lg border border-border">
              <ComparisonTable encodings={selectedEncodings} />
            </div>
          </section>

          {/* Circuit Thumbnails */}
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              Circuit Diagrams
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Compact circuit diagrams for each selected encoding.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {selectedEncodings.map((enc) => (
                <div key={enc.slug} className="space-y-2">
                  <Link
                    href={`/encodings/${enc.slug}`}
                    className="block text-sm font-medium hover:underline"
                  >
                    {enc.name}
                  </Link>
                  <CircuitDiagram
                    encoding={enc}
                    interactive={false}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
