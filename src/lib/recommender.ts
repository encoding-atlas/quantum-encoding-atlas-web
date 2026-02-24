/**
 * Encoding recommendation engine.
 *
 * Faithful TypeScript port of the Python recommender.py + decision_tree.py.
 * Pure logic — no React dependencies. Can be unit-tested independently.
 *
 * Two-phase pipeline:
 * 1. Hard filter — structurally impossible encodings are eliminated.
 * 2. Soft scoring — remaining candidates ranked by weighted score.
 */

import {
  ENCODING_RULES,
  passesHardConstraints,
  VALID_DATA_TYPES,
  VALID_FEATURE_INTERACTIONS,
  VALID_PRIORITIES,
  VALID_PROBLEM_STRUCTURES,
  VALID_SYMMETRIES,
  VALID_TASKS,
} from "@/data/guide-rules";
import type {
  DataType,
  EncodingRule,
  FeatureInteraction,
  GuideInput,
  Priority,
  ProblemStructure,
  Recommendation,
  SymmetryType,
  Task,
} from "@/data/encodings/types";

// ---------------------------------------------------------------------------
// Decision tree path type (for visualization)
// ---------------------------------------------------------------------------

export interface DecisionStep {
  level: number;
  question: string;
  answer: string;
  isTerminal: boolean;
  encodingId?: string;
}

// ---------------------------------------------------------------------------
// Explanation templates (verbatim from Python)
// ---------------------------------------------------------------------------

const EXPLANATION_TEMPLATES: Record<string, string> = {
  angle:
    "Angle encoding provides O(1) depth with simple rotations, ideal for {reason}",
  basis:
    "Basis encoding directly maps binary/discrete features to computational basis states",
  higher_order_angle:
    "Higher-order angle encoding captures polynomial feature interactions (order-k products) without entanglement",
  iqp:
    "IQP encoding creates highly entangled states with provable classical simulation hardness, well-suited for kernel methods",
  zz_feature_map:
    "ZZ Feature Map provides standard pairwise feature interactions via (\u03C0\u2212x\u1D62)(\u03C0\u2212x\u2C7C) phase encoding for kernel methods",
  pauli_feature_map:
    "Pauli Feature Map enables configurable Pauli-string rotation structures for custom feature interactions",
  data_reuploading:
    "Data re-uploading achieves universal approximation capability through repeated data encoding with entanglement layers",
  hardware_efficient:
    "Hardware-efficient encoding minimises gate decomposition overhead on real quantum devices",
  amplitude:
    "Amplitude encoding provides exponential compression ({n_qubits} qubits for {n_features} features)",
  qaoa:
    "QAOA-inspired encoding uses cost-mixer layer structure suited for combinatorial and graph-structured problems",
  hamiltonian:
    "Hamiltonian encoding applies Trotterised time evolution under a data-dependent Hamiltonian for physics-inspired ML",
  trainable:
    "Trainable encoding interleaves data rotations with learnable parameter layers for task-specific optimisation",
  symmetry_inspired:
    "Symmetry-inspired encoding provides a heuristic symmetry-aware inductive bias for the given problem",
  so2_equivariant:
    "SO(2) equivariant encoding guarantees mathematically rigorous 2D rotational equivariance for the 2-feature input",
  cyclic_equivariant:
    "Cyclic equivariant encoding guarantees rigorous Z\u2099 cyclic shift symmetry with ring-topology circuits",
  swap_equivariant:
    "Swap equivariant encoding guarantees rigorous S\u2082 pair-swap symmetry over feature pairs",
};

// ---------------------------------------------------------------------------
// Scoring weight constants (exact Python values)
// ---------------------------------------------------------------------------

const W_DATA_TYPE_BONUS = 0.5;
const W_SYMMETRY_BONUS = 0.45;
const W_N_FEATURES_BONUS = 0.1;
const W_TRAINABLE_BONUS = 0.4;

const W_BINARY_PENALTY = 0.2;

const W_PRIORITY_PER_TAG = 0.1;
const PRIORITY_TAG_CAP = 2;

const W_STRUCTURE_BONUS = 0.36;

const W_INTERACTION_BONUS = 0.35;

const W_TASK_BONUS = 0.04;

const W_HARDWARE_NISQ_BONUS = 0.1;
const W_HARDWARE_DEEP_PENALTY = 0.15;
const W_AVOID_WHEN_PENALTY = 0.08;

const W_LOGARITHMIC_BONUS = 0.15;
const W_ACCURACY_DEFAULT_BONUS = 0.12;
const W_SMALL_FEATURE_BONUS = 0.03;

