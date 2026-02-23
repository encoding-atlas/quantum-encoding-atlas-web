"use client";

import { memo, useMemo, useState, useCallback, useRef } from "react";
import type { Encoding } from "@/data/encodings";
import {
  computeCircuitLayout,
  GATE_WIDTH,
  GATE_HEIGHT,
  PADDING,
  type GateNode,
  type TwoQubitConnection,
} from "./circuit-layout";
import { getGateInfo } from "./gate-info";
import { getCategoryColor } from "./color-utils";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SingleQubitGate({
  node,
  categoryColor,
  onHover,
  onLeave,
}: {
  node: GateNode;
  categoryColor: string;
  onHover: (node: GateNode, rect: DOMRect) => void;
  onLeave: () => void;
}) {
  const ref = useRef<SVGGElement>(null);
  const info = getGateInfo(node.gate.type);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      onHover(node, ref.current.getBoundingClientRect());
    }
  }, [node, onHover]);

  return (
    <g
      ref={ref}
      transform={`translate(${node.x}, ${node.y})`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      onFocus={handleMouseEnter}
      onBlur={onLeave}
      tabIndex={0}
      role="button"
      aria-label={`${info.name}${node.gate.parameter ? ` with parameter ${node.gate.parameter}` : ""} on qubit ${node.gate.qubits[0]}`}
      className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outline: "none" }}
    >
      <rect
        x={-GATE_WIDTH / 2}
        y={-GATE_HEIGHT / 2}
        width={GATE_WIDTH}
        height={GATE_HEIGHT}
        rx={6}
        fill={`color-mix(in oklch, ${categoryColor} 15%, transparent)`}
        stroke={categoryColor}
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={13}
        fontFamily="var(--font-mono)"
        fontWeight={500}
      >
        {info.symbol}
      </text>
      {node.gate.parameter && (
        <text
          y={GATE_HEIGHT / 2 + 12}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--muted-foreground)"
          fontSize={9}
          fontFamily="var(--font-mono)"
          fontStyle="italic"
        >
          {node.gate.parameter}
        </text>
      )}
    </g>
  );
}

function CnotGate({
  connection,
  onHover,
  onLeave,
}: {
  connection: TwoQubitConnection;
  onHover: (type: string, x: number, y: number, rect: DOMRect) => void;
  onLeave: () => void;
}) {
  const ref = useRef<SVGGElement>(null);
  const controlY = connection.y1;
  const targetY = connection.y2;

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      onHover(
        "CNOT",
        connection.x,
        (controlY + targetY) / 2,
        ref.current.getBoundingClientRect(),
      );
    }
  }, [connection.x, controlY, targetY, onHover]);

  return (
    <g
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      {/* Vertical connection line */}
      <line
        x1={connection.x}
        y1={controlY}
        x2={connection.x}
        y2={targetY}
        stroke="var(--foreground)"
        strokeWidth={1.5}
      />
      {/* Control dot */}
      <circle
        cx={connection.x}
        cy={controlY}
        r={4}
        fill="var(--foreground)"
      />
      {/* Target: ⊕ */}
      <circle
        cx={connection.x}
        cy={targetY}
        r={10}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth={1.5}
      />
      <line
        x1={connection.x - 10}
        y1={targetY}
        x2={connection.x + 10}
        y2={targetY}
        stroke="var(--foreground)"
        strokeWidth={1.5}
      />
      <line
        x1={connection.x}
        y1={targetY - 10}
        x2={connection.x}
        y2={targetY + 10}
        stroke="var(--foreground)"
        strokeWidth={1.5}
      />
    </g>
  );
}

