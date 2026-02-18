import type { Encoding } from "./types";

export const zzFeatureMapEncoding: Encoding = {
  id: "zz_feature_map",
  slug: "zz-feature-map",
  name: "ZZ Feature Map",
  className: "ZZFeatureMap",
  category: "entangling",

  shortDescription:
    "Qiskit-standard entangling feature map with Hadamard, phase, and ZZ interaction layers.",

  description:
    "The ZZ Feature Map is a widely-used entangling encoding that follows the Qiskit convention for quantum feature maps. Each layer applies Hadamard gates to create superposition, single-qubit phase gates P(2x_i) for individual feature encoding, and two-qubit ZZ interactions with a distinctive (π−x_i)(π−x_j) phase convention.\n\nThe ZZ interaction is decomposed as CNOT · RZ(2(π−x_i)(π−x_j)) · CNOT, creating pairwise feature correlations through entanglement. This phase convention (different from IQP's direct x_i·x_j product) ensures non-trivial interaction even when individual features are small, as the (π−x) shift moves the operating point away from zero.\n\nThe ZZ Feature Map is the standard benchmark encoding in Qiskit's quantum ML ecosystem and is commonly used for quantum kernel methods. Its quantum kernel k(x,x') = |⟨ψ(x)|ψ(x')⟩|² has been shown to achieve quantum advantage on structured learning problems.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\left[ \\prod_{(i,j)} ZZ\\big(2(\\pi - x_i)(\\pi - x_j)\\big) \\cdot \\prod_i P(2x_i) \\cdot H^{\\otimes n} \\right]^{\\text{reps}} |0\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 22,
    gateCount: 52,
    singleQubitGates: 28,
    twoQubitGates: 24,
    parameterCount: 20,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.65,
    notes:
      "ZZ Feature Map with full entanglement, 2 reps. Qiskit-compatible (π−x) phase convention. Creates 6 ZZ interactions per layer.",
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
      name: "entanglement",
      type: 'Literal["full", "linear", "circular"]',
      default: "full",
      description:
        "Entanglement topology for ZZ interactions.",
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
      { type: "P", qubits: [0], parameter: "2x_0" },
      { type: "P", qubits: [1], parameter: "2x_1" },
      { type: "P", qubits: [2], parameter: "2x_2" },
      { type: "P", qubits: [3], parameter: "2x_3" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
      { type: "P", qubits: [1], parameter: "2(π−x_0)(π−x_1)" },
      { type: "CNOT", qubits: [0, 1] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import ZZFeatureMap
import pennylane as qml
import numpy as np

enc = ZZFeatureMap(n_features=4, reps=2, entanglement="full")
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "ZZ Feature Map with PennyLane using full entanglement and 2 reps.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import ZZFeatureMap
import numpy as np

enc = ZZFeatureMap(n_features=4, reps=2, entanglement="full")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "ZZ Feature Map with Qiskit, following native Qiskit conventions.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import ZZFeatureMap
import numpy as np

enc = ZZFeatureMap(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "ZZ Feature Map with Cirq backend.",
    },
  ],

  useCases: [
    "Quantum kernel methods and QSVM classifiers",
    "Standard benchmark encoding for quantum ML research",
    "Variational quantum classifiers with balanced expressibility",
    "Quantum advantage experiments on structured data",
    "Feature interaction modeling with ZZ correlations",
  ],

  prosAndCons: {
    pros: [
      "Qiskit-standard encoding with extensive ecosystem support",
      "Non-trivial (π−x) phase convention avoids zero-interaction regions",
      "Proven quantum advantage on certain learning problems",
      "Flexible entanglement topologies",
      "Well-balanced between expressibility and trainability",
    ],
    cons: [
      "O(n²) CNOT gates with full entanglement",
      "Higher circuit depth than IQP due to phase gate structure",
      "Feature count limited to ~12 for practical use",
      "Sensitive to noise on current hardware",
      "Trainability decreases with repetitions",
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
      parameterCount: 6,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 22,
      gateCount: 52,
      singleQubitGates: 28,
      twoQubitGates: 24,
      parameterCount: 20,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 46,
      gateCount: 200,
      singleQubitGates: 88,
      twoQubitGates: 112,
      parameterCount: 72,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 94,
      gateCount: 784,
      singleQubitGates: 304,
      twoQubitGates: 480,
      parameterCount: 272,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
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

  references: [
    "Havlíček, V., et al. (2019). Supervised learning with quantum-enhanced feature spaces. Nature, 567(7747), 209–212.",
    "Schuld, M. (2021). Supervised quantum machine learning models are kernel methods. arXiv:2101.11020.",
    "Huang, H.-Y., et al. (2021). Power of data in quantum machine learning. Nature Communications, 12, 2631.",
  ],

  relatedEncodings: ["iqp", "pauli-feature-map"],
};
