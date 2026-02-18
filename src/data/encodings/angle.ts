import type { Encoding } from "./types";

export const angleEncoding: Encoding = {
  id: "angle",
  slug: "angle",
  name: "Angle Encoding",
  className: "AngleEncoding",
  category: "angle-based",

  shortDescription:
    "Maps each classical feature to a single-qubit rotation gate angle.",

  description:
    "Angle encoding is the simplest and most widely used quantum encoding strategy. Each classical feature value is mapped to the rotation angle of a single-qubit gate (RX, RY, or RZ), creating a product state with no entanglement between qubits. The resulting quantum state is a tensor product of independently rotated qubits.\n\nBecause angle encoding produces product states, it is classically simulable in O(n) time and cannot provide quantum advantage on its own. However, it serves as an excellent building block when combined with entangling layers in variational circuits, and its shallow depth and high noise resilience make it ideal for near-term NISQ hardware.\n\nThe encoding maps each feature x_i to a rotation R_a(x_i) on qubit i, where a is the chosen rotation axis. Features should be scaled to [0, 2π] or [-π, π] for optimal coverage of the Bloch sphere.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\bigotimes_{i=0}^{n-1} R_a(x_i)|0\\rangle",

  properties: {
    nQubits: 4,
    depth: 1,
    gateCount: 4,
    singleQubitGates: 4,
    twoQubitGates: 0,
    parameterCount: 4,
    isEntangling: false,
    simulability: "simulable",
    trainabilityEstimate: 0.9,
    notes:
      "Rotation axis: Y. Creates product states only (no entanglement). Classically simulable with O(n) complexity.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count).",
    },
    {
      name: "rotation",
      type: 'Literal["X", "Y", "Z"]',
      default: "Y",
      description:
        "Rotation axis for the encoding gates. RY (default) creates real-valued superpositions.",
    },
    {
      name: "reps",
      type: "int",
      default: 1,
      description:
        "Number of repetitions of the encoding layer. Higher reps increase depth linearly.",
    },
  ],

  circuitStructure: [
    [
      { type: "RY", qubits: [0], parameter: "x_0" },
      { type: "RY", qubits: [1], parameter: "x_1" },
      { type: "RY", qubits: [2], parameter: "x_2" },
      { type: "RY", qubits: [3], parameter: "x_3" },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import AngleEncoding
import pennylane as qml
import numpy as np

enc = AngleEncoding(n_features=4, rotation="Y")
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description: "Angle encoding with PennyLane using RY rotations on 4 qubits.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import AngleEncoding
import numpy as np

enc = AngleEncoding(n_features=4, rotation="Y")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description: "Angle encoding with Qiskit, returning a QuantumCircuit.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import AngleEncoding
import numpy as np

enc = AngleEncoding(n_features=4, rotation="Y")
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Angle encoding with Cirq, returning a cirq.Circuit.",
    },
  ],

  useCases: [
    "Baseline encoding for benchmarking quantum ML models",
    "Building block in variational quantum classifiers (VQC)",
    "NISQ-friendly experiments requiring minimal gate depth",
    "Hybrid classical-quantum architectures where entanglement is added separately",
    "Quick prototyping of quantum feature maps",
  ],

  prosAndCons: {
    pros: [
      "Simplest possible encoding — one gate per feature",
      "Constant depth (O(1) per repetition), highly NISQ-compatible",
      "High trainability (~0.9) with no barren plateau risk",
      "High noise resilience due to shallow circuits",
      "Supports all three rotation axes (RX, RY, RZ)",
    ],
    cons: [
      "No entanglement — produces only product states",
      "Classically simulable, cannot provide quantum advantage alone",
      "Low expressibility (limited to product state manifold)",
      "Linear qubit scaling (one qubit per feature)",
      "Periodic encoding can cause information loss without proper feature scaling",
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
      parameterCount: 2,
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
      parameterCount: 4,
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
      parameterCount: 8,
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
      parameterCount: 16,
      isEntangling: false,
      simulability: "simulable",
    },
  ],

  guideRules: {
    bestFor: ["speed", "simplicity", "product_states", "nisq_hardware"],
    avoidWhen: [
      "need_entanglement",
      "quantum_advantage",
      "feature_interactions",
    ],
    maxFeatures: null,
    simulable: true,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "constant",
  },

  references: [
    "Schuld, M., Sweke, R., & Meyer, J.K. (2021). Effect of data encoding on the expressive power of variational quantum machine learning models. Physical Review A, 103(3), 032430.",
    "Stoudenmire, E. & Schwab, D.J. (2016). Supervised Learning with Tensor Networks. NeurIPS.",
    "Havlíček, V., et al. (2019). Supervised learning with quantum-enhanced feature spaces. Nature, 567(7747), 209–212.",
  ],

  relatedEncodings: ["higher-order-angle", "hardware-efficient", "data-reuploading"],
};
