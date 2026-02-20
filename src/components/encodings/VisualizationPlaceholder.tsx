import { GitBranch, Radar } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderType = "circuit" | "radar";

interface VisualizationPlaceholderProps {
  type: PlaceholderType;
  className?: string;
}

const config: Record<
  PlaceholderType,
  { icon: typeof GitBranch; title: string; aspect: string; minH: string }
> = {
  circuit: {
    icon: GitBranch,
    title: "Interactive circuit diagram",
    aspect: "aspect-video",
    minH: "min-h-[300px]",
  },
  radar: {
    icon: Radar,
    title: "Property radar chart",
    aspect: "aspect-square",
    minH: "min-h-[300px]",
  },
};

export function VisualizationPlaceholder({
  type,
  className,
}: VisualizationPlaceholderProps) {
  const { icon: Icon, title, aspect, minH } = config[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30",
        aspect,
        minH,
        type === "circuit" ? "max-h-[500px]" : "max-h-[400px]",
        className,
      )}
    >
      <Icon className="mb-3 size-8 text-muted-foreground/50" />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground/60">
        Coming in a future update
      </p>
    </div>
  );
}
