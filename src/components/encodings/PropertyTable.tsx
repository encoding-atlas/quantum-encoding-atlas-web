import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import type { EncodingProperties, Simulability } from "@/data/encodings";

const PROPERTY_TOOLTIPS: Record<string, string> = {
  nQubits: "Number of qubits required for this encoding",
  depth: "Circuit depth (number of time steps)",
  gateCount: "Total number of quantum gates in the circuit",
  singleQubitGates: "Number of single-qubit rotation gates",
  twoQubitGates: "Number of two-qubit entangling gates (e.g., CNOT)",
  parameterCount: "Number of parameters in the circuit",
  isEntangling: "Whether the circuit creates entanglement between qubits",
  simulability:
    "Whether the circuit output can be efficiently computed classically",
  expressibility:
    "How uniformly the encoding can explore the Hilbert space (0 = low, 1 = high)",
  entanglementCapability:
    "Ability to generate entanglement between qubits (0 = none, 1 = maximal)",
  trainabilityEstimate:
    "Estimated ease of optimizing variational parameters (0 = barren plateau, 1 = easy)",
  noiseResilienceEstimate:
    "Estimated resilience to quantum noise (0 = fragile, 1 = robust)",
};

function SimulabilityBadge({ value }: { value: Simulability }) {
  const config = {
    simulable: {
      label: "Simulable",
      className: "bg-cat-amplitude/10 text-cat-amplitude",
    },
    conditionally_simulable: {
      label: "Conditional",
      className: "bg-cat-physics/10 text-cat-physics",
    },
    not_simulable: {
      label: "Not Simulable",
      className: "bg-destructive/10 text-destructive",
    },
  } as const;

  const { label, className } = config[value];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}

function MetricBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

function PropertyRow({
  label,
  tooltipKey,
  children,
}: {
  label: string;
  tooltipKey: string;
  children: React.ReactNode;
}) {
  const tooltip = PROPERTY_TOOLTIPS[tooltipKey];
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">{label}</span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3 text-muted-foreground/50" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

interface PropertyTableProps {
  properties: EncodingProperties;
  variant?: "full" | "compact";
}

export function PropertyTable({
  properties,
  variant = "full",
}: PropertyTableProps) {
  if (variant === "compact") {
    return (
      <div className="space-y-0">
        <PropertyRow label="Qubits" tooltipKey="nQubits">
          {properties.nQubits}
        </PropertyRow>
        <PropertyRow label="Depth" tooltipKey="depth">
          {properties.depth}
        </PropertyRow>
        <PropertyRow label="Gates" tooltipKey="gateCount">
          {properties.gateCount}
        </PropertyRow>
        <PropertyRow label="Entangling" tooltipKey="isEntangling">
          {properties.isEntangling ? (
            <span className="text-cat-amplitude">Yes</span>
          ) : (
            <span className="text-muted-foreground">No</span>
          )}
        </PropertyRow>
        <PropertyRow label="Simulability" tooltipKey="simulability">
          <SimulabilityBadge value={properties.simulability} />
        </PropertyRow>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <PropertyRow label="Qubits" tooltipKey="nQubits">
        {properties.nQubits}
      </PropertyRow>
      <PropertyRow label="Circuit Depth" tooltipKey="depth">
        {properties.depth}
      </PropertyRow>
      <PropertyRow label="Total Gates" tooltipKey="gateCount">
        {properties.gateCount}
      </PropertyRow>
      <PropertyRow label="Single-Qubit Gates" tooltipKey="singleQubitGates">
        {properties.singleQubitGates}
      </PropertyRow>
      <PropertyRow label="Two-Qubit Gates" tooltipKey="twoQubitGates">
        {properties.twoQubitGates}
      </PropertyRow>
      <PropertyRow label="Parameters" tooltipKey="parameterCount">
        {properties.parameterCount}
      </PropertyRow>
      <PropertyRow label="Entangling" tooltipKey="isEntangling">
        {properties.isEntangling ? (
          <span className="text-cat-amplitude">Yes</span>
        ) : (
          <span className="text-muted-foreground">No</span>
        )}
      </PropertyRow>
      <PropertyRow label="Simulability" tooltipKey="simulability">
        <SimulabilityBadge value={properties.simulability} />
      </PropertyRow>
      <PropertyRow label="Expressibility" tooltipKey="expressibility">
        {properties.expressibility != null ? (
          <MetricBar value={properties.expressibility} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </PropertyRow>
      <PropertyRow
        label="Entanglement Capability"
        tooltipKey="entanglementCapability"
      >
        {properties.entanglementCapability != null ? (
          <MetricBar value={properties.entanglementCapability} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </PropertyRow>
      <PropertyRow label="Trainability" tooltipKey="trainabilityEstimate">
        {properties.trainabilityEstimate != null ? (
          <MetricBar value={properties.trainabilityEstimate} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </PropertyRow>
      <PropertyRow label="Noise Resilience" tooltipKey="noiseResilienceEstimate">
        {properties.noiseResilienceEstimate != null ? (
          <MetricBar value={properties.noiseResilienceEstimate} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </PropertyRow>
    </div>
  );
}
