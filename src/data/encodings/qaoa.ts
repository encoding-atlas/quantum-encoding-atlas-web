import type { Encoding } from "./types";

export const qaoaEncoding: Encoding = {
  id: "qaoa",
  slug: "qaoa",
  name: "QAOA Encoding",
  className: "QAOAEncoding",
  category: "variational",

  shortDescription:
    "QAOA-inspired encoding with alternating cost and mixer layers for combinatorial data.",

  description:
    "QAOA (Quantum Approximate Optimization Algorithm) encoding adapts the QAOA circuit structure for data encoding. It alternates between cost layers that encode features through data-dependent rotations and mixer layers that spread information across qubits via entangling gates. This structure is particularly well-suited for combinatorial optimization problems.\n\nThe circuit begins with Hadamard gates to create equal superposition, then repeats p layers of: (1) data rotation gates R_data(γ·x_i) encoding features as phase-like rotations, (2) entangling gates (CZ, CX, or RZZ) coupling qubits, and (3) mixer rotation gates R_mixer(β) for exploration. The γ and β parameters control the encoding strength and mixing, respectively.\n\nThe encoding supports both linear and quadratic feature maps: linear maps φ(x_i) = γ·x_i, while quadratic uses φ(x_i) = γ·x_i². An edge-coloring-based algorithm optimizes the circuit depth for the entanglement pattern, yielding near-optimal parallel gate scheduling.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\prod_{p=1}^{\\text{reps}} U_M(\\beta) \\cdot U_C(\\gamma, \\mathbf{x}) |+\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 9,
    gateCount: 26,
    singleQubitGates: 20,
    twoQubitGates: 6,
    parameterCount: 0,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.77,
    notes:
      "QAOA encoding with linear entanglement, 2 reps, RZ data rotation, RX mixer, CZ gates. Edge-coloring optimized depth.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count).",
    },
    {
      name: "reps",
      type: "int",
      default: 2,
      description: "Number of QAOA layers (analogous to circuit depth p).",
    },
    {
      name: "data_rotation",
      type: 'Literal["X", "Y", "Z"]',
      default: "Z",
      description: "Rotation axis for data-encoding gates in the cost layer.",
    },
    {
      name: "mixer_rotation",
      type: 'Literal["X", "Y", "Z"]',
      default: "X",
      description: "Rotation axis for mixer layer gates.",
    },
    {
      name: "entanglement",
      type: 'Literal["linear", "full", "circular", "none"]',
      default: "linear",
      description: "Entanglement topology for coupling gates.",
    },
    {
      name: "entangling_gate",
      type: 'Literal["cx", "cz", "rzz"]',
      default: "cz",
      description: "Type of two-qubit gate used for entanglement.",
    },
    {
      name: "gamma",
      type: "float",
      default: 1.0,
      description: "Scaling factor for the cost (data encoding) layer.",
    },
    {
      name: "beta",
      type: "float",
      default: 1.0,
      description: "Scaling factor for the mixer layer.",
    },
    {
      name: "include_initial_h",
      type: "bool",
      default: true,
      description:
        "Whether to include initial Hadamard layer for equal superposition.",
    },
    {
      name: "feature_map",
      type: 'Literal["linear", "quadratic"]',
      default: "linear",
      description:
        "Feature mapping: linear uses γ·x_i, quadratic uses γ·x_i².",
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
      { type: "RZ", qubits: [0], parameter: "γ·x_0" },
      { type: "RZ", qubits: [1], parameter: "γ·x_1" },
      { type: "RZ", qubits: [2], parameter: "γ·x_2" },
      { type: "RZ", qubits: [3], parameter: "γ·x_3" },
    ],
    [
      { type: "CZ", qubits: [0, 1] },
      { type: "CZ", qubits: [1, 2] },
      { type: "CZ", qubits: [2, 3] },
    ],
    [
      { type: "RX", qubits: [0], parameter: "β" },
      { type: "RX", qubits: [1], parameter: "β" },
      { type: "RX", qubits: [2], parameter: "β" },
      { type: "RX", qubits: [3], parameter: "β" },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import QAOAEncoding
import pennylane as qml
import numpy as np

enc = QAOAEncoding(n_features=4, reps=2, entanglement="linear")
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "QAOA encoding with PennyLane using linear entanglement and CZ gates.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import QAOAEncoding
import numpy as np

enc = QAOAEncoding(n_features=4, reps=2, entangling_gate="cz")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description: "QAOA encoding with Qiskit, showing cost and mixer layers.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import QAOAEncoding
import numpy as np

enc = QAOAEncoding(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "QAOA encoding with Cirq backend.",
    },
  ],

  useCases: [
    "Encoding data for combinatorial optimization problems",
    "Graph-structured data encoding (e.g., MaxCut, TSP)",
    "QAOA-inspired variational classifiers",
    "Problems with natural cost-function structure",
    "Quantum optimization benchmarks",
  ],

  prosAndCons: {
    pros: [
      "Natural fit for combinatorial optimization problems",
      "Flexible entangling gate choices (CX, CZ, RZZ)",
      "Edge-coloring optimized depth for parallel gate scheduling",
      "Supports both linear and quadratic feature maps",
      "Good trainability with linear entanglement",
    ],
    cons: [
      "Specialized structure — may not be optimal for general ML tasks",
      "Full entanglement scales poorly for large feature counts",
      "Fixed γ and β parameters limit adaptability without optimization",
      "Barren plateau risk increases with reps > 10",
      "Not designed for continuous feature-intensive tasks",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 7,
      gateCount: 12,
      singleQubitGates: 10,
      twoQubitGates: 2,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 9,
      gateCount: 26,
      singleQubitGates: 20,
      twoQubitGates: 6,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 9,
      gateCount: 54,
      singleQubitGates: 40,
      twoQubitGates: 14,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 9,
      gateCount: 110,
      singleQubitGates: 80,
      twoQubitGates: 30,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
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

  references: [
    "Farhi, E., Goldstone, J., & Gutmann, S. (2014). A Quantum Approximate Optimization Algorithm. arXiv:1411.4028.",
    "Hadfield, S., et al. (2019). From the Quantum Approximate Optimization Algorithm to a Quantum Alternating Operator Ansatz. Algorithms, 12(2), 34.",
    "Zhou, L., et al. (2020). Quantum Approximate Optimization Algorithm: Performance, Mechanism, and Implementation on Near-Term Devices. Physical Review X, 10(2), 021067.",
  ],

  relatedEncodings: ["hamiltonian", "hardware-efficient", "basis"],
};
