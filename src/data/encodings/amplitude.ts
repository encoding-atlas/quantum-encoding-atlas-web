import type { Encoding } from "./types";

export const amplitudeEncoding: Encoding = {
  id: "amplitude",
  slug: "amplitude",
  name: "Amplitude Encoding",
  className: "AmplitudeEncoding",
  category: "amplitude-based",

  shortDescription:
    "Encodes normalized feature vectors into quantum state amplitudes, achieving exponential compression.",

  description:
    "Amplitude encoding maps an n-dimensional classical feature vector into the amplitudes of a quantum state using only ⌈log₂(n)⌉ qubits. This provides exponential compression of classical data into the quantum Hilbert space — for example, 1024 features can be encoded into just 10 qubits.\n\nThe trade-off is circuit depth: preparing an arbitrary quantum state requires O(2^n) gates via the Möttönen decomposition (uniformly controlled RY and RZ rotations with CNOT ladders). This makes amplitude encoding impractical on current NISQ hardware for large feature counts, though it is theoretically optimal for qubit efficiency.\n\nA critical subtlety is normalization: the input vector must have unit L2 norm, so the encoding discards absolute magnitude information. Vectors [1, 2, 3] and [10, 20, 30] map to the same quantum state. Non-power-of-2 feature counts are zero-padded to the next power of 2.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\sum_{i=0}^{2^n-1} \\frac{x_i}{\\|\\mathbf{x}\\|} |i\\rangle",

  properties: {
    nQubits: 2,
    depth: 4,
    gateCount: 6,
    singleQubitGates: 4,
    twoQubitGates: 2,
    parameterCount: 4,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.5,
    notes:
      "Exponential compression: 4 features in 2 qubits. Circuit depth O(2^n) limits NISQ applicability.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description:
        "Number of input features. Qubit count is ⌈log₂(n_features)⌉.",
    },
    {
      name: "normalize",
      type: "bool",
      default: true,
      description:
        "Whether to automatically L2-normalize the input. If False, input must already have unit norm.",
    },
  ],

  circuitStructure: [
    [
      { type: "RY", qubits: [0], parameter: "θ_0" },
      { type: "RY", qubits: [1], parameter: "θ_1" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
    ],
    [
      { type: "RY", qubits: [1], parameter: "θ_2" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import AmplitudeEncoding
import pennylane as qml
import numpy as np

enc = AmplitudeEncoding(n_features=4)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.5, 0.5, 0.5, 0.5])
state = circuit(x)`,
      description:
        "Amplitude encoding with PennyLane. 4 features encoded into 2 qubits.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import AmplitudeEncoding
import numpy as np

enc = AmplitudeEncoding(n_features=4)
x = np.array([0.5, 0.5, 0.5, 0.5])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Amplitude encoding with Qiskit using QuantumCircuit.initialize().",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import AmplitudeEncoding
import numpy as np

enc = AmplitudeEncoding(n_features=4)
x = np.array([0.5, 0.5, 0.5, 0.5])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Amplitude encoding with Cirq via full unitary decomposition.",
    },
  ],

  useCases: [
    "Encoding high-dimensional data with minimal qubit count",
    "Quantum linear solvers (HHL algorithm) requiring state preparation",
    "Quantum kernel methods (QSVM) with amplitude-based kernels",
    "Quantum PCA and dimensionality reduction",
    "Fault-tolerant quantum computing where deep circuits are acceptable",
  ],

  prosAndCons: {
    pros: [
      "Exponential compression: n features in ⌈log₂(n)⌉ qubits",
      "Maximal expressibility — any quantum state is reachable",
      "Ideal for high-dimensional datasets (e.g., images, genomics)",
      "Theoretically optimal qubit efficiency",
    ],
    cons: [
      "Exponential circuit depth O(2^n) — impractical on NISQ hardware",
      "Low trainability (~0.5) due to deep circuits and barren plateaus",
      "L2 normalization discards magnitude information",
      "Zero-padding wastes Hilbert space for non-power-of-2 features",
      "Sensitive to noise accumulation in deep circuits",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 1,
      depth: 2,
      gateCount: 2,
      singleQubitGates: 2,
      twoQubitGates: 0,
      parameterCount: 2,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 2,
      depth: 4,
      gateCount: 6,
      singleQubitGates: 4,
      twoQubitGates: 2,
      parameterCount: 4,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 3,
      depth: 8,
      gateCount: 14,
      singleQubitGates: 8,
      twoQubitGates: 6,
      parameterCount: 8,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 4,
      depth: 16,
      gateCount: 30,
      singleQubitGates: 16,
      twoQubitGates: 14,
      parameterCount: 16,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
    bestFor: ["many_features", "compression", "exponential_compression"],
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

  references: [
    "Möttönen, M., et al. (2005). Transformation of quantum states using uniformly controlled rotations. Quantum Information & Computation, 5(6), 467–473.",
    "Shende, V.V., Bullock, S.S., & Markov, I.L. (2006). Synthesis of quantum-logic circuits. IEEE Transactions on Computer-Aided Design, 25(6), 1000–1010.",
    "Schuld, M. & Petruccione, F. (2018). Supervised Learning with Quantum Computers. Springer.",
  ],

  relatedEncodings: ["basis", "angle"],
};