const W_SMALL_SAMPLE_BONUS = 0.03;

const HARDWARE_AVOID_TAGS = new Set(["noisy_hardware", "nisq_hardware"]);

// ---------------------------------------------------------------------------
// Scoring lookup maps (exact Python values)
// ---------------------------------------------------------------------------

const PRIORITY_TAG_MAP: Record<string, string[]> = {
  speed: ["speed", "simplicity"],
  noise_resilience: ["nisq_hardware", "native_gates", "noise_resilience"],
  trainability: ["trainability", "task_specific", "optimization"],
  accuracy: [
    "expressibility",
    "quantum_advantage",
    "universal_approximation",
    "kernel_methods",
  ],
};

const TASK_TAG_MAP: Record<string, string[]> = {
  classification: ["kernel_methods"],
  regression: ["universal_approximation"],
};

const ACCURACY_DEFAULT_BY_FEATURE_RANGE: Record<string, string> = {
  small: "iqp",
  medium: "zz_feature_map",
  large: "amplitude",
};

const STRUCTURE_TAG_MAP: Record<string, string[]> = {
  combinatorial: ["combinatorial", "graph_optimization", "qaoa_structure"],
  physics_simulation: ["physics_simulation", "time_evolution"],
  time_series: ["periodic_data", "cyclic_symmetry", "time_series"],
};

// ---------------------------------------------------------------------------
// Required input interface (all fields required, defaults applied upstream)
// ---------------------------------------------------------------------------

interface ResolvedInput {
  nFeatures: number;
  nSamples: number;
  task: Task;
  hardware: string;
  priority: Priority;
  dataType: DataType;
  symmetry: SymmetryType | null;
  trainable: boolean;
  problemStructure: ProblemStructure | null;
  featureInteractions: FeatureInteraction | null;
}

// ---------------------------------------------------------------------------
// Input validation + default resolution
// ---------------------------------------------------------------------------

export function validateGuideInput(input: Partial<GuideInput>): ResolvedInput {
  const nFeatures = input.nFeatures;
  if (nFeatures === undefined || !Number.isInteger(nFeatures) || nFeatures < 1) {
    throw new Error(
      `nFeatures must be a positive integer, got ${String(nFeatures)}`
    );
  }

  const nSamples = input.nSamples ?? 500;
  if (!Number.isInteger(nSamples) || nSamples < 1) {
    throw new Error(
      `nSamples must be a positive integer, got ${String(nSamples)}`
    );
  }

  const task = input.task ?? "classification";
  if (!VALID_TASKS.has(task)) {
    throw new Error(`task must be one of ${[...VALID_TASKS].join(", ")}, got "${task}"`);
  }

  const hardware = input.hardware ?? "simulator";
  if (!hardware) {
    throw new Error("hardware must be a non-empty string");
  }

  const priority = input.priority ?? "accuracy";
  if (!VALID_PRIORITIES.has(priority)) {
    throw new Error(
      `priority must be one of ${[...VALID_PRIORITIES].join(", ")}, got "${priority}"`
    );
  }

  const dataType = input.dataType ?? "continuous";
  if (!VALID_DATA_TYPES.has(dataType)) {
    throw new Error(
      `dataType must be one of ${[...VALID_DATA_TYPES].join(", ")}, got "${dataType}"`
    );
  }

  const symmetry = input.symmetry ?? null;
  if (symmetry !== null && !VALID_SYMMETRIES.has(symmetry)) {
    throw new Error(
      `symmetry must be one of ${[...VALID_SYMMETRIES].join(", ")} or null, got "${symmetry}"`
    );
  }

  const trainable = input.trainable ?? false;

  const problemStructure = input.problemStructure ?? null;
  if (problemStructure !== null && !VALID_PROBLEM_STRUCTURES.has(problemStructure)) {
    throw new Error(
      `problemStructure must be one of ${[...VALID_PROBLEM_STRUCTURES].join(", ")} or null, got "${problemStructure}"`
    );
  }

  const featureInteractions = input.featureInteractions ?? null;
  if (featureInteractions !== null && !VALID_FEATURE_INTERACTIONS.has(featureInteractions)) {
    throw new Error(
      `featureInteractions must be one of ${[...VALID_FEATURE_INTERACTIONS].join(", ")} or null, got "${featureInteractions}"`
    );
  }

  return {
    nFeatures,
    nSamples,
    task,
    hardware,
    priority,
    dataType,
    symmetry,
    trainable,
    problemStructure,
    featureInteractions,
  };
}

// ---------------------------------------------------------------------------
// Core scoring — 9-step pipeline (exact Python port)
// ---------------------------------------------------------------------------

