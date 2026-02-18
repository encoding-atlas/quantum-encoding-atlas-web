import type { Encoding } from "./types";

export const symmetryInspiredEncoding: Encoding = {
  id: "symmetry_inspired",
  slug: "symmetry-inspired",
  name: "Symmetry-Inspired Feature Map",
  className: "SymmetryInspiredFeatureMap",
  category: "symmetry",

  shortDescription:
    "Heuristic encoding incorporating symmetry-aware gates for data with known group structure.",

  description:
    "The Symmetry-Inspired Feature Map incorporates symmetry information into the encoding circuit through symmetry-aware gate sequences. Unlike rigorously equivariant encodings, this approach uses heuristic circuit designs that respect the symmetry structure without formally guaranteeing equivariance.\n\nEach layer applies: (1) Hadamard gates for superposition, (2) RY encoding gates with feature-dependent angles, (3) RZ equivariant rotation gates, and (4) symmetry-dependent entangling gates. The entangling gates vary by symmetry type: rotation symmetry uses controlled-RZ (CRZ) gates on coordinate pairs, cyclic symmetry uses CNOT-RZ-CNOT chains, reflection symmetry uses CZ gates with RZ rotations, and full symmetry uses a richer CNOT-RY-CNOT-RY-CNOT decomposition.\n\nThis encoding serves as a general-purpose symmetry-aware feature map when the specific equivariant encodings (SO2, Cyclic, Swap) do not match the problem's symmetry group. It provides an inductive bias toward symmetry-preserving representations while maintaining flexibility.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\prod_{l=1}^{\\text{reps}} \\left[ U_{\\text{sym}} \\cdot U_{\\text{eq}} \\cdot U_{\\text{enc}}(\\mathbf{x}) \\cdot H^{\\otimes n} \\right] |0\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 12,
    gateCount: 48,
    singleQubitGates: 36,
    twoQubitGates: 12,
    parameterCount: 0,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.43,
    notes:
      "Symmetry-Inspired Feature Map with rotation symmetry, linear entanglement, 2 reps. Heuristic symmetry-aware encoding.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count).",
    },
    {
      name: "symmetry",
      type: 'Literal["rotation", "cyclic", "reflection", "full"]',
      default: "rotation",
      description:
        "Symmetry type to incorporate. Affects entangling gate choices and circuit structure.",
    },
    {
      name: "reps",
      type: "int",
      default: 2,
      description: "Number of symmetry-aware layer repetitions.",
    },
    {
      name: "entanglement",
      type: 'Literal["full", "linear", "circular", "none"]',
      default: "linear",
      description: "Entanglement topology for symmetry-dependent gates.",
    },
    {
      name: "feature_map",
      type: 'Literal["angle", "fourier", "polynomial"]',
      default: "angle",
      description:
        "Feature preprocessing: angle uses raw features, fourier applies Fourier transform, polynomial uses polynomial expansion.",
    },
    {
      name: "include_barriers",
      type: "bool",
      default: true,
      description: "Whether to insert barrier markers between layers.",
    },
  ],

  circuitStructure: [
    [
      { type: "H", qubits: [0] },
      { type: "H", qubits: [1] },
      { type: "H", qubits: [2] },
      { type: "H", qubits: [3] },
    ],
    [
      { type: "RY", qubits: [0], parameter: "x_0" },
      { type: "RY", qubits: [1], parameter: "x_1" },
      { type: "RY", qubits: [2], parameter: "x_2" },
      { type: "RY", qubits: [3], parameter: "x_3" },
    ],
    [
      { type: "RZ", qubits: [0], parameter: "r_0" },
      { type: "RZ", qubits: [1], parameter: "r_1" },
      { type: "RZ", qubits: [2], parameter: "r_2" },
      { type: "RZ", qubits: [3], parameter: "r_3" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
      { type: "RZ", qubits: [1], parameter: "θ_01" },
      { type: "CNOT", qubits: [0, 1] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import SymmetryInspiredFeatureMap
import pennylane as qml
import numpy as np

enc = SymmetryInspiredFeatureMap(n_features=4, symmetry="rotation", reps=2)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Symmetry-Inspired Feature Map with PennyLane using rotation symmetry.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import SymmetryInspiredFeatureMap
import numpy as np

enc = SymmetryInspiredFeatureMap(n_features=4, symmetry="cyclic")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Symmetry-Inspired Feature Map with Qiskit using cyclic symmetry.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import SymmetryInspiredFeatureMap
import numpy as np

enc = SymmetryInspiredFeatureMap(n_features=4, symmetry="full")
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description:
        "Symmetry-Inspired Feature Map with Cirq using full symmetry.",
    },
  ],

  useCases: [
    "Data with known but complex symmetry structure",
    "General-purpose symmetry-aware encoding",
    "Inductive bias for symmetry-preserving quantum ML models",
    "Problems where rigorous equivariance is desirable but not required",
    "Research into symmetry-informed quantum feature maps",
  ],

  prosAndCons: {
    pros: [
      "Incorporates symmetry information as inductive bias",
      "Supports four symmetry types (rotation, cyclic, reflection, full)",
      "More flexible than rigorously equivariant encodings",
      "Multiple feature preprocessing options (angle, fourier, polynomial)",
      "Configurable entanglement topology",
    ],
    cons: [
      "Heuristic — does not formally guarantee equivariance",
      "More complex circuit than non-symmetry encodings",
      "Requires knowing the data's symmetry type a priori",
      "Full entanglement scales O(n²) for large feature counts",
      "Lower trainability with deep circuits and many entangling pairs",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 8,
      gateCount: 20,
      singleQubitGates: 16,
      twoQubitGates: 4,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 12,
      gateCount: 48,
      singleQubitGates: 36,
      twoQubitGates: 12,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 20,
      gateCount: 104,
      singleQubitGates: 76,
      twoQubitGates: 28,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 36,
      gateCount: 216,
      singleQubitGates: 156,
      twoQubitGates: 60,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
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

  references: [
    "Meyer, J.J., et al. (2023). Exploiting symmetry in variational quantum machine learning. PRX Quantum, 4(1), 010328.",
    "Larocca, M., et al. (2022). Group-invariant quantum machine learning. PRX Quantum, 3(3), 030341.",
    "Nguyen, Q.T., et al. (2022). Theory for equivariant quantum neural networks. PRX Quantum, 3(3), 030322.",
  ],

  relatedEncodings: [
    "so2-equivariant",
    "cyclic-equivariant",
    "swap-equivariant",
  ],
};
