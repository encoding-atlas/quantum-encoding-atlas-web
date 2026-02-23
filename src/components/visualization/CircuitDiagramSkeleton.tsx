import { cn } from "@/lib/utils";

export function CircuitDiagramSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-border bg-muted/20",
        "aspect-video min-h-[300px] max-h-[500px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 400 200"
        className="h-full w-full max-w-full p-6 opacity-20"
        aria-hidden="true"
      >
        {/* Qubit wire skeletons */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={40}
            y1={30 + i * 45}
            x2={380}
            y2={30 + i * 45}
            stroke="var(--muted-foreground)"
            strokeWidth="1"
            className="animate-pulse"
          />
        ))}
        {/* Gate box skeletons */}
        {[0, 1, 2, 3].map((qi) =>
          [0, 1].map((li) => (
            <rect
              key={`${qi}-${li}`}
              x={100 + li * 120}
              y={14 + qi * 45}
              width={36}
              height={32}
              rx={6}
              fill="var(--muted-foreground)"
              opacity={0.15}
              className="animate-pulse"
            />
          )),
        )}
      </svg>
    </div>
  );
}
