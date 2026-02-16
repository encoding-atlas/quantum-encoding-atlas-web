"use client";

import { useEffect, useRef, useState } from "react";

interface BlochSphereProps {
  size?: number;
  className?: string;
}

export function BlochSphere({ size = 280, className = "" }: BlochSphereProps) {
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let t = 0;
    function tick() {
      t += 0.004;
      setAngle(t);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;

  // State vector tip position — precessing on Bloch sphere
  const theta = Math.PI * 0.35; // polar angle (fixed tilt)
  const phi = angle; // azimuthal angle (rotates)
  const tipY = cy - r * Math.cos(theta);
  const tipYProjected = cy + r * 0.3 * Math.sin(theta) * Math.sin(phi);

  // Blend tip positions for 3D illusion — round to avoid SSR hydration mismatch
  const rd = (n: number) => Math.round(n * 100) / 100;
  const finalTipX = rd(cx + r * Math.sin(theta) * Math.cos(phi));
  const finalTipY = rd(tipY + (tipYProjected - cy) * 0.3);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for state vector tip */}
        <radialGradient id="bloch-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--quantum-cyan)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--quantum-cyan)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sphere-fill" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="var(--quantum-violet)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--quantum-violet)" stopOpacity="0.02" />
        </radialGradient>
      </defs>

      {/* Sphere fill */}
      <circle cx={cx} cy={cy} r={r} fill="url(#sphere-fill)" />

      {/* Sphere outline */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Equator ellipse */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={r}
        ry={r * 0.3}
        fill="none"
        stroke="var(--border)"
        strokeWidth="0.8"
        strokeDasharray="4 3"
        opacity="0.4"
      />

      {/* Vertical axis (Z) */}
      <line
        x1={cx}
        y1={cy - r - 12}
        x2={cx}
        y2={cy + r + 12}
        stroke="var(--border)"
        strokeWidth="0.6"
        opacity="0.3"
      />

      {/* Pole labels */}
      <text
        x={cx + 10}
        y={cy - r - 14}
        fill="var(--muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-mono)"
        opacity="0.7"
      >
        |0⟩
      </text>
      <text
        x={cx + 10}
        y={cy + r + 20}
        fill="var(--muted-foreground)"
        fontSize="11"
        fontFamily="var(--font-mono)"
        opacity="0.7"
      >
        |1⟩
      </text>

      {/* State vector line */}
      <line
        x1={cx}
        y1={cy}
        x2={finalTipX}
        y2={finalTipY}
        stroke="var(--quantum-cyan)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* State vector tip glow */}
      <circle
        cx={finalTipX}
        cy={finalTipY}
        r="12"
        fill="url(#bloch-glow)"
      />

      {/* State vector tip dot */}
      <circle
        cx={finalTipX}
        cy={finalTipY}
        r="3.5"
        fill="var(--quantum-cyan)"
        opacity="0.9"
      />

      {/* Origin dot */}
      <circle
        cx={cx}
        cy={cy}
        r="2"
        fill="var(--muted-foreground)"
        opacity="0.4"
      />

      {/* Precession trace (faint dashed ellipse at the state vector's latitude) */}
      <ellipse
        cx={cx}
        cy={finalTipY}
        rx={rd(r * Math.sin(theta))}
        ry={rd(r * Math.sin(theta) * 0.3)}
        fill="none"
        stroke="var(--quantum-cyan)"
        strokeWidth="0.6"
        strokeDasharray="3 4"
        opacity="0.2"
      />

      {/* Axis labels */}
      <text
        x={cx + r + 8}
        y={cy + 4}
        fill="var(--muted-foreground)"
        fontSize="10"
        fontFamily="var(--font-mono)"
        opacity="0.4"
      >
        x
      </text>
      <text
        x={cx - 4}
        y={cy - r - 18}
        fill="var(--muted-foreground)"
        fontSize="10"
        fontFamily="var(--font-mono)"
        opacity="0.4"
      >
        z
      </text>
    </svg>
  );
}
