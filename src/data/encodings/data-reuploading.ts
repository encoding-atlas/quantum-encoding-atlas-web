import type { Encoding } from "./types";

export const dataReuploadingEncoding: Encoding = {
  id: "data_reuploading",
  slug: "data-reuploading",
  name: "Data Reuploading",
  className: "DataReuploading",
  category: "variational",

  shortDescription:
    "Re-encodes classical data multiple times across layers, achieving universal function approximation.",

  description:
    "Data reuploading is a powerful variational encoding strategy that re-encodes the classical input data at every layer of the quantum circuit, interleaved with entangling gates. This repeated injection of data, analogous to the universal approximation theorem for classical neural networks, provably enables approximation of any continuous function.\n\nEach layer applies RY rotations with feature-dependent angles to encode data, followed by a CNOT ladder for entanglement. Features are cyclically mapped to qubits: feature x_i is encoded on qubit (i mod n_qubits), so all features are represented even when n_qubits < n_features. The Fourier expressivity of the circuit is f(x) = Σ_k c_k exp(ikx) for k ∈ {-L, ..., L}, where L is the number of layers.\n\nThe encoding excels at tasks requiring high expressibility and is particularly well-suited for time series data due to its sequential, recurrent-like structure. However, the deep circuits can suffer from barren plateaus and noise accumulation on current NISQ hardware.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\prod_{l=1}^{L} \\left[ U_{\\text{ent}} \\cdot \\prod_{i} R_Y(x_{i \\bmod n}) \\right] |0\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 12,
    gateCount: 21,
    singleQubitGates: 12,
    twoQubitGates: 9,
    parameterCount: 12,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.75,
    notes:
      "Data reuploading with 3 layers, 4 qubits. Features re-encoded at each layer with CNOT ladder entanglement.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features to encode.",
    },
    {
      name: "n_layers",
      type: "int",
      default: 3,
      description:
        "Number of data reuploading layers. More layers increase Fourier expressivity but deepen the circuit.",
    },
    {
      name: "n_qubits",
      type: "int | None",
      default: null,
      description:
        "Number of qubits. Defaults to n_features. Can be set lower for qubit-efficient encoding with cyclic feature mapping.",
    },
  ],

  circuitStructure: [
    [
      { type: "RY", qubits: [0], parameter: "x_0" },
      { type: "RY", qubits: [1], parameter: "x_1" },
      { type: "RY", qubits: [2], parameter: "x_2" },
      { type: "RY", qubits: [3], parameter: "x_3" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
      { type: "CNOT", qubits: [1, 2] },
      { type: "CNOT", qubits: [2, 3] },
    ],
    [
      { type: "RY", qubits: [0], parameter: "x_0" },
      { type: "RY", qubits: [1], parameter: "x_1" },
      { type: "RY", qubits: [2], parameter: "x_2" },
      { type: "RY", qubits: [3], parameter: "x_3" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
      { type: "CNOT", qubits: [1, 2] },
      { type: "CNOT", qubits: [2, 3] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import DataReuploading
import pennylane as qml
import numpy as np

enc = DataReuploading(n_features=4, n_layers=3)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Data reuploading with PennyLane using 3 layers and 4 features.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import DataReuploading
import numpy as np

enc = DataReuploading(n_features=4, n_layers=3)
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description: "Data reuploading with Qiskit, showing the layered circuit structure.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import DataReuploading
import numpy as np

enc = DataReuploading(n_features=4, n_layers=3)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Data reuploading with Cirq backend.",
    },
  ],

  useCases: [
    "Universal function approximation in quantum ML",
    "Time series classification and forecasting",
    "Tasks requiring high expressibility and rich Fourier spectra",
    "Variational quantum eigensolvers with data-dependent ansätze",
    "Quantum neural networks (QNNs) with data-driven layers",
  ],

  prosAndCons: {
    pros: [
      "Universal approximation capability (proven for single-qubit case)",
      "Fourier expressivity grows linearly with number of layers",
      "Cyclic feature mapping enables qubit-efficient encoding",
      "Natural recurrent structure suits sequential data",
      "Good trainability for moderate layer counts",
    ],
    cons: [
      "Deep circuits — depth grows with layers and qubit count",
      "Barren plateau risk for many layers (>10 triggers warning)",
      "Not NISQ-friendly for large feature counts",
      "Feature count recommended ≤8 for practical use",
      "Noise accumulation in deep circuits degrades fidelity",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 6,
      gateCount: 9,
      singleQubitGates: 6,
      twoQubitGates: 3,
      parameterCount: 6,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 12,
      gateCount: 21,
      singleQubitGates: 12,
      twoQubitGates: 9,
      parameterCount: 12,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 24,
      gateCount: 45,
      singleQubitGates: 24,
      twoQubitGates: 21,
      parameterCount: 24,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 48,
      gateCount: 93,
      singleQubitGates: 48,
      twoQubitGates: 45,
      parameterCount: 48,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
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

  references: [
    "Pérez-Salinas, A., et al. (2020). Data re-uploading for a universal quantum classifier. Quantum, 4, 226.",
    "Schuld, M., Sweke, R., & Meyer, J.K. (2021). Effect of data encoding on the expressive power of variational quantum machine learning models. Physical Review A, 103(3), 032430.",
    "Vidal, G. & Dawson, C.M. (2004). Universal quantum circuit for two-qubit transformations. Physical Review A, 69(1), 010301.",
  ],

  relatedEncodings: ["angle", "hardware-efficient", "trainable"],
};