export function computeScore(
  name: string,
  rules: EncodingRule,
  input: ResolvedInput
): number {
  let score = 0.0;

  // 1. Hard-precondition bonuses
  if (
    rules.requiresDataType !== null &&
    rules.requiresDataType.includes(input.dataType)
  ) {
    score += W_DATA_TYPE_BONUS;
  }

  if (
    rules.requiresSymmetry !== null &&
    input.symmetry === rules.requiresSymmetry
  ) {
    score += W_SYMMETRY_BONUS;
  }

  if (
    rules.requiresNFeatures !== null &&
    input.nFeatures === rules.requiresNFeatures
  ) {
    score += W_N_FEATURES_BONUS;
  }

  if (rules.requiresTrainable && input.trainable) {
    score += W_TRAINABLE_BONUS;
  }

  // 2. Binary/discrete penalty
  if (
    (input.dataType === "binary" || input.dataType === "discrete") &&
    rules.requiresDataType === null
  ) {
    score -= W_BINARY_PENALTY;
  }

  // 3. Priority matching
  const priorityTags = PRIORITY_TAG_MAP[input.priority] ?? [];
  let matchedPriority = 0;
  for (const t of priorityTags) {
    if (rules.bestFor.includes(t)) {
      matchedPriority++;
    }
  }
  score += W_PRIORITY_PER_TAG * Math.min(matchedPriority, PRIORITY_TAG_CAP);

  // 4. Problem structure matching
  if (input.problemStructure !== null) {
    const structTags = STRUCTURE_TAG_MAP[input.problemStructure] ?? [];
    if (structTags.some((t) => rules.bestFor.includes(t))) {
      score += W_STRUCTURE_BONUS;
    }
  }

  // 5. Feature interaction matching
  if (input.featureInteractions === "polynomial") {
    if (rules.bestFor.includes("polynomial_features")) {
      score += W_INTERACTION_BONUS;
    }
  } else if (
    input.featureInteractions === "custom_pauli" &&
    rules.bestFor.includes("custom_pauli")
  ) {
    score += W_INTERACTION_BONUS;
  }

  // 6. Task matching (only when no domain-specific param is active)
  if (input.problemStructure === null && input.featureInteractions === null) {
    const taskTags = TASK_TAG_MAP[input.task] ?? [];
    if (taskTags.some((t) => rules.bestFor.includes(t))) {
      score += W_TASK_BONUS;
    }
  }

  // 7. Hardware suitability
  if (input.hardware !== "simulator") {
    if (
      ["nisq_hardware", "native_gates", "noise_resilience"].some((t) =>
        rules.bestFor.includes(t)
      )
    ) {
      score += W_HARDWARE_NISQ_BONUS;
    }
    if (rules.circuitDepth === "deep") {
      score -= W_HARDWARE_DEEP_PENALTY;
    }
    if (rules.avoidWhen.some((t) => HARDWARE_AVOID_TAGS.has(t))) {
      score -= W_AVOID_WHEN_PENALTY;
    }
  }

  // 8. Feature count suitability
  if (input.nFeatures > 8 && rules.qubitScaling === "logarithmic") {
    score += W_LOGARITHMIC_BONUS;
  }

  const hasSpecialisedIntent =
    input.trainable ||
    input.symmetry !== null ||
    input.problemStructure !== null ||
    input.featureInteractions !== null;

  if (input.priority === "accuracy" && !hasSpecialisedIntent) {
    const size =
      input.nFeatures <= 4
        ? "small"
        : input.nFeatures <= 8
          ? "medium"
          : "large";
    if (name === ACCURACY_DEFAULT_BY_FEATURE_RANGE[size]) {
      score += W_ACCURACY_DEFAULT_BONUS;
    }
  }

  if (
    input.nFeatures <= 4 &&
    rules.maxFeatures !== null &&
    rules.maxFeatures >= input.nFeatures
  ) {
    score += W_SMALL_FEATURE_BONUS;
  }

  // 9. Sample count factor
  if (input.nSamples < 100 && rules.simulable) {
    score += W_SMALL_SAMPLE_BONUS;
  }

  return Math.max(0.0, Math.min(1.0, score));
}

// ---------------------------------------------------------------------------
// Score to confidence — piecewise linear mapping (exact Python port)
// ---------------------------------------------------------------------------

export function scoreToConfidence(score: number): number {
  if (score >= 0.5) {
    return Math.min(0.95, 0.85 + (score - 0.5) * 0.2);
  }
  if (score >= 0.3) {
    return 0.65 + (score - 0.3) * 1.0;
  }
  return 0.5 + score * 0.5;
}

