// =============================================================================
// Quantum Encoding Atlas — TypeScript Data Model
// =============================================================================
// Mirrors the Python library's data structures for the 16 quantum encodings.
// This is the single source of truth for the website's type system.
// =============================================================================

// ---------------------------------------------------------------------------
// Literal union types (mirror Python Literal types)
// ---------------------------------------------------------------------------

export type Simulability =
  | "simulable"
  | "conditionally_simulable"
  | "not_simulable";

export type QubitScaling = "linear" | "logarithmic";

export type CircuitDepthClass = "constant" | "shallow" | "moderate" | "deep";

export type BackendType = "pennylane" | "qiskit" | "cirq";

export type EncodingCategoryId =
  | "angle-based"
  | "amplitude-based"
  | "basis"
  | "entangling"
  | "variational"
  | "physics-inspired"
  | "symmetry";

// ---------------------------------------------------------------------------
// Guide parameter types (for Phase 7 decision guide)
// ---------------------------------------------------------------------------

export type DataType = "continuous" | "binary" | "discrete";

export type SymmetryType =
  | "rotation"
  | "cyclic"
  | "permutation_pairs"
  | "general";

export type Priority =
  | "accuracy"
  | "trainability"
  | "speed"
  | "noise_resilience";

export type Task = "classification" | "regression";

export type ProblemStructure =
  | "combinatorial"
  | "physics_simulation"
  | "time_series";

export type FeatureInteraction = "polynomial" | "custom_pauli";

// ---------------------------------------------------------------------------
// Core interfaces
// ---------------------------------------------------------------------------

/** Mirrors the Python `EncodingProperties` dataclass exactly. */
export interface EncodingProperties {
  nQubits: number;
  depth: number;
  gateCount: number;
  singleQubitGates: number;
  twoQubitGates: number;
  parameterCount: number;
  isEntangling: boolean;
  simulability: Simulability;
  expressibility?: number;
  entanglementCapability?: number;
  trainabilityEstimate?: number;
  noiseResilienceEstimate?: number;
  notes: string;
}

/** Mirrors the Python `EncodingRule` TypedDict exactly. */
export interface EncodingRule {
  bestFor: string[];
  avoidWhen: string[];
  maxFeatures: number | null;
  simulable: boolean;
  requiresDataType: string[] | null;
  requiresSymmetry: string | null;
  requiresNFeatures: number | null;
  requiresEvenFeatures: boolean;
  requiresTrainable: boolean;
  qubitScaling: QubitScaling;
  circuitDepth: CircuitDepthClass;
}

/** Constructor parameter metadata for an encoding class. */
export interface EncodingParameter {
  name: string;
  type: string;
  default: string | number | boolean | null;
  description: string;
}

/** A code snippet demonstrating an encoding with a specific backend. */
export interface CodeExample {
  backend: BackendType;
  code: string;
  description: string;
}

/** A single gate in a circuit diagram (for visualization in Phase 6). */
export interface CircuitGate {
  type: string;
  qubits: number[];
  parameter?: string;
}

/** Pre-computed resource metrics for a specific feature count. */
export interface ResourceProfile {
  nFeatures: number;
  nQubits: number;
  depth: number;
  gateCount: number;
  singleQubitGates: number;
  twoQubitGates: number;
  parameterCount: number;
  isEntangling: boolean;
  simulability: Simulability;
}

/** Category metadata with CSS color mapping. */
export interface EncodingCategory {
  id: EncodingCategoryId;
  name: string;
  colorVariable: string;
  description: string;
  encodingIds: string[];
}

/** The primary type for a single encoding's complete data. */
export interface Encoding {
  id: string;
  slug: string;
  name: string;
  className: string;
  category: EncodingCategoryId;
  shortDescription: string;
  description: string;
  mathFormulation: string;
  properties: EncodingProperties;
  parameters: EncodingParameter[];
  circuitStructure: CircuitGate[][];
  codeExamples: CodeExample[];
  useCases: string[];
  prosAndCons: { pros: string[]; cons: string[] };
  resourceProfiles: ResourceProfile[];
  guideRules: EncodingRule;
  references: string[];
  relatedEncodings: string[];
}

// ---------------------------------------------------------------------------
// Guide types (for Phase 7 compatibility)
// ---------------------------------------------------------------------------

/** Input parameters for the decision guide / recommender. */
export interface GuideInput {
  nFeatures: number;
  nSamples?: number;
  task?: Task;
  hardware?: string;
  priority?: Priority;
  dataType?: DataType;
  symmetry?: SymmetryType | null;
  trainable?: boolean;
  problemStructure?: ProblemStructure | null;
  featureInteractions?: FeatureInteraction | null;
}

/** Output of the decision guide / recommender. */
export interface Recommendation {
  encodingId: string;
  explanation: string;
  alternatives: string[];
  confidence: number;
}
