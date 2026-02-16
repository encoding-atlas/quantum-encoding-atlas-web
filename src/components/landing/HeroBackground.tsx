"use client";

import { useEffect, useRef } from "react";

interface Gate {
  wireIndex: number;
  x: number;
  speed: number;
  width: number;
  label: string;
}

const WIRE_COUNT = 5;
const GATE_COLORS_DARK = [
  "rgba(130, 180, 255, 0.35)", // cyan-ish
  "rgba(170, 130, 255, 0.35)", // violet
  "rgba(255, 130, 200, 0.30)", // magenta
  "rgba(130, 220, 180, 0.30)", // emerald
];
const GATE_COLORS_LIGHT = [
  "rgba(80, 50, 180, 0.20)",
  "rgba(50, 120, 180, 0.18)",
  "rgba(160, 50, 140, 0.16)",
  "rgba(30, 140, 100, 0.16)",
];

const GATE_LABELS = ["H", "Rz", "Rx", "Ry", "X", "Z", "S"];

function createGates(canvasWidth: number): Gate[] {
  const gates: Gate[] = [];
  for (let w = 0; w < WIRE_COUNT; w++) {
    const count = 2 + Math.floor(Math.random() * 2);
    for (let g = 0; g < count; g++) {
      gates.push({
        wireIndex: w,
        x: Math.random() * canvasWidth,
        speed: 0.15 + Math.random() * 0.25,
        width: 22 + Math.random() * 10,
        label: GATE_LABELS[Math.floor(Math.random() * GATE_LABELS.length)],
      });
    }
  }
  return gates;
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gatesRef = useRef<Gate[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cw = 0;
    let ch = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      cw = canvas!.offsetWidth;
      ch = canvas!.offsetHeight;
      canvas!.width = cw * dpr;
      canvas!.height = ch * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      gatesRef.current = createGates(cw);
    }

    resize();
    window.addEventListener("resize", resize);

    function isDark() {
      return document.documentElement.classList.contains("dark");
    }

    // Wire Y positions distributed across middle 60% of canvas
    function wireY(index: number): number {
      const topMargin = ch * 0.2;
      const usable = ch * 0.6;
      return topMargin + (usable / (WIRE_COUNT - 1)) * index;
    }

    // Layer 1: subtle grid
    function drawGrid(dark: boolean) {
      if (!ctx) return;
      const baseAlpha = dark ? 0.04 : 0.03;
      const pulse = 0.5 + 0.5 * Math.sin(timeRef.current * 0.0008);
      const alpha = baseAlpha * (0.7 + 0.3 * pulse);

      ctx.strokeStyle = dark
        ? `rgba(130, 180, 255, ${alpha})`
        : `rgba(80, 50, 180, ${alpha})`;
      ctx.lineWidth = 0.5;

      // Vertical lines
      const spacing = 60;
      for (let x = 0; x < cw; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = 0; y < ch; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
      }
    }

    // Layer 2: qubit wires + gates
    function drawCircuit(dark: boolean) {
      if (!ctx) return;
      const wireColor = dark
        ? "rgba(130, 180, 255, 0.08)"
        : "rgba(80, 50, 180, 0.06)";
      const gateColors = dark ? GATE_COLORS_DARK : GATE_COLORS_LIGHT;
      const labelColor = dark
        ? "rgba(200, 220, 255, 0.5)"
        : "rgba(60, 40, 140, 0.35)";

      // Draw wires
      ctx.lineWidth = 1;
      for (let w = 0; w < WIRE_COUNT; w++) {
        const y = wireY(w);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.strokeStyle = wireColor;
        ctx.stroke();
      }

      // Draw gates
      const gates = gatesRef.current;
      ctx.font = "10px var(--font-mono), monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const gate of gates) {
        const y = wireY(gate.wireIndex);
        const halfW = gate.width / 2;

        // Gate box
        const color = gateColors[gate.wireIndex % gateColors.length];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(gate.x - halfW, y - 12, gate.width, 24, 4);
        ctx.fill();

        // Gate label
        ctx.fillStyle = labelColor;
        ctx.fillText(gate.label, gate.x, y);
      }

      // Draw CNOT connections between adjacent wires when gates align
      for (let i = 0; i < gates.length; i++) {
        for (let j = i + 1; j < gates.length; j++) {
          const a = gates[i];
          const b = gates[j];
          if (
            Math.abs(a.wireIndex - b.wireIndex) === 1 &&
            Math.abs(a.x - b.x) < 30
          ) {
            const midX = (a.x + b.x) / 2;
            const y1 = wireY(a.wireIndex);
            const y2 = wireY(b.wireIndex);
            ctx.beginPath();
            ctx.moveTo(midX, y1);
            ctx.lineTo(midX, y2);
            ctx.strokeStyle = dark
              ? "rgba(170, 130, 255, 0.12)"
              : "rgba(80, 50, 180, 0.08)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Control dot
            ctx.beginPath();
            ctx.arc(midX, y1, 3, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? "rgba(170, 130, 255, 0.25)"
              : "rgba(80, 50, 180, 0.15)";
            ctx.fill();

            // Target circle
            ctx.beginPath();
            ctx.arc(midX, y2, 5, 0, Math.PI * 2);
            ctx.strokeStyle = dark
              ? "rgba(170, 130, 255, 0.2)"
              : "rgba(80, 50, 180, 0.12)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
    }

    // Layer 3: interference ripples
    function drawRipples(dark: boolean) {
      if (!ctx) return;
      const cx = cw * 0.5;
      const cy = ch * 0.45;
      const maxRadius = Math.max(cw, ch) * 0.5;
      const ringCount = 5;

      for (let i = 0; i < ringCount; i++) {
        const phase = (timeRef.current * 0.0003 + (i / ringCount) * Math.PI * 2) % (Math.PI * 2);
        const radius = (phase / (Math.PI * 2)) * maxRadius;
        const fade = 1 - radius / maxRadius;
        const alpha = fade * (dark ? 0.04 : 0.025);

        if (alpha <= 0) continue;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = dark
          ? `rgba(130, 180, 255, ${alpha})`
          : `rgba(100, 60, 200, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, cw, ch);
      const dark = isDark();

      timeRef.current += 16.67; // ~60fps time step

      drawGrid(dark);

      // Animate gates
      if (!prefersReducedMotion) {
        for (const gate of gatesRef.current) {
          gate.x += gate.speed;
          if (gate.x > cw + 40) gate.x = -40;
        }
      }

      drawCircuit(dark);

      if (!prefersReducedMotion) {
        drawRipples(dark);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