// ---------------------------------------------------------------------------
// Explanation generation (exact Python port)
// ---------------------------------------------------------------------------

export function generateExplanation(
  name: string,
  _rules: EncodingRule,
  priority: string,
  nFeatures: number
): string {
  const template =
    EXPLANATION_TEMPLATES[name] ?? `${name} encoding matches your requirements`;

  const nQubits =
    name === "amplitude"
      ? Math.max(1, Math.ceil(Math.log2(Math.max(nFeatures, 1))))
      : 0;

  try {
    return template
      .replace("{reason}", priority)
      .replace("{n_features}", String(nFeatures))
      .replace("{n_qubits}", String(nQubits));
  } catch {
    return template;
  }
}

// ---------------------------------------------------------------------------
// Main recommendation API — two-phase pipeline (exact Python port)
// ---------------------------------------------------------------------------

export function recommendEncoding(input: Partial<GuideInput>): Recommendation {
  const resolved = validateGuideInput(input);

  // Phase A — hard filter
  const candidates: Record<string, EncodingRule> = {};
  for (const [name, rules] of Object.entries(ENCODING_RULES)) {
    if (
      passesHardConstraints(rules, {
        nFeatures: resolved.nFeatures,
        dataType: resolved.dataType,
        symmetry: resolved.symmetry,
        trainable: resolved.trainable,
      })
    ) {
      candidates[name] = rules;
    }
  }

  // Defensive fallback
  if (Object.keys(candidates).length === 0) {
    return {
      encodingId: "angle",
      explanation:
        "No encoding matches all constraints; angle encoding is the safest general-purpose fallback",
      alternatives: [],
      confidence: scoreToConfidence(0.0),
    };
  }

  // Check symmetry survival
  let symmetryNote = "";
  if (resolved.symmetry !== null) {
    const symmetrySurvived = Object.values(candidates).some(
      (r) => r.requiresSymmetry === resolved.symmetry
    );
    if (!symmetrySurvived) {
      symmetryNote = ` Note: no encoding with '${resolved.symmetry}' symmetry support is compatible with n_features=${resolved.nFeatures}; falling back to general recommendation.`;
    }
  }

  // Phase B — score candidates
  const scores: Record<string, number> = {};
  for (const [name, rules] of Object.entries(candidates)) {
    scores[name] = computeScore(name, rules, resolved);
  }

  // Rank: descending score, alphabetical name for ties
  const ranked = Object.entries(scores).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );

  const [bestName, bestScore] = ranked[0];
  const alternatives = ranked.slice(1, 4).map(([name]) => name);

  const confidence = scoreToConfidence(bestScore);
  const explanation =
    generateExplanation(
      bestName,
      candidates[bestName],
      resolved.priority,
      resolved.nFeatures
    ) + symmetryNote;

  return {
    encodingId: bestName,
    explanation,
    alternatives,
    confidence,
  };
}

// ---------------------------------------------------------------------------
// Decision tree — 7-level deterministic (exact Python port)
// ---------------------------------------------------------------------------

export function decideEncoding(input: Partial<GuideInput>): string {
  const dataType = input.dataType ?? "continuous";
  const nFeatures = input.nFeatures ?? 4;
  const symmetry = input.symmetry ?? null;
  const trainable = input.trainable ?? false;
  const priority = input.priority ?? "accuracy";
  const problemStructure = input.problemStructure ?? null;
  const featureInteractions = input.featureInteractions ?? null;

  // Level 1 — data type
  if (dataType === "binary" || dataType === "discrete") {
    return "basis";
  }

  // Level 2 — symmetry
  if (symmetry === "rotation" && nFeatures === 2) {
    return "so2_equivariant";
  }
  if (symmetry === "cyclic") {
    return "cyclic_equivariant";
  }
  if (symmetry === "permutation_pairs" && nFeatures % 2 === 0) {
    return "swap_equivariant";
  }
  if (symmetry === "general") {
    return "symmetry_inspired";
  }

  // Level 3 — trainable
  if (trainable) {
    return "trainable";
  }

  // Level 4 — problem structure
  if (problemStructure === "combinatorial") {
    return "qaoa";
  }
  if (problemStructure === "physics_simulation") {
    return "hamiltonian";
  }
  if (problemStructure === "time_series") {
    return "data_reuploading";
  }

  // Level 5 — feature interactions
  if (featureInteractions === "polynomial") {
    return "higher_order_angle";
  }
  if (featureInteractions === "custom_pauli") {
    return "pauli_feature_map";
  }

  // Level 6 — priority
  if (priority === "speed") {
    return "angle";
  }
  if (priority === "noise_resilience") {
    return "hardware_efficient";
  }
  if (priority === "trainability") {
    return "data_reuploading";
  }

  // Level 7 — accuracy feature-count fallback
  if (nFeatures <= 4) {
    return "iqp";
  }
  if (nFeatures <= 8) {
    return "zz_feature_map";
  }
  return "amplitude";
}

