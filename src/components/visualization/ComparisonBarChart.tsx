"use client";

import { memo, useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";
import type { Encoding } from "@/data/encodings";
import { CHART_COLORS } from "./color-utils";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Property definitions
// ---------------------------------------------------------------------------

interface PropertyDef {
  key: string;
  label: string;
  getValue: (enc: Encoding) => number | null;
  format: (v: number) => string;
  domain?: [number, number];
}

const PROPERTIES: PropertyDef[] = [
  {
    key: "nQubits",
    label: "Qubits",
    getValue: (e) => e.properties.nQubits,
    format: (v) => String(v),
  },
  {
    key: "depth",
    label: "Circuit Depth",
    getValue: (e) => e.properties.depth,
    format: (v) => String(v),
  },
  {
    key: "gateCount",
    label: "Total Gates",
    getValue: (e) => e.properties.gateCount,
    format: (v) => String(v),
  },
  {
    key: "twoQubitGates",
    label: "Two-Qubit Gates",
    getValue: (e) => e.properties.twoQubitGates,
    format: (v) => String(v),
  },
  {
    key: "expressibility",
    label: "Expressibility",
    getValue: (e) => e.properties.expressibility ?? null,
    format: (v) => v.toFixed(2),
    domain: [0, 1],
  },
  {
    key: "entanglementCapability",
    label: "Entanglement",
    getValue: (e) => e.properties.entanglementCapability ?? null,
    format: (v) => v.toFixed(2),
    domain: [0, 1],
  },
  {
    key: "trainabilityEstimate",
    label: "Trainability",
    getValue: (e) => e.properties.trainabilityEstimate ?? null,
    format: (v) => v.toFixed(2),
    domain: [0, 1],
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MARGIN = { top: 8, right: 60, bottom: 8, left: 120 };
const ROW_HEIGHT = 44;
const BAR_HEIGHT = 10;
const BAR_GAP = 2;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ComparisonBarChartProps {
  encodings: Encoding[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ComparisonBarChartInner({
  encodings,
  className,
}: ComparisonBarChartProps) {
  const nEncodings = encodings.length;
  const height = MARGIN.top + PROPERTIES.length * ROW_HEIGHT + MARGIN.bottom;
  const width = 560;
  const chartWidth = width - MARGIN.left - MARGIN.right;

  const yScale = useMemo(
    () =>
      scaleBand<string>({
        domain: PROPERTIES.map((p) => p.key),
        range: [0, PROPERTIES.length * ROW_HEIGHT],
        padding: 0.3,
      }),
    [],
  );

  const xScales = useMemo(() => {
    const scales: Record<string, ReturnType<typeof scaleLinear<number>>> = {};
    for (const prop of PROPERTIES) {
      if (prop.domain) {
        scales[prop.key] = scaleLinear<number>({
          domain: prop.domain,
          range: [0, chartWidth],
        });
      } else {
        let max = 0;
        for (const enc of encodings) {
          const v = prop.getValue(enc);
          if (v !== null && v > max) max = v;
        }
        scales[prop.key] = scaleLinear<number>({
          domain: [0, max * 1.15 || 1],
          range: [0, chartWidth],
        });
      }
    }
    return scales;
  }, [encodings, chartWidth]);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        style={{ minWidth: 400 }}
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          {PROPERTIES.map((prop) => {
            const rowY = yScale(prop.key) ?? 0;
            const xScale = xScales[prop.key];
            const bandwidth = yScale.bandwidth();
            const groupHeight = nEncodings * (BAR_HEIGHT + BAR_GAP) - BAR_GAP;
            const groupOffset = (bandwidth - groupHeight) / 2;

            return (
              <Group key={prop.key} top={rowY}>
                {/* Property label */}
                <Text
                  x={-8}
                  y={bandwidth / 2}
                  textAnchor="end"
                  verticalAnchor="middle"
                  fontSize={11}
                  fill="var(--foreground)"
                  fontWeight={500}
                >
                  {prop.label}
                </Text>

                {/* Subtle baseline */}
                <line
                  x1={0}
                  y1={bandwidth}
                  x2={chartWidth}
                  y2={bandwidth}
                  stroke="var(--border)"
                  strokeWidth={0.5}
                  opacity={0.4}
                />

                {/* Bars per encoding */}
                {encodings.map((enc, ei) => {
                  const value = prop.getValue(enc);
                  if (value === null) return null;

                  const barWidth = Math.max(xScale(value), 1);
                  const barY =
                    groupOffset + ei * (BAR_HEIGHT + BAR_GAP);
                  const color =
                    CHART_COLORS[ei % CHART_COLORS.length];

                  return (
                    <g key={enc.slug}>
                      <Bar
                        x={0}
                        y={barY}
                        width={barWidth}
                        height={BAR_HEIGHT}
                        rx={3}
                        fill={color}
                        opacity={0.85}
                      />
                      {/* Value label */}
                      <Text
                        x={barWidth + 4}
                        y={barY + BAR_HEIGHT / 2}
                        verticalAnchor="middle"
                        fontSize={9}
                        fontFamily="var(--font-mono)"
                        fill="var(--muted-foreground)"
                      >
                        {prop.format(value)}
                      </Text>
                    </g>
                  );
                })}
              </Group>
            );
          })}
        </Group>
      </svg>
    </div>
  );
}

export const ComparisonBarChart = memo(ComparisonBarChartInner);
