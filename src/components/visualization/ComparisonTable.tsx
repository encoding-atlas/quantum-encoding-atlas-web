import type { Encoding } from "@/data/encodings";
import { ENCODING_CATEGORIES } from "@/data/categories";
import { CHART_COLORS } from "./color-utils";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ComparisonTableProps {
  encodings: Encoding[];
  className?: string;
}

interface RowDef {
  label: string;
  getValue: (enc: Encoding) => string | number | boolean | null | undefined;
  type: "text" | "number" | "boolean";
  lowerIsBetter?: boolean;
  higherIsBetter?: boolean;
}

// ---------------------------------------------------------------------------
// Row definitions
// ---------------------------------------------------------------------------

const ROWS: RowDef[] = [
  {
    label: "Category",
    getValue: (e) => {
      const cat = ENCODING_CATEGORIES.find((c) => c.id === e.category);
      return cat?.name ?? e.category;
    },
    type: "text",
  },
  {
    label: "Qubits",
    getValue: (e) => e.properties.nQubits,
    type: "number",
    lowerIsBetter: true,
  },
  {
    label: "Circuit Depth",
    getValue: (e) => e.properties.depth,
    type: "number",
    lowerIsBetter: true,
  },
  {
    label: "Total Gates",
    getValue: (e) => e.properties.gateCount,
    type: "number",
    lowerIsBetter: true,
  },
  {
    label: "Single-Qubit Gates",
    getValue: (e) => e.properties.singleQubitGates,
    type: "number",
    lowerIsBetter: true,
  },
  {
    label: "Two-Qubit Gates",
    getValue: (e) => e.properties.twoQubitGates,
    type: "number",
    lowerIsBetter: true,
  },
  {
    label: "Parameters",
    getValue: (e) => e.properties.parameterCount,
    type: "number",
  },
  {
    label: "Entangling",
    getValue: (e) => e.properties.isEntangling,
    type: "boolean",
  },
  {
    label: "Simulability",
    getValue: (e) =>
      e.properties.simulability === "simulable"
        ? "Simulable"
        : e.properties.simulability === "conditionally_simulable"
          ? "Conditional"
          : "Not Simulable",
    type: "text",
  },
  {
    label: "Expressibility",
    getValue: (e) => e.properties.expressibility ?? null,
    type: "number",
    higherIsBetter: true,
  },
  {
    label: "Entanglement Capability",
    getValue: (e) => e.properties.entanglementCapability ?? null,
    type: "number",
  },
  {
    label: "Trainability",
    getValue: (e) => e.properties.trainabilityEstimate ?? null,
    type: "number",
    higherIsBetter: true,
  },
  {
    label: "Noise Resilience",
    getValue: (e) => e.properties.noiseResilienceEstimate ?? null,
    type: "number",
    higherIsBetter: true,
  },
  {
    label: "Qubit Scaling",
    getValue: (e) => e.guideRules.qubitScaling,
    type: "text",
  },
  {
    label: "Depth Class",
    getValue: (e) => e.guideRules.circuitDepth,
    type: "text",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findBestIndex(
  values: (string | number | boolean | null | undefined)[],
  row: RowDef,
): number | null {
  if (!row.lowerIsBetter && !row.higherIsBetter) return null;

  let bestIdx: number | null = null;
  let bestVal: number | null = null;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (typeof v !== "number") continue;

    if (
      bestVal === null ||
      (row.lowerIsBetter && v < bestVal) ||
      (row.higherIsBetter && v > bestVal)
    ) {
      bestVal = v;
      bestIdx = i;
    }
  }

  return bestIdx;
}

function formatValue(
  value: string | number | boolean | null | undefined,
  type: RowDef["type"],
): string {
  if (value === null || value === undefined) return "\u2014";
  if (type === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    return value < 1 && value > 0 ? value.toFixed(2) : String(value);
  }
  return String(value);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ComparisonTable({
  encodings,
  className,
}: ComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-background px-3 py-2 text-left text-xs font-medium text-muted-foreground"
            >
              Property
            </th>
            {encodings.map((enc, i) => (
              <th
                key={enc.slug}
                scope="col"
                className="px-3 py-2 text-left text-xs font-semibold"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                  {enc.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const values = encodings.map((enc) => row.getValue(enc));
            const bestIdx = findBestIndex(values, row);

            return (
              <tr key={row.label} className="border-t border-border/50">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-background px-3 py-2 text-left text-xs font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                {values.map((value, i) => {
                  const isBest = bestIdx === i;
                  const formatted = formatValue(value, row.type);

                  return (
                    <td
                      key={encodings[i].slug}
                      className={cn(
                        "px-3 py-2 font-mono text-xs",
                        value === null || value === undefined
                          ? "text-muted-foreground/40"
                          : "",
                        isBest &&
                          "bg-emerald-500/5 font-semibold text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      {row.type === "boolean" && value !== null && value !== undefined ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1",
                            value
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground",
                          )}
                        >
                          {value ? "\u2713" : "\u2717"}{" "}
                          {formatted}
                        </span>
                      ) : (
                        formatted
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
