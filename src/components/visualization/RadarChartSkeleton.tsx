import { cn } from "@/lib/utils";

export function RadarChartSkeleton({
  className,
}: {
  className?: string;
}) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;

  // Pentagon vertices
  const vertices = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const polygonPoints = vertices.map((v) => `${v.x},${v.y}`).join(" ");

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-border bg-muted/20",
        "aspect-square min-h-[300px] max-h-[400px]",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full max-w-full p-4 opacity-20"
        aria-hidden="true"
      >
        {/* Concentric pentagons */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => {
          const pts = vertices
            .map(
              (v) =>
                `${cx + (v.x - cx) * level},${cy + (v.y - cy) * level}`,
            )
            .join(" ");
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth="0.5"
              className="animate-pulse"
            />
          );
        })}
        {/* Axis lines */}
        {vertices.map((v, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={v.x}
            y2={v.y}
            stroke="var(--muted-foreground)"
            strokeWidth="0.5"
            className="animate-pulse"
          />
        ))}
        {/* Data polygon placeholder */}
        <polygon
          points={polygonPoints}
          fill="var(--muted-foreground)"
          fillOpacity={0.05}
          stroke="var(--muted-foreground)"
          strokeWidth="1"
          className="animate-pulse"
          style={{ transform: "scale(0.5)", transformOrigin: `${cx}px ${cy}px` }}
        />
      </svg>
    </div>
  );
}
