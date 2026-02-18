import type { Encoding } from "./types";

export const iqpEncoding: Encoding = {
  id: "iqp",
  slug: "iqp",
  name: "IQP Encoding",
  className: "IQPEncoding",
  category: "entangling",

  shortDescription:
    "Instantaneous Quantum Polynomial circuits with provable classical hardness for sampling.",

  description:
    "IQP (Instantaneous Quantum Polynomial) encoding creates quantum states through cycles of Hadamard gates, single-qubit RZ phase gates, and two-qubit ZZ interaction gates. The circuit structure — diagonal unitaries sandwiched between Hadamard layers — is provably hard to simulate classically under standard complexity-theoretic assumptions.\n\nEach layer applies three stages: (1) Hadamard gates create equal superposition, (2) single-qubit RZ(2x_i) gates encode individual features as phases, and (3) ZZ(x_i · x_j) gates encode pairwise feature interactions. The resulting state has equal amplitudes across all basis states but feature-dependent phases, making the quantum kernel k(x,x') = |⟨ψ(x)|ψ(x')⟩|² classically intractable to compute.\n\nThe entanglement topology (full, linear, or circular) controls the trade-off between expressibility and circuit cost. Full entanglement captures all O(n²) pairwise interactions but requires O(n²) CNOT gates per layer, while linear entanglement uses only O(n) gates.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\left[ H^{\\otimes n} \\cdot \\prod_{(i,j)} ZZ(x_i x_j) \\cdot \\prod_i RZ(2x_i) \\right]^{\\text{reps}} |+\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 6,
    gateCount: 52,
    singleQubitGates: 28,
    twoQubitGates: 24,
    parameterCount: 20,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.7,
    notes:
      "IQP encoding with full entanglement. Provably hard to simulate classically under standard assumptions.",
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
      description:
        "Number of repetitions of the IQP layer. More reps increase expressibility but risk barren plateaus.",
    },
    {
      name: "entanglement",
      type: 'Literal["full", "linear", "circular"]',
      default: "full",
      description:
        "Entanglement topology. Full: all pairs O(n²). Linear: nearest-neighbor O(n). Circular: ring O(n).",
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
      { type: "RZ", qubits: [1], parameter: "x_0·x_1" },
      { type: "CNOT", qubits: [0, 1] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import IQPEncoding
import pennylane as qml
import numpy as np

enc = IQPEncoding(n_features=4, reps=2, entanglement="full")
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "IQP encoding with PennyLane using full entanglement and 2 reps.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import IQPEncoding
import numpy as np

enc = IQPEncoding(n_features=4, reps=2, entanglement="full")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description: "IQP encoding with Qiskit, returning a QuantumCircuit.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import IQPEncoding
import numpy as np

enc = IQPEncoding(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "IQP encoding with Cirq, printing the circuit diagram.",
    },
  ],

  useCases: [
    "Quantum kernel methods (QSVM) with provable classical hardness",
    "Quantum advantage benchmarking and demonstrations",
    "Feature interaction modeling (captures pairwise x_i·x_j terms)",
    "Variational quantum classifiers requiring expressive feature maps",
    "Quantum reservoir computing",
  ],

  prosAndCons: {
    pros: [
      "Provably hard to simulate classically (polynomial hierarchy collapse argument)",
      "High expressibility with entangled, phase-modulated states",
      "Captures both individual and pairwise feature interactions",
      "Flexible entanglement topologies (full, linear, circular)",
      "Well-studied theoretical properties",
    ],
    cons: [
      "Full entanglement requires O(n²) CNOT gates per layer",
      "Barren plateaus risk increases with repetitions",
      "Not NISQ-friendly for large feature counts with full entanglement",
      "Feature count limited to ~12 for practical use",
      "Phase-only encoding — all basis states have equal amplitude",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 6,
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
      depth: 6,
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
      depth: 6,
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
      depth: 6,
      gateCount: 784,
      singleQubitGates: 304,
      twoQubitGates: 480,
      parameterCount: 272,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
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

  references: [
    "Havlíček, V., et al. (2019). Supervised learning with quantum-enhanced feature spaces. Nature, 567(7747), 209–212.",
    "Bremner, M.J., Montanaro, A., & Shepherd, D.J. (2016). Average-case complexity versus approximate simulation of commuting quantum computations. Physical Review Letters, 117(8), 080501.",
    "Shepherd, D. & Bremner, M.J. (2009). Temporally unstructured quantum computation. Proceedings of the Royal Society A, 465(2105), 1413–1439.",
  ],

  relatedEncodings: ["zz-feature-map", "pauli-feature-map"],
};