function CzGate({
  connection,
  onHover,
  onLeave,
}: {
  connection: TwoQubitConnection;
  onHover: (type: string, x: number, y: number, rect: DOMRect) => void;
  onLeave: () => void;
}) {
  const ref = useRef<SVGGElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      onHover(
        "CZ",
        connection.x,
        (connection.y1 + connection.y2) / 2,
        ref.current.getBoundingClientRect(),
      );
    }
  }, [connection, onHover]);

  return (
    <g
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      {/* Vertical connection line */}
      <line
        x1={connection.x}
        y1={connection.y1}
        x2={connection.x}
        y2={connection.y2}
        stroke="var(--foreground)"
        strokeWidth={1.5}
      />
      {/* Dots on both qubits */}
      <circle
        cx={connection.x}
        cy={connection.y1}
        r={4}
        fill="var(--foreground)"
      />
      <circle
        cx={connection.x}
        cy={connection.y2}
        r={4}
        fill="var(--foreground)"
      />
    </g>
  );
}

function RzzGate({
  node,
  connection,
  categoryColor,
  onHover,
  onLeave,
}: {
  node: GateNode;
  connection: TwoQubitConnection;
  categoryColor: string;
  onHover: (node: GateNode, rect: DOMRect) => void;
  onLeave: () => void;
}) {
  const ref = useRef<SVGGElement>(null);
  const minY = Math.min(connection.y1, connection.y2);
  const maxY = Math.max(connection.y1, connection.y2);
  const height = maxY - minY + GATE_HEIGHT;
  const centerY = (minY + maxY) / 2;

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      onHover(node, ref.current.getBoundingClientRect());
    }
  }, [node, onHover]);

  return (
    <g
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      <rect
        x={connection.x - GATE_WIDTH / 2 - 4}
        y={centerY - height / 2}
        width={GATE_WIDTH + 8}
        height={height}
        rx={6}
        fill={`color-mix(in oklch, ${categoryColor} 15%, transparent)`}
        stroke={categoryColor}
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
      <text
        x={connection.x}
        y={centerY - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={12}
        fontFamily="var(--font-mono)"
        fontWeight={500}
      >
        R{"\u1D5A\u1D5A"}
      </text>
      {node.gate.parameter && (
        <text
          x={connection.x}
          y={centerY + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--muted-foreground)"
          fontSize={9}
          fontFamily="var(--font-mono)"
          fontStyle="italic"
        >
          {node.gate.parameter}
        </text>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  gateName: string;
  gateSymbol: string;
  description: string;
  parameter?: string;
  qubits: number[];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface CircuitDiagramProps {
  encoding: Encoding;
  className?: string;
  interactive?: boolean;
}

function CircuitDiagramInner({
  encoding,
  className,
  interactive = true,
}: CircuitDiagramProps) {
  const layout = useMemo(
    () => computeCircuitLayout(encoding.circuitStructure),
    [encoding.circuitStructure],
  );

  const categoryColor = getCategoryColor(encoding.category);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    gateName: "",
    gateSymbol: "",
    description: "",
    qubits: [],
  });

  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGateHover = useCallback(
    (node: GateNode, rect: DOMRect) => {
      if (!interactive) return;
      const info = getGateInfo(node.gate.type);
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      setTooltip({
        visible: true,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
        gateName: info.name,
        gateSymbol: info.symbol,
        description: info.description,
        parameter: node.gate.parameter,
        qubits: node.gate.qubits,
      });
    },
    [interactive],
  );

  const handleConnectionHover = useCallback(
    (type: string, _x: number, _y: number, rect: DOMRect) => {
      if (!interactive) return;
      const info = getGateInfo(type);
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      setTooltip({
        visible: true,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
        gateName: info.name,
        gateSymbol: info.symbol,
        description: info.description,
        qubits: [],
      });
    },
    [interactive],
  );

  const handleLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.25, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 0.25, 0.5));
  }, []);

  const handleFitView = useCallback(() => {
    setZoom(1);
  }, []);

  // Determine which nodes are two-qubit (to skip their single-qubit rendering)
  const twoQubitGateIds = useMemo(
    () => new Set(layout.connections.map((c) => c.gateId)),
    [layout.connections],
  );

  const totalGates = encoding.properties.gateCount;
  const ariaLabel = `Quantum circuit diagram for ${encoding.name} showing ${layout.nQubits} qubits and ${totalGates} gates across ${layout.nLayers} layers`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-auto rounded-lg border border-border bg-card/50",
        "min-h-[300px] max-h-[500px]",
        className,
      )}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={`0 0 ${layout.totalWidth} ${layout.totalHeight}`}
        width={layout.totalWidth * zoom}
        height={layout.totalHeight * zoom}
        className="mx-auto block"
        style={{ minWidth: layout.totalWidth * zoom }}
      >
        {/* Qubit wires */}
        {layout.wires.map((wire) => (
          <g key={`wire-${wire.qubitIndex}`}>
            <line
              x1={wire.x1 + 36}
              y1={wire.y}
              x2={wire.x2}
              y2={wire.y}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              opacity={0.3}
            />
            {/* Qubit label */}
            <text
              x={PADDING + 8}
              y={wire.y}
              textAnchor="start"
              dominantBaseline="central"
              fill="var(--muted-foreground)"
              fontSize={11}
              fontFamily="var(--font-mono)"
            >
              |0⟩
            </text>
            <text
              x={PADDING + 32}
              y={wire.y}
              textAnchor="start"
              dominantBaseline="central"
              fill="var(--muted-foreground)"
              fontSize={10}
              fontFamily="var(--font-mono)"
              opacity={0.6}
            >
              q{"\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087"[wire.qubitIndex] ?? wire.qubitIndex}
            </text>
          </g>
        ))}

        {/* Two-qubit connections (rendered first, behind gates) */}
        {layout.connections.map((conn) => {
          if (conn.type === "cnot") {
            return (
              <CnotGate
                key={conn.gateId}
                connection={conn}
                onHover={handleConnectionHover}
                onLeave={handleLeave}
              />
            );
          }
          if (conn.type === "cz") {
            return (
              <CzGate
                key={conn.gateId}
                connection={conn}
                onHover={handleConnectionHover}
                onLeave={handleLeave}
              />
            );
          }
          // RZZ rendered with its node below
          return null;
        })}

        {/* Gate nodes */}
        {layout.nodes.map((node) => {
          // Skip CNOT/CZ (rendered as connections above)
          if (
            twoQubitGateIds.has(node.id) &&
            (node.gate.type === "CNOT" || node.gate.type === "CZ")
          ) {
            return null;
          }

          // RZZ: render spanning box
          if (node.gate.type === "RZZ") {
            const conn = layout.connections.find(
              (c) => c.gateId === node.id,
            );
            if (conn) {
              return (
                <RzzGate
                  key={node.id}
                  node={node}
                  connection={conn}
                  categoryColor={categoryColor}
                  onHover={handleGateHover}
                  onLeave={handleLeave}
                />
              );
            }
          }

          // Single-qubit gate
          return (
            <SingleQubitGate
              key={node.id}
              node={node}
              categoryColor={categoryColor}
              onHover={handleGateHover}
              onLeave={handleLeave}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {interactive && tooltip.visible && (
        <div
          className="pointer-events-none absolute z-10 max-w-56 rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="text-xs font-semibold">{tooltip.gateName}</p>
          <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
            {tooltip.description}
          </p>
          {tooltip.parameter && (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              θ = {tooltip.parameter}
            </p>
          )}
          {tooltip.qubits.length > 0 && (
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
              Qubit{tooltip.qubits.length > 1 ? "s" : ""}: {tooltip.qubits.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Zoom controls */}
      {interactive && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button
            onClick={handleZoomOut}
            className="flex size-7 items-center justify-center rounded border border-border bg-card text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            onClick={handleFitView}
            className="flex h-7 items-center justify-center rounded border border-border bg-card px-2 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Fit to view"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="flex size-7 items-center justify-center rounded border border-border bg-card text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export const CircuitDiagram = memo(CircuitDiagramInner);
