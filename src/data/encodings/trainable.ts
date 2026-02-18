import type { Encoding } from "./types";

export const trainableEncoding: Encoding = {
  id: "trainable",
  slug: "trainable",
  name: "Trainable Encoding",
  className: "TrainableEncoding",
  category: "variational",

  shortDescription:
    "Alternates data-dependent and trainable rotation layers for task-specific, optimizable encoding.",

  description:
    "Trainable encoding interleaves data-dependent rotation gates with trainable (learnable) rotation gates, creating an encoding that can be optimized for specific downstream tasks. Each layer applies a data rotation R_d(x_i) followed by a trainable rotation R_t(θ_i), where θ_i are parameters learned through gradient-based optimization.\n\nThis architecture bridges the gap between fixed feature maps and fully parameterized quantum neural networks. The trainable parameters allow the encoding to adapt its feature representation to the specific classification or regression task, potentially discovering more effective data embeddings than hand-designed feature maps.\n\nMultiple parameter initialization strategies are supported: Xavier, He, zeros, random, and small_random. The entanglement structure (linear, circular, full, or none) is applied after each data-trainable pair. The trainable parameters add expressibility beyond what data-dependent gates alone provide, but require an optimization budget to train.",

  mathFormulation:
    "|\\psi(\\mathbf{x}, \\boldsymbol{\\theta})\\rangle = \\prod_{l=1}^{L} \\left[ U_{\\text{ent}} \\cdot \\bigotimes_i R_t(\\theta_{l,i}) \\cdot R_d(x_i) \\right] |0\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 6,
    gateCount: 22,
    singleQubitGates: 16,
    twoQubitGates: 6,
    parameterCount: 8,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.79,
    notes:
      "Trainable encoding with 2 layers, linear entanglement. 8 trainable parameters (n_layers × n_features).",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count).",
    },
    {
      name: "n_layers",
      type: "int",
      default: 2,
      description: "Number of data + trainable layer pairs.",
    },
    {
      name: "data_rotation",
      type: 'Literal["X", "Y", "Z"]',
      default: "Y",
      description: "Rotation axis for data-encoding gates.",
    },
    {
      name: "trainable_rotation",
      type: 'Literal["X", "Y", "Z"]',
      default: "Y",
      description: "Rotation axis for trainable parameter gates.",
    },
    {
      name: "entanglement",
      type: 'Literal["linear", "circular", "full", "none"]',
      default: "linear",
      description: "Entanglement topology between layers.",
    },
    {
      name: "initialization",
      type: 'Literal["xavier", "he", "zeros", "random", "small_random"]',
      default: "xavier",
      description: "Initialization strategy for trainable parameters.",
    },
    {
      name: "seed",
      type: "int | None",
      default: null,
      description: "Random seed for reproducible parameter initialization.",
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
      { type: "RY", qubits: [0], parameter: "θ_0" },
      { type: "RY", qubits: [1], parameter: "θ_1" },
      { type: "RY", qubits: [2], parameter: "θ_2" },
      { type: "RY", qubits: [3], parameter: "θ_3" },
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
      code: `from encoding_atlas import TrainableEncoding
import pennylane as qml
import numpy as np

enc = TrainableEncoding(n_features=4, n_layers=2, initialization="xavier")
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Trainable encoding with PennyLane using Xavier initialization.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import TrainableEncoding
import numpy as np

enc = TrainableEncoding(n_features=4, n_layers=2, entanglement="linear")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Trainable encoding with Qiskit showing data and trainable rotation layers.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import TrainableEncoding
import numpy as np

enc = TrainableEncoding(n_features=4, n_layers=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Trainable encoding with Cirq backend.",
    },
  ],

  useCases: [
    "Task-specific quantum feature map optimization",
    "Quantum neural networks (QNNs) with learnable encoding",
    "Transfer learning in quantum ML (pre-train encoding, fine-tune classifier)",
    "Encoding optimization for specific kernel alignment",
    "Research into optimal encoding strategies",
  ],

  prosAndCons: {
    pros: [
      "Adapts encoding to specific tasks through trainable parameters",
      "Multiple initialization strategies for different optimization landscapes",
      "Good trainability with moderate layer count",
      "Flexible entanglement topologies",
      "Bridges fixed feature maps and fully variational circuits",
    ],
    cons: [
      "Requires optimization budget to train parameters",
      "Risk of overfitting with too many trainable parameters",
      "Must opt in explicitly (requires_trainable=true in guide)",
      "Added circuit complexity from dual rotation layers",
      "Barren plateau risk increases with layer count >8",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 6,
      gateCount: 10,
      singleQubitGates: 8,
      twoQubitGates: 2,
      parameterCount: 4,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 6,
      gateCount: 22,
      singleQubitGates: 16,
      twoQubitGates: 6,
      parameterCount: 8,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 6,
      gateCount: 46,
      singleQubitGates: 32,
      twoQubitGates: 14,
      parameterCount: 16,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 6,
      gateCount: 94,
      singleQubitGates: 64,
      twoQubitGates: 30,
      parameterCount: 32,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
    bestFor: [
      "task_specific",
      "optimization",
      "trainability",
      "qnn",
    ],
    avoidWhen: ["no_optimization_budget", "simplicity"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: true,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },

  references: [
    "Benedetti, M., et al. (2019). Parameterized quantum circuits as machine learning models. Quantum Science and Technology, 4(4), 043001.",
    "Mitarai, K., et al. (2018). Quantum circuit learning. Physical Review A, 98(3), 032309.",
    "Schuld, M. & Killoran, N. (2019). Quantum Machine Learning in Feature Hilbert Spaces. Physical Review Letters, 122(4), 040504.",
  ],

  relatedEncodings: ["data-reuploading", "hardware-efficient", "angle"],
};
