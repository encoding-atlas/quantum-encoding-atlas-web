import type { EncodingRule } from "./encodings/types";

// ---------------------------------------------------------------------------
// Valid parameter values — canonical sets for runtime validation
// ---------------------------------------------------------------------------

export const VALID_DATA_TYPES: ReadonlySet<string> = new Set([
  "continuous",
  "binary",
  "discrete",
]);

export const VALID_SYMMETRIES: ReadonlySet<string> = new Set([
  "rotation",
  "cyclic",
  "permutation_pairs",
  "general",
]);

export const VALID_PRIORITIES: ReadonlySet<string> = new Set([
  "accuracy",
  "trainability",
  "speed",
  "noise_resilience",
]);

export const VALID_TASKS: ReadonlySet<string> = new Set([
  "classification",
  "regression",
]);

export const VALID_PROBLEM_STRUCTURES: ReadonlySet<string> = new Set([
  "combinatorial",
  "physics_simulation",
  "time_series",
]);

export const VALID_FEATURE_INTERACTIONS: ReadonlySet<string> = new Set([
  "polynomial",
  "custom_pauli",
]);

// ---------------------------------------------------------------------------
// Complete encoding knowledge base — all 16 encodings
// Verbatim port of Python ENCODING_RULES from rules.py
// ---------------------------------------------------------------------------

