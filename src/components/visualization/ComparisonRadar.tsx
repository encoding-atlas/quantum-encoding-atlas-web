"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { Group } from "@visx/group";
import { Line, LinePath } from "@visx/shape";
import { Text } from "@visx/text";
import { Point } from "@visx/point";
import type { Encoding } from "@/data/encodings";
import { encodings as allEncodings } from "@/data/encodings";
import {
  RADAR_AXES,
  computeGateCountRange,
  computeResourceEfficiency,
  getRadarValues,
  computeRadarPoints,
  computeGridPolygon,
} from "./radar-utils";
import { CHART_COLORS } from "./color-utils";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRID_LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0];
const LABEL_PADDING = 45;

const gateCountRange = computeGateCountRange(allEncodings);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ComparisonRadarProps {
  encodings: Encoding[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ComparisonRadarInner({
  encodings,
  className,
}: ComparisonRadarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 380;
  const radius = (size - LABEL_PADDING * 2) / 2;
  const center = useMemo(() => ({ x: size / 2, y: size / 2 }), [size]);

  const encodingData = useMemo(
    () =>
      encodings.map((enc) => {
        const efficiency = computeResourceEfficiency(
          enc.properties.gateCount,
          gateCountRange,
        );
        const values = getRadarValues(enc.properties, efficiency);
        const points = computeRadarPoints(values, radius, center);
        return { encoding: enc, values, points };
      }),
    [encodings, radius, center],
  );

  const handleLegendEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleLegendLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <div className={cn("mx-auto max-w-[450px]", className)}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
        <Group>
          {/* Concentric grid */}
          {GRID_LEVELS.map((level) => {
            const points = computeGridPolygon(level, radius, center);
            const d =
              points
                .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                .join(" ") + " Z";
            return (
              <path
                key={level}
                d={d}
                fill="none"
                stroke="var(--border)"
                strokeWidth={0.5}
                opacity={0.6}
              />
            );
          })}

          {/* Axis lines */}
          {RADAR_AXES.map((axis, i) => (
            <Line
              key={`axis-${i}`}
              from={new Point({ x: center.x, y: center.y })}
              to={
                new Point({
                  x: center.x + radius * Math.cos(axis.angle),
                  y: center.y + radius * Math.sin(axis.angle),
                })
              }
              stroke="var(--border)"
              strokeWidth={0.5}
              opacity={0.6}
            />
          ))}

          {/* Grid level labels */}
          {GRID_LEVELS.map((level) => (
            <Text
              key={`glabel-${level}`}
              x={center.x + 4}
              y={center.y - radius * level + 1}
              fontSize={8}
              fill="var(--muted-foreground)"
              fontFamily="var(--font-mono)"
              opacity={0.5}
            >
              {level.toFixed(1)}
            </Text>
          ))}

          {/* Data polygons */}
          {encodingData.map(({ points }, encIdx) => {
            const color = CHART_COLORS[encIdx % CHART_COLORS.length];
            const isHovered = hoveredIndex === encIdx;
            const isDimmed = hoveredIndex !== null && !isHovered;
            const polygonPts = points.map(
              (p) => new Point({ x: p.x, y: p.y }),
            );

            return (
              <g key={encIdx} opacity={isDimmed ? 0.15 : 1}>
                <LinePath
                  data={polygonPts}
                  x={(p) => p.x ?? 0}
                  y={(p) => p.y ?? 0}
                  fill={color}
                  fillOpacity={isHovered ? 0.28 : 0.12}
                  stroke={color}
                  strokeOpacity={0.9}
                  strokeWidth={isHovered ? 2.5 : 2}
                />
                {/* Close polygon */}
                {polygonPts.length > 0 && (
                  <line
                    x1={polygonPts[polygonPts.length - 1].x ?? 0}
                    y1={polygonPts[polygonPts.length - 1].y ?? 0}
                    x2={polygonPts[0].x ?? 0}
                    y2={polygonPts[0].y ?? 0}
                    stroke={color}
                    strokeOpacity={0.9}
                    strokeWidth={isHovered ? 2.5 : 2}
                  />
                )}
                {/* Data points */}
                {points.map((point, pi) => (
                  <circle
                    key={pi}
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? 5 : 3.5}
                    fill={color}
                    opacity={point.isNull ? 0.3 : 1}
                  />
                ))}
              </g>
            );
          })}

          {/* Axis labels */}
          {RADAR_AXES.map((axis, i) => {
            const labelR = radius + 20;
            const x = center.x + labelR * Math.cos(axis.angle);
            const y = center.y + labelR * Math.sin(axis.angle);
            const isLeft = Math.abs(axis.angle) > Math.PI / 2;

            return (
              <Text
                key={`alabel-${i}`}
                x={x}
                y={y}
                textAnchor={
                  Math.abs(Math.cos(axis.angle)) < 0.1
                    ? "middle"
                    : isLeft
                      ? "end"
                      : "start"
                }
                verticalAnchor={axis.angle < 0 ? "end" : "start"}
                fontSize={11}
                fontWeight={500}
                fill="var(--foreground)"
              >
                {axis.shortLabel}
              </Text>
            );
          })}
        </Group>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-4">
        {encodingData.map(({ encoding }, i) => (
          <button
            key={encoding.slug}
            className="flex items-center gap-1.5 text-xs transition-opacity"
            style={{
              opacity:
                hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1,
            }}
            onMouseEnter={() => handleLegendEnter(i)}
            onMouseLeave={handleLegendLeave}
            onFocus={() => handleLegendEnter(i)}
            onBlur={handleLegendLeave}
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  CHART_COLORS[i % CHART_COLORS.length],
              }}
            />
            <span className="font-medium">{encoding.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export const ComparisonRadar = memo(ComparisonRadarInner);