// ---------------------------------------------------------------------------
// Decision tree path tracer (for visualization)
// ---------------------------------------------------------------------------

export function getDecisionPath(input: Partial<GuideInput>): DecisionStep[] {
  const steps: DecisionStep[] = [];
  const dataType = input.dataType ?? "continuous";
  const nFeatures = input.nFeatures ?? 4;
  const symmetry = input.symmetry ?? null;
  const trainable = input.trainable ?? false;
  const priority = input.priority ?? "accuracy";
  const problemStructure = input.problemStructure ?? null;
  const featureInteractions = input.featureInteractions ?? null;

  // Level 1 — data type
  steps.push({
    level: 1,
    question: "What is your data type?",
    answer: dataType,
    isTerminal: dataType === "binary" || dataType === "discrete",
    encodingId:
      dataType === "binary" || dataType === "discrete" ? "basis" : undefined,
  });
  if (dataType === "binary" || dataType === "discrete") return steps;

  // Level 2 — symmetry
  const symmetryAnswer = symmetry ?? "none";
  let symmetryResult: string | undefined;
  if (symmetry === "rotation" && nFeatures === 2) {
    symmetryResult = "so2_equivariant";
  } else if (symmetry === "cyclic") {
    symmetryResult = "cyclic_equivariant";
  } else if (symmetry === "permutation_pairs" && nFeatures % 2 === 0) {
    symmetryResult = "swap_equivariant";
  } else if (symmetry === "general") {
    symmetryResult = "symmetry_inspired";
  }
  steps.push({
    level: 2,
    question: "Does your data have a known symmetry?",
    answer: symmetryAnswer,
    isTerminal: symmetryResult !== undefined,
    encodingId: symmetryResult,
  });
  if (symmetryResult) return steps;

  // Level 3 — trainable
  steps.push({
    level: 3,
    question: "Do you want trainable encoding parameters?",
    answer: trainable ? "yes" : "no",
    isTerminal: trainable,
    encodingId: trainable ? "trainable" : undefined,
  });
  if (trainable) return steps;

  // Level 4 — problem structure
  const structAnswer = problemStructure ?? "none / general";
  let structResult: string | undefined;
  if (problemStructure === "combinatorial") structResult = "qaoa";
  else if (problemStructure === "physics_simulation") structResult = "hamiltonian";
  else if (problemStructure === "time_series") structResult = "data_reuploading";
  steps.push({
    level: 4,
    question: "What is the problem structure?",
    answer: structAnswer,
    isTerminal: structResult !== undefined,
    encodingId: structResult,
  });
  if (structResult) return steps;

  // Level 5 — feature interactions
  const interAnswer = featureInteractions ?? "none";
  let interResult: string | undefined;
  if (featureInteractions === "polynomial") interResult = "higher_order_angle";
  else if (featureInteractions === "custom_pauli") interResult = "pauli_feature_map";
  steps.push({
    level: 5,
    question: "Do you need specific feature interactions?",
    answer: interAnswer,
    isTerminal: interResult !== undefined,
    encodingId: interResult,
  });
  if (interResult) return steps;

  // Level 6 — priority
  let priorityResult: string | undefined;
  if (priority === "speed") priorityResult = "angle";
  else if (priority === "noise_resilience") priorityResult = "hardware_efficient";
  else if (priority === "trainability") priorityResult = "data_reuploading";
  steps.push({
    level: 6,
    question: "What is your optimisation priority?",
    answer: priority,
    isTerminal: priorityResult !== undefined,
    encodingId: priorityResult,
  });
  if (priorityResult) return steps;

  // Level 7 — feature count (accuracy fallback)
  const sizeLabel =
    nFeatures <= 4
      ? `few (\u2264 4)`
      : nFeatures <= 8
        ? "medium (5\u20138)"
        : `many (> 8)`;
  const finalResult =
    nFeatures <= 4 ? "iqp" : nFeatures <= 8 ? "zz_feature_map" : "amplitude";
  steps.push({
    level: 7,
    question: "How many features?",
    answer: sizeLabel,
    isTerminal: true,
    encodingId: finalResult,
  });

  return steps;
}
