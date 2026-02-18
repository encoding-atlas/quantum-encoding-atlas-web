import type { Encoding } from "./types";

export const basisEncoding: Encoding = {
  id: "basis",
  slug: "basis",
  name: "Basis Encoding",
  className: "BasisEncoding",
  category: "basis",

  shortDescription:
    "Maps binary feature vectors directly to computational basis states using X gates.",

  description:
    "Basis encoding is the most straightforward quantum encoding: each binary feature is mapped to a qubit in the computational basis. A feature value of 1 applies an X (NOT) gate to flip the qubit from |0⟩ to |1⟩, while a 0 leaves it unchanged. The result is a deterministic computational basis state with no superposition or entanglement.\n\nFor continuous data, a binarization threshold (default 0.5) converts features to binary before encoding. This means basis encoding inherently loses information about continuous-valued features, making it best suited for naturally binary or discrete data.\n\nThe encoding produces orthogonal quantum states for distinct inputs: ⟨ψ(x)|ψ(y)⟩ = δ_{x,y}. This perfect distinguishability makes it ideal for combinatorial optimization (QAOA, VQE), Grover search, and any algorithm operating on classical bit strings. Gate counts are data-dependent — all-zero inputs require no gates, while all-one inputs require n X gates.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = X^{x_0} \\otimes X^{x_1} \\otimes \\cdots \\otimes X^{x_{n-1}} |0\\rangle^{\\otimes n} = |x_0 x_1 \\cdots x_{n-1}\\rangle",

  properties: {
    nQubits: 4,
    depth: 1,
    gateCount: 4,
    singleQubitGates: 4,
    twoQubitGates: 0,
    parameterCount: 0,
    isEntangling: false,
    simulability: "simulable",
    trainabilityEstimate: 1.0,
    notes:
      "GATE COUNTS ARE WORST-CASE (max 4 X gates if all features=1). Actual gates depend on input data. Encodes binary data into computational basis states. Trivially classically simulable.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count).",
    },
    {
      name: "threshold",
      type: "float",
      default: 0.5,
      description:
        "Binarization threshold for continuous inputs. Values > threshold become 1, others 0.",
    },
  ],

  circuitStructure: [
    [
      { type: "X", qubits: [0], parameter: "x_0=1" },
      { type: "X", qubits: [1], parameter: "x_1=1" },
      { type: "X", qubits: [2], parameter: "x_2=1" },
      { type: "X", qubits: [3], parameter: "x_3=1" },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import BasisEncoding
import pennylane as qml
import numpy as np

enc = BasisEncoding(n_features=4, threshold=0.5)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([1, 0, 1, 1])
state = circuit(x)  # |1011⟩`,
      description: "Basis encoding with PennyLane, encoding binary vector [1,0,1,1].",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import BasisEncoding
import numpy as np

enc = BasisEncoding(n_features=4)
x = np.array([1, 0, 1, 1])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description: "Basis encoding with Qiskit, producing a QuantumCircuit.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import BasisEncoding
import numpy as np

enc = BasisEncoding(n_features=4)
x = np.array([1, 0, 1, 1])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Basis encoding with Cirq, applying X gates for 1-valued features.",
    },
  ],

  useCases: [
    "QAOA and VQE for combinatorial optimization",
    "Grover search with classical bit string oracles",
    "Encoding naturally binary/discrete datasets",
    "Baseline comparisons in quantum ML benchmarks",
    "Quantum error correction code initialization",
  ],

  prosAndCons: {
    pros: [
      "Simplest encoding — only X gates, no parameterized rotations",
      "Constant depth (always 1) — maximally NISQ-friendly",
      "Orthogonal states guarantee perfect distinguishability",
      "No trainable parameters — deterministic and reproducible",
      "Zero entanglement — trivially classically simulable",
    ],
    cons: [
      "Destroys continuous information via binarization",
      "No superposition or entanglement — no quantum advantage",
      "Minimal expressibility (only 2^n basis states reachable)",
      "Linear qubit scaling (one qubit per feature)",
      "Not useful for quantum kernel methods requiring rich feature maps",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 1,
      gateCount: 2,
      singleQubitGates: 2,
      twoQubitGates: 0,
      parameterCount: 0,
      isEntangling: false,
      simulability: "simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 1,
      gateCount: 4,
      singleQubitGates: 4,
      twoQubitGates: 0,
      parameterCount: 0,
      isEntangling: false,
      simulability: "simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 1,
      gateCount: 8,
      singleQubitGates: 8,
      twoQubitGates: 0,
      parameterCount: 0,
      isEntangling: false,
      simulability: "simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 1,
      gateCount: 16,
      singleQubitGates: 16,
      twoQubitGates: 0,
      parameterCount: 0,
      isEntangling: false,
      simulability: "simulable",
    },
  ],

  guideRules: {
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

  references: [
    "Nielsen, M.A. & Chuang, I.L. (2010). Quantum Computation and Quantum Information. Cambridge University Press.",
    "Schuld, M. & Petruccione, F. (2018). Supervised Learning with Quantum Computers. Springer.",
  ],

  relatedEncodings: ["angle", "amplitude"],
};
