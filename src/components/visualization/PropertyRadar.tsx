"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { Group } from "@visx/group";
import { Line, LinePath } from "@visx/shape";
import { Text } from "@visx/text";
import { Point } from "@visx/point";
import type { Encoding } from "@/data/encodings";
import { encodings } from "@/data/encodings";
import {
  RADAR_AXES,
  computeGateCountRange,
  computeResourceEfficiency,
  getRadarValues,
  computeRadarPoints,
  computeGridPolygon,
} from "./radar-utils";
import { getCategoryColor } from "./color-utils";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LABEL_PADDING = 45;
const GRID_LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0];

// Pre-compute gate count range (stable across renders)
const gateCountRange = computeGateCountRange(encodings);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PropertyRadarProps {
  encoding: Encoding;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PropertyRadarInner({ encoding, className }: PropertyRadarProps) {
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  const categoryColor = getCategoryColor(encoding.category);

  // Responsive size based on container
  const size = 340;
  const radius = (size - LABEL_PADDING * 2) / 2;
  const center = useMemo(() => ({ x: size / 2, y: size / 2 }), [size]);

  const resourceEfficiency = useMemo(
    () =>
      computeResourceEfficiency(
        encoding.properties.gateCount,
        gateCountRange,
      ),
    [encoding.properties.gateCount],
  );

  const values = useMemo(
    () => getRadarValues(encoding.properties, resourceEfficiency),
    [encoding.properties, resourceEfficiency],
  );

  const dataPoints = useMemo(
    () => computeRadarPoints(values, radius, center),
    [values, radius, center],
  );

  const hasNullValues = dataPoints.some((p) => p.isNull);

  const handleAxisEnter = useCallback((index: number) => {
    setHoveredAxis(index);
  }, []);

  const handleAxisLeave = useCallback(() => {
    setHoveredAxis(null);
  }, []);

  // Build data polygon path points (use 0 for nulls)
  const polygonPoints = dataPoints.map((p) => new Point({ x: p.x, y: p.y }));

  const ariaValues = RADAR_AXES.map(
    (axis, i) =>
      `${axis.label} ${values[i] !== null ? (values[i]! * 100).toFixed(0) + "%" : "N/A"}`,
  ).join(", ");

  return (
    <div
      className={cn(
        "relative mx-auto max-w-[400px]",
        className,
      )}
      role="img"
      aria-label={`Radar chart for ${encoding.name}: ${ariaValues}`}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full"
      >
        <Group>
          {/* Concentric grid rings */}
          {GRID_LEVELS.map((level) => {
            const points = computeGridPolygon(level, radius, center);
            const d =
              points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
              " Z";
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
              key={`label-${level}`}
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

          {/* Data polygon */}
          <LinePath
            data={polygonPoints}
            x={(p) => p.x ?? 0}
            y={(p) => p.y ?? 0}
            fill={categoryColor}
            fillOpacity={0.18}
            stroke={categoryColor}
            strokeOpacity={0.8}
            strokeWidth={2}
            curve={undefined}
          />
          {/* Close the polygon */}
          {polygonPoints.length > 0 && (
            <line
              x1={polygonPoints[polygonPoints.length - 1].x ?? 0}
              y1={polygonPoints[polygonPoints.length - 1].y ?? 0}
              x2={polygonPoints[0].x ?? 0}
              y2={polygonPoints[0].y ?? 0}
              stroke={categoryColor}
              strokeOpacity={0.8}
              strokeWidth={2}
            />
          )}

          {/* Null value dashed lines */}
          {dataPoints.map(
            (point, i) =>
              point.isNull && (
                <Line
                  key={`null-${i}`}
                  from={new Point({ x: center.x, y: center.y })}
                  to={
                    new Point({
                      x: point.x,
                      y: point.y,
                    })
                  }
                  stroke={categoryColor}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.4}
                />
              ),
          )}

          {/* Data points */}
          {dataPoints.map((point, i) => (
            <circle
              key={`point-${i}`}
              cx={point.x}
              cy={point.y}
              r={point.isNull ? 3 : 4}
              fill={point.isNull ? "transparent" : categoryColor}
              stroke={categoryColor}
              strokeWidth={point.isNull ? 1 : 0}
              strokeDasharray={point.isNull ? "2 2" : "none"}
              opacity={point.isNull ? 0.4 : 1}
            />
          ))}

          {/* Axis labels */}
          {RADAR_AXES.map((axis, i) => {
            const labelR = radius + 20;
            const x = center.x + labelR * Math.cos(axis.angle);
            const y = center.y + labelR * Math.sin(axis.angle);
            const isTop = axis.angle < 0;
            const isLeft = Math.abs(axis.angle) > Math.PI / 2;

            return (
              <g
                key={`label-${i}`}
                onMouseEnter={() => handleAxisEnter(i)}
                onMouseLeave={handleAxisLeave}
                className="cursor-help"
              >
                <Text
                  x={x}
                  y={y}
                  textAnchor={
                    Math.abs(Math.cos(axis.angle)) < 0.1
                      ? "middle"
                      : isLeft
                        ? "end"
                        : "start"
                  }
                  verticalAnchor={isTop ? "end" : "start"}
                  fontSize={11}
                  fontWeight={500}
                  fill="var(--foreground)"
                >
                  {axis.shortLabel}
                </Text>
              </g>
            );
          })}
        </Group>
      </svg>

      {/* Axis tooltip */}
      {hoveredAxis !== null && (
        <div
          className="pointer-events-none absolute z-10 max-w-48 rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md"
          style={{
            left: "50%",
            bottom: "100%",
            transform: "translate(-50%, -4px)",
          }}
        >
          <p className="text-xs font-semibold">
            {RADAR_AXES[hoveredAxis].label}
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
            {RADAR_AXES[hoveredAxis].tooltip}
          </p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Value:{" "}
            {values[hoveredAxis] !== null
              ? `${(values[hoveredAxis]! * 100).toFixed(0)}%`
              : "N/A"}
          </p>
        </div>
      )}

      {/* Null values footnote */}
      {hasNullValues && (
        <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
          Dashed segments indicate properties not yet computed
        </p>
      )}
    </div>
  );
}

export const PropertyRadar = memo(PropertyRadarInner);