export const ENCODING_RULES: Record<string, EncodingRule> = {
  // Non-entangling, classically simulable
  angle: {
    bestFor: ["speed", "simplicity", "product_states", "nisq_hardware"],
    avoidWhen: [
      "need_entanglement",
      "quantum_advantage",
      "feature_interactions",
    ],
    maxFeatures: null,
    simulable: true,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "constant",
  },
  basis: {
    bestFor: ["binary_data", "combinatorial", "simplicity", "speed"],
    avoidWhen: [
      "continuous_data",
      "feature_interactions",
      "need_entanglement",
    ],
    maxFeatures: null,
    simulable: true,
    requiresDataType: ["binary", "discrete"],
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "constant",
  },
  higher_order_angle: {
    bestFor: [
      "polynomial_features",
      "feature_interactions",
      "product_states",
    ],
    avoidWhen: [
      "many_features",
      "need_entanglement",
      "quantum_advantage",
    ],
    maxFeatures: 10,
    simulable: true,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "shallow",
  },

  // Standard entangling encodings
  iqp: {
    bestFor: ["quantum_advantage", "expressibility", "kernel_methods"],
    avoidWhen: ["many_features", "noisy_hardware", "nisq_hardware"],
    maxFeatures: 12,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },
  zz_feature_map: {
    bestFor: ["kernel_methods", "standard_benchmark", "balanced"],
    avoidWhen: ["very_noisy_hardware", "many_features"],
    maxFeatures: 12,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },
  pauli_feature_map: {
    bestFor: [
      "custom_pauli",
      "kernel_methods",
      "research",
      "feature_interactions",
    ],
    avoidWhen: ["simplicity", "very_noisy_hardware"],
    maxFeatures: 12,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },
  data_reuploading: {
    bestFor: [
      "universal_approximation",
      "expressibility",
      "trainability",
      "time_series",
    ],
    avoidWhen: ["limited_depth", "nisq_hardware", "speed"],
    maxFeatures: 8,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "deep",
  },
  hardware_efficient: {
    bestFor: ["nisq_hardware", "native_gates", "noise_resilience"],
    avoidWhen: ["simulator_only", "quantum_advantage"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "shallow",
  },

  // Specialised encodings
  amplitude: {
    bestFor: [
      "many_features",
      "compression",
      "exponential_compression",
    ],
    avoidWhen: ["nisq_hardware", "shallow_circuits", "speed"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "logarithmic",
    circuitDepth: "deep",
  },
  qaoa: {
    bestFor: [
      "combinatorial",
      "graph_optimization",
      "qaoa_structure",
    ],
    avoidWhen: ["continuous_features_only", "speed"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },
  hamiltonian: {
    bestFor: [
      "physics_simulation",
      "time_evolution",
      "expressibility",
    ],
    avoidWhen: ["speed", "simplicity", "nisq_hardware"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "deep",
  },
  trainable: {
    bestFor: [
      "task_specific",
      "optimization",
      "trainability",
      "qnn",
    ],
    avoidWhen: ["no_optimization_budget", "simplicity"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: true,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },

  // Symmetry-aware
  symmetry_inspired: {
    bestFor: [
      "symmetry_general",
      "inductive_bias",
      "heuristic_symmetry",
    ],
    avoidWhen: ["rigorous_equivariance", "speed"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: "general",
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },

  // Rigorous equivariant encodings
  so2_equivariant: {
    bestFor: [
      "rotation_equivariance",
      "2d_rotation",
      "rigorous_equivariance",
    ],
    avoidWhen: ["many_features", "non_2d_data"],
    maxFeatures: 2,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: "rotation",
    requiresNFeatures: 2,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },
  cyclic_equivariant: {
    bestFor: [
      "cyclic_symmetry",
      "periodic_data",
      "rigorous_equivariance",
    ],
    avoidWhen: ["non_periodic_data"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: "cyclic",
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },
  swap_equivariant: {
    bestFor: [
      "permutation_pairs",
      "paired_features",
      "rigorous_equivariance",
    ],
    avoidWhen: ["odd_features", "non_paired_data"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: "permutation_pairs",
    requiresNFeatures: null,
    requiresEvenFeatures: true,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },
};

// ---------------------------------------------------------------------------
// Hard constraint checker — port of Python _passes_hard_constraints
// ---------------------------------------------------------------------------

export function passesHardConstraints(
  rules: EncodingRule,
  options: {
    nFeatures?: number | null;
    dataType?: string;
    symmetry?: string | null;
    trainable?: boolean;
  } = {},
): boolean {
  const {
    nFeatures = null,
    dataType = "continuous",
    symmetry = null,
    trainable = false,
  } = options;

  // 1. Data-type constraint
  if (
    rules.requiresDataType !== null &&
    !rules.requiresDataType.includes(dataType)
  ) {
    return false;
  }

  // 2. Exact feature-count constraint (e.g. SO2 requires exactly 2)
  if (
    rules.requiresNFeatures !== null &&
    nFeatures !== null &&
    nFeatures !== rules.requiresNFeatures
  ) {
    return false;
  }

  // 3. Even-features constraint (e.g. SwapEquivariant)
  if (
    rules.requiresEvenFeatures &&
    nFeatures !== null &&
    nFeatures % 2 !== 0
  ) {
    return false;
  }

  // 4. Maximum feature-count constraint
  if (
    rules.maxFeatures !== null &&
    nFeatures !== null &&
    nFeatures > rules.maxFeatures
  ) {
    return false;
  }

  // 5. Symmetry constraint
  if (
    rules.requiresSymmetry !== null &&
    (symmetry === null || symmetry !== rules.requiresSymmetry)
  ) {
    return false;
  }

  // 6. Trainable constraint
  if (rules.requiresTrainable && !trainable) {
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Public matching API — port of Python get_matching_encodings
// ---------------------------------------------------------------------------

export function getMatchingEncodings(
  requirements: string[],
  constraints: string[] | null = null,
  options: {
    nFeatures?: number | null;
    dataType?: string;
    symmetry?: string | null;
    trainable?: boolean;
  } = {},
): string[] {
  const matches: string[] = [];

  for (const [name, rules] of Object.entries(ENCODING_RULES)) {
    // Phase A — hard filter
    if (!passesHardConstraints(rules, options)) {
      continue;
    }

    // Phase B — soft tag match
    if (requirements.some((req) => rules.bestFor.includes(req))) {
      if (constraints) {
        if (!constraints.some((c) => rules.avoidWhen.includes(c))) {
          matches.push(name);
        }
      } else {
        matches.push(name);
      }
    }
  }

  return matches;
}
