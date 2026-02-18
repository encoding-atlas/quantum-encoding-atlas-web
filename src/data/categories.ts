import type { EncodingCategory } from "./encodings/types";

export const ENCODING_CATEGORIES: readonly EncodingCategory[] = [
  {
    id: "angle-based",
    name: "Angle-based",
    colorVariable: "--cat-angle",
    description:
      "Single-qubit rotations encoding features as gate angles. Produces product states with no entanglement.",
    encodingIds: ["angle", "higher_order_angle"],
  },
  {
    id: "amplitude-based",
    name: "Amplitude-based",
    colorVariable: "--cat-amplitude",
    description:
      "Features encoded in quantum state amplitudes, enabling exponential compression of data into logarithmically many qubits.",
    encodingIds: ["amplitude"],
  },
  {
    id: "basis",
    name: "Basis",
    colorVariable: "--cat-basis",
    description:
      "Classical bit strings mapped to computational basis states. Deterministic with no superposition or entanglement.",
    encodingIds: ["basis"],
  },
  {
    id: "entangling",
    name: "Entangling Feature Maps",
    colorVariable: "--cat-entangling",
    description:
      "Multi-qubit entangling circuits creating feature interactions via two-qubit gates and phase encoding.",
    encodingIds: ["iqp", "zz_feature_map", "pauli_feature_map"],
  },
  {
    id: "variational",
    name: "Variational",
    colorVariable: "--cat-variational",
    description:
      "Parameterized circuits combining data-dependent rotations with trainable parameters or hardware-native gates.",
    encodingIds: [
      "data_reuploading",
      "hardware_efficient",
      "qaoa",
      "trainable",
    ],
  },
  {
    id: "physics-inspired",
    name: "Physics-inspired",
    colorVariable: "--cat-physics",
    description:
      "Encodings motivated by physical Hamiltonians and time evolution operators, suited for physics simulation.",
    encodingIds: ["hamiltonian"],
  },
  {
    id: "symmetry",
    name: "Symmetry & Equivariant",
    colorVariable: "--cat-symmetry",
    description:
      "Encodings preserving mathematical symmetries of the data, from heuristic approaches to rigorously equivariant circuits.",
    encodingIds: [
      "symmetry_inspired",
      "so2_equivariant",
      "cyclic_equivariant",
      "swap_equivariant",
    ],
  },
] as const;

export const CATEGORY_MAP = new Map(
  ENCODING_CATEGORIES.map((c) => [c.id, c]),
);

export function getCategoryById(
  id: string,
): EncodingCategory | undefined {
  return CATEGORY_MAP.get(id as EncodingCategory["id"]);
}
