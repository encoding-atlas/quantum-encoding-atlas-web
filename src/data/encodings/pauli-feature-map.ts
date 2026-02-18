import type { Encoding } from "./types";

export const pauliFeatureMapEncoding: Encoding = {
  id: "pauli_feature_map",
  slug: "pauli-feature-map",
  name: "Pauli Feature Map",
  className: "PauliFeatureMap",
  category: "entangling",

  shortDescription:
    "Generalized feature map with configurable Pauli rotation strings for custom feature interactions.",

  description:
    "The Pauli Feature Map generalizes the ZZ Feature Map by allowing arbitrary Pauli operator strings for both single-qubit and two-qubit interactions. Instead of being restricted to Z-basis operations, the encoding supports any combination of Pauli operators (X, Y, Z) in both single and two-qubit terms, enabling richer and more flexible feature maps.\n\nEach layer applies Hadamard gates for superposition, then single-qubit Pauli rotations (e.g., RZ, RX, RY) with feature-dependent angles, followed by two-qubit Pauli interaction gates (e.g., ZZ, XX, YY, XZ). The two-qubit terms are decomposed into CNOT gates with basis-change rotations when non-Z Paulis are involved, increasing circuit depth for X and Y terms.\n\nThis flexibility makes the Pauli Feature Map the most versatile entangling encoding in the library, suitable for research applications where custom feature interaction kernels are needed. The default configuration uses [\"Z\", \"ZZ\"] Pauli strings, which is equivalent to the ZZ Feature Map.",

  mathFormulation:
    "U_{\\Phi}(\\mathbf{x}) = \\prod_{S \\subseteq [n]} \\exp\\left(i \\phi_S(\\mathbf{x}) \\prod_{k \\in S} P_k\\right), \\quad P_k \\in \\{X, Y, Z\\}",

  properties: {
    nQubits: 4,
    depth: 10,
    gateCount: 52,
    singleQubitGates: 28,
    twoQubitGates: 24,
    parameterCount: 0,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.4,
    notes:
      "Pauli Feature Map with default [Z, ZZ] paulis and full entanglement, 2 reps. Equivalent to ZZ Feature Map when using default paulis.",
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
      description: "Number of repetitions of the feature map layer.",
    },
    {
      name: "paulis",
      type: "list[str] | None",
      default: null,
      description:
        'Pauli operator strings. Default: ["Z", "ZZ"]. Single-char strings (e.g., "X") are single-qubit terms; multi-char (e.g., "ZZ", "XY") are two-qubit terms.',
    },
    {
      name: "entanglement",
      type: 'Literal["full", "linear", "circular"]',
      default: "full",
      description: "Entanglement topology for two-qubit Pauli terms.",
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
      { type: "RZ", qubits: [0], parameter: "2x_0" },
      { type: "RZ", qubits: [1], parameter: "2x_1" },
      { type: "RZ", qubits: [2], parameter: "2x_2" },
      { type: "RZ", qubits: [3], parameter: "2x_3" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
      { type: "RZ", qubits: [1], parameter: "2(π−x_0)(π−x_1)" },
      { type: "CNOT", qubits: [0, 1] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import PauliFeatureMap
import pennylane as qml
import numpy as np

enc = PauliFeatureMap(n_features=4, reps=2, paulis=["Z", "ZZ"])
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Pauli Feature Map with PennyLane using default Z+ZZ Pauli strings.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import PauliFeatureMap
import numpy as np

enc = PauliFeatureMap(n_features=4, reps=2, paulis=["Y", "XX"])
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Pauli Feature Map with Qiskit using custom Y+XX Pauli strings.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import PauliFeatureMap
import numpy as np

enc = PauliFeatureMap(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Pauli Feature Map with Cirq using default configuration.",
    },
  ],

  useCases: [
    "Custom quantum kernel design with specific Pauli interaction terms",
    "Research into optimal feature map structures",
    "Encoding domain-specific feature interactions (e.g., XX for correlation-sensitive data)",
    "Quantum kernel methods requiring non-standard feature maps",
    "Benchmarking different Pauli term combinations",
  ],

  prosAndCons: {
    pros: [
      "Maximum flexibility — any Pauli operator combination",
      "Subsumes ZZ Feature Map and other standard feature maps as special cases",
      "Enables custom feature interaction kernels for domain-specific problems",
      "Supports all entanglement topologies",
      "Rich theoretical framework connecting Pauli terms to kernel expressibility",
    ],
    cons: [
      "Non-Z Pauli terms require basis-change gates, increasing depth",
      "More complex configuration than simpler encodings",
      "O(n²) scaling with full entanglement",
      "Lower trainability with deeper circuits",
      "Feature count limited to ~12 for practical use",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 10,
      gateCount: 14,
      singleQubitGates: 10,
      twoQubitGates: 4,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 10,
      gateCount: 52,
      singleQubitGates: 28,
      twoQubitGates: 24,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 10,
      gateCount: 200,
      singleQubitGates: 88,
      twoQubitGates: 112,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 10,
      gateCount: 784,
      singleQubitGates: 304,
      twoQubitGates: 480,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
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

  references: [
    "Havlíček, V., et al. (2019). Supervised learning with quantum-enhanced feature spaces. Nature, 567(7747), 209–212.",
    "Schuld, M. (2021). Supervised quantum machine learning models are kernel methods. arXiv:2101.11020.",
    "Sim, S., Johnson, P.D., & Aspuru-Guzik, A. (2019). Expressibility and entangling capability of parameterized quantum circuits for hybrid quantum-classical algorithms. Advanced Quantum Technologies, 2(12), 1900070.",
  ],

  relatedEncodings: ["zz-feature-map", "iqp"],
};
