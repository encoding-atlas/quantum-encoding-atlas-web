"use client";

import { useEffect, useRef, useState } from "react";

interface EncodingVisualProps {
  slug: string;
  size?: number;
  className?: string;
}

/**
 * Renders a unique animated SVG mini-visualization for each encoding technique.
 * Each visual is abstract but evocative of the encoding's core concept.
 */
export function EncodingVisual({
  slug,
  size = 80,
  className = "",
}: EncodingVisualProps) {
  const [t, setT] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    let time = 0;
    function tick() {
      time += 0.015;
      setT(time);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;

  const svgProps = {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    className,
    "aria-hidden": true as const,
  };

  switch (slug) {
    // ── Angle-based ──
    case "angle":
      return (
        <svg {...svgProps}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--cat-angle)" strokeWidth="1" opacity="0.3" />
          <line x1={cx} y1={cy} x2={cx + r * Math.cos(-t)} y2={cy + r * Math.sin(-t)} stroke="var(--cat-angle)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <circle cx={cx + r * Math.cos(-t)} cy={cy + r * Math.sin(-t)} r="3" fill="var(--cat-angle)" opacity="0.9" />
          {/* Arc showing angle */}
          <path d={`M ${cx + r * 0.4} ${cy} A ${r * 0.4} ${r * 0.4} 0 ${(-t % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) > Math.PI ? 1 : 0} 0 ${cx + r * 0.4 * Math.cos(-t)} ${cy + r * 0.4 * Math.sin(-t)}`} fill="none" stroke="var(--cat-angle)" strokeWidth="1" opacity="0.4" />
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">Ry(x)</text>
        </svg>
      );

    case "higher-order-angle":
      return (
        <svg {...svgProps}>
          {[0, 1, 2].map((i) => {
            const layerR = r * (0.5 + i * 0.25);
            const speed = (i + 1) * 0.7;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={layerR} fill="none" stroke="var(--cat-angle)" strokeWidth="0.8" opacity={0.15 + i * 0.05} />
                <circle cx={cx + layerR * Math.cos(t * speed)} cy={cy + layerR * Math.sin(t * speed)} r="2.5" fill="var(--cat-angle)" opacity={0.5 + i * 0.15} />
              </g>
            );
          })}
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">f(x)</text>
        </svg>
      );

    // ── Amplitude-based ──
    case "amplitude":
      return (
        <svg {...svgProps}>
          {[0, 1, 2, 3].map((i) => {
            const barW = size * 0.12;
            const gap = size * 0.05;
            const totalW = 4 * barW + 3 * gap;
            const x = cx - totalW / 2 + i * (barW + gap);
            const h = (0.3 + 0.7 * Math.abs(Math.sin(t + i * 0.8))) * (size * 0.5);
            return (
              <rect key={i} x={x} y={cy + size * 0.15 - h} width={barW} height={h} rx="2" fill="var(--cat-amplitude)" opacity={0.4 + 0.3 * Math.abs(Math.sin(t + i * 0.8))} />
            );
          })}
          <line x1={cx - size * 0.35} y1={cy + size * 0.15} x2={cx + size * 0.35} y2={cy + size * 0.15} stroke="var(--cat-amplitude)" strokeWidth="0.8" opacity="0.3" />
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">|ψ⟩</text>
        </svg>
      );

    // ── Basis ──
    case "basis":
      return (
        <svg {...svgProps}>
          {["0", "1", "1", "0"].map((bit, i) => {
            const flip = Math.sin(t * 0.8 + i * 1.5) > 0;
            const x = cx - 18 + i * 12;
            return (
              <text key={i} x={x} y={cy + 4} textAnchor="middle" fontSize="14" fontFamily="var(--font-mono)" fill="var(--cat-basis)" opacity={flip ? 0.9 : 0.3}>
                {flip ? (bit === "0" ? "1" : "0") : bit}
              </text>
            );
          })}
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">|0110⟩</text>
        </svg>
      );

    // ── Entangling Feature Maps ──
    case "iqp":
      return (
        <svg {...svgProps}>
          {/* Two qubit wires */}
          <line x1={10} y1={cy - 10} x2={size - 10} y2={cy - 10} stroke="var(--cat-entangling)" strokeWidth="1" opacity="0.3" />
          <line x1={10} y1={cy + 10} x2={size - 10} y2={cy + 10} stroke="var(--cat-entangling)" strokeWidth="1" opacity="0.3" />
          {/* H gates */}
          <rect x={16} y={cy - 17} width={12} height={14} rx="2" fill="var(--cat-entangling)" opacity="0.3" />
          <rect x={16} y={cy + 3} width={12} height={14} rx="2" fill="var(--cat-entangling)" opacity="0.3" />
          <text x={22} y={cy - 7} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--cat-entangling)" opacity="0.7">H</text>
          <text x={22} y={cy + 13} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--cat-entangling)" opacity="0.7">H</text>
          {/* ZZ interaction */}
          <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 10} stroke="var(--cat-entangling)" strokeWidth="1.5" opacity={0.4 + 0.3 * Math.sin(t * 2)} />
          <circle cx={cx} cy={cy - 10} r="3" fill="var(--cat-entangling)" opacity={0.5 + 0.3 * Math.sin(t * 2)} />
          <circle cx={cx} cy={cy + 10} r="3" fill="var(--cat-entangling)" opacity={0.5 + 0.3 * Math.sin(t * 2)} />
          {/* Rz gates */}
          <rect x={size - 30} y={cy - 17} width={14} height={14} rx="2" fill="var(--cat-entangling)" opacity="0.3" />
          <rect x={size - 30} y={cy + 3} width={14} height={14} rx="2" fill="var(--cat-entangling)" opacity="0.3" />
          <text x={size - 23} y={cy - 7} textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fill="var(--cat-entangling)" opacity="0.7">Rz</text>
          <text x={size - 23} y={cy + 13} textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fill="var(--cat-entangling)" opacity="0.7">Rz</text>
        </svg>
      );

    case "zz-feature-map":
      return (
        <svg {...svgProps}>
          <circle cx={cx - 14} cy={cy} r="8" fill="none" stroke="var(--cat-entangling)" strokeWidth="1.5" opacity="0.5" />
          <circle cx={cx + 14} cy={cy} r="8" fill="none" stroke="var(--cat-entangling)" strokeWidth="1.5" opacity="0.5" />
          {/* ZZ interaction wavy line */}
          <path d={`M ${cx - 6} ${cy} Q ${cx} ${cy - 6 * Math.sin(t * 3)} ${cx + 6} ${cy}`} fill="none" stroke="var(--cat-entangling)" strokeWidth="1.5" opacity={0.5 + 0.3 * Math.sin(t * 2)} />
          <text x={cx - 14} y={cy + 3} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--cat-entangling)" opacity="0.6">Z</text>
          <text x={cx + 14} y={cy + 3} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--cat-entangling)" opacity="0.6">Z</text>
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">ZZ</text>
        </svg>
      );

    case "pauli-feature-map":
      return (
        <svg {...svgProps}>
          {/* X Y Z rotation axes */}
          {["X", "Y", "Z"].map((label, i) => {
            const angle = (i * Math.PI * 2) / 3 + t * 0.5;
            const dx = r * 0.6 * Math.cos(angle);
            const dy = r * 0.6 * Math.sin(angle);
            return (
              <g key={label}>
                <line x1={cx} y1={cy} x2={cx + dx} y2={cy + dy} stroke="var(--cat-entangling)" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
                <text x={cx + dx * 1.3} y={cy + dy * 1.3 + 3} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--cat-entangling)" opacity="0.7">{label}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="2" fill="var(--cat-entangling)" opacity="0.5" />
        </svg>
      );

    // ── Variational ──
    case "data-reuploading":
      return (
        <svg {...svgProps}>
          {/* Loop arrow suggesting data reuploading */}
          <path d={`M ${cx - 15} ${cy - 8} C ${cx - 25} ${cy - 25}, ${cx + 25} ${cy - 25}, ${cx + 15} ${cy - 8}`} fill="none" stroke="var(--cat-variational)" strokeWidth="1.5" opacity="0.5" />
          <path d={`M ${cx + 15} ${cy + 8} C ${cx + 25} ${cy + 25}, ${cx - 25} ${cy + 25}, ${cx - 15} ${cy + 8}`} fill="none" stroke="var(--cat-variational)" strokeWidth="1.5" opacity="0.5" />
          {/* Data points cycling */}
          {[0, 1, 2].map((i) => {
            const phase = t * 1.2 + (i * Math.PI * 2) / 3;
            const px = cx + 15 * Math.cos(phase);
            const py = cy + 10 * Math.sin(phase);
            return <circle key={i} cx={px} cy={py} r="2.5" fill="var(--cat-variational)" opacity={0.4 + 0.4 * Math.abs(Math.sin(phase))} />;
          })}
          <text x={cx} y={cy + 3} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--cat-variational)" opacity="0.5">U(x)</text>
        </svg>
      );

    case "hardware-efficient":
      return (
        <svg {...svgProps}>
          {/* Brick-layer pattern */}
          {[0, 1, 2].map((row) => {
            const y = cy - 14 + row * 14;
            const offset = row % 2 === 0 ? 0 : 12;
            return (
              <g key={row}>
                {[0, 1, 2].map((col) => {
                  const x = 12 + offset + col * 24;
                  if (x > size - 14) return null;
                  return (
                    <rect key={col} x={x} y={y} width={16} height={10} rx="2" fill="var(--cat-variational)" opacity={0.2 + 0.15 * Math.sin(t + row + col)} />
                  );
                })}
              </g>
            );
          })}
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">HW</text>
        </svg>
      );

    case "qaoa":
      return (
        <svg {...svgProps}>
          {/* Alternating cost/mixer layers */}
          {[0, 1, 2, 3].map((i) => {
            const x = 12 + i * (size - 24) / 3;
            const isCost = i % 2 === 0;
            return (
              <rect key={i} x={x} y={cy - 16} width={8} height={32} rx="2" fill={isCost ? "var(--cat-variational)" : "var(--quantum-cyan)"} opacity={0.25 + 0.2 * Math.sin(t + i)} />
            );
          })}
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">C·M·C·M</text>
        </svg>
      );

    case "trainable":
      return (
        <svg {...svgProps}>
          {/* Parameters with gradient arrows */}
          {[0, 1, 2].map((i) => {
            const x = cx - 16 + i * 16;
            const arrowLen = 8 + 4 * Math.sin(t * 1.5 + i);
            return (
              <g key={i}>
                <circle cx={x} cy={cy - 4} r="4" fill="none" stroke="var(--cat-variational)" strokeWidth="1.2" opacity="0.5" />
                <text x={x} y={cy - 1} textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fill="var(--cat-variational)" opacity="0.7">θ</text>
                {/* Gradient arrow */}
                <line x1={x} y1={cy + 6} x2={x} y2={cy + 6 + arrowLen} stroke="var(--quantum-emerald)" strokeWidth="1" opacity="0.5" />
                <polygon points={`${x},${cy + 8 + arrowLen} ${x - 2},${cy + 5 + arrowLen} ${x + 2},${cy + 5 + arrowLen}`} fill="var(--quantum-emerald)" opacity="0.5" />
              </g>
            );
          })}
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">∇θ</text>
        </svg>
      );

    // ── Physics-inspired ──
    case "hamiltonian":
      return (
        <svg {...svgProps}>
          {/* Wave propagation */}
          <path
            d={Array.from({ length: 20 }, (_, i) => {
              const x = 8 + (i * (size - 16)) / 19;
              const y = cy + 12 * Math.sin(i * 0.6 - t * 2);
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            }).join(" ")}
            fill="none"
            stroke="var(--cat-physics)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">e⁻ⁱᴴᵗ</text>
        </svg>
      );

    // ── Symmetry & Equivariant ──
    case "symmetry-inspired":
      return (
        <svg {...svgProps}>
          {/* Mirror symmetry pattern */}
          {[0, 1, 2].map((i) => {
            const angle = (i * Math.PI) / 3 + t * 0.3;
            return (
              <g key={i}>
                <line x1={cx + r * 0.8 * Math.cos(angle)} y1={cy + r * 0.8 * Math.sin(angle)} x2={cx - r * 0.8 * Math.cos(angle)} y2={cy - r * 0.8 * Math.sin(angle)} stroke="var(--cat-symmetry)" strokeWidth="0.8" opacity="0.25" />
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="var(--cat-symmetry)" strokeWidth="1" opacity="0.3" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * Math.PI) / 3 + t * 0.3;
            return <circle key={i} cx={cx + r * 0.6 * Math.cos(angle)} cy={cy + r * 0.6 * Math.sin(angle)} r="2" fill="var(--cat-symmetry)" opacity="0.6" />;
          })}
        </svg>
      );

    case "so2-equivariant":
      return (
        <svg {...svgProps}>
          {/* Rotation symmetry circle */}
          <circle cx={cx} cy={cy} r={r * 0.7} fill="none" stroke="var(--cat-symmetry)" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
          {/* Rotating arrow */}
          <g style={{ transform: `rotate(${t * 30}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
            <line x1={cx} y1={cy} x2={cx + r * 0.65} y2={cy} stroke="var(--cat-symmetry)" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            <polygon points={`${cx + r * 0.7},${cy} ${cx + r * 0.6},${cy - 3} ${cx + r * 0.6},${cy + 3}`} fill="var(--cat-symmetry)" opacity="0.7" />
          </g>
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">SO(2)</text>
        </svg>
      );

    case "cyclic-equivariant":
      return (
        <svg {...svgProps}>
          {/* Cyclic polygon */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle1 = (i * Math.PI * 2) / 5 - Math.PI / 2 + t * 0.2;
            const angle2 = ((i + 1) * Math.PI * 2) / 5 - Math.PI / 2 + t * 0.2;
            const x1 = cx + r * 0.65 * Math.cos(angle1);
            const y1 = cy + r * 0.65 * Math.sin(angle1);
            const x2 = cx + r * 0.65 * Math.cos(angle2);
            const y2 = cy + r * 0.65 * Math.sin(angle2);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--cat-symmetry)" strokeWidth="1" opacity="0.4" />
                <circle cx={x1} cy={y1} r="2.5" fill="var(--cat-symmetry)" opacity={0.4 + 0.3 * Math.sin(t * 2 + i)} />
              </g>
            );
          })}
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">Cₙ</text>
        </svg>
      );

    case "swap-equivariant":
      return (
        <svg {...svgProps}>
          {/* Crossing wires (swap) */}
          <line x1={cx - 16} y1={cy - 12} x2={cx + 16} y2={cy + 12} stroke="var(--cat-symmetry)" strokeWidth="1.5" opacity="0.5" />
          <line x1={cx - 16} y1={cy + 12} x2={cx + 16} y2={cy - 12} stroke="var(--cat-symmetry)" strokeWidth="1.5" opacity="0.5" />
          {/* Moving dots along wires */}
          {(() => {
            const progress = (Math.sin(t) + 1) / 2;
            return (
              <>
                <circle cx={cx - 16 + 32 * progress} cy={cy - 12 + 24 * progress} r="3" fill="var(--cat-symmetry)" opacity="0.7" />
                <circle cx={cx - 16 + 32 * progress} cy={cy + 12 - 24 * progress} r="3" fill="var(--quantum-cyan)" opacity="0.7" />
              </>
            );
          })()}
          <text x={cx} y={size - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-mono)" fill="var(--muted-foreground)" opacity="0.5">SWAP</text>
        </svg>
      );

    // Fallback: generic quantum dot
    default:
      return (
        <svg {...svgProps}>
          <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.3" />
          <circle cx={cx} cy={cy} r="3" fill="var(--primary)" opacity={0.4 + 0.3 * Math.sin(t * 2)} />
        </svg>
      );
  }
}
