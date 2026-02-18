import type { Encoding } from "./types";

export const hardwareEfficientEncoding: Encoding = {
  id: "hardware_efficient",
  slug: "hardware-efficient",
  name: "Hardware-Efficient Encoding",
  className: "HardwareEfficientEncoding",
  category: "variational",

  shortDescription:
    "NISQ-optimized encoding using native gate sets and connectivity-respecting entanglement.",

  description:
    "Hardware-efficient encoding is designed to minimize circuit depth and use only gates native to the target quantum hardware. Each layer consists of single-qubit data-encoding rotations followed by a connectivity-respecting entanglement pattern using CNOT gates. This design philosophy prioritizes practical executability on near-term quantum processors.\n\nThe encoding alternates data rotation layers (RX, RY, or RZ with feature values as angles) with entanglement layers that respect the hardware's qubit connectivity graph. Linear entanglement uses nearest-neighbor CNOTs, circular adds a wrap-around connection, and full provides all-to-all connectivity at the cost of additional SWAP operations on hardware.\n\nWhile hardware-efficient encodings are the most practical choice for current NISQ devices, they face a trainability challenge: random hardware-efficient circuits can exhibit barren plateaus. However, with careful initialization and moderate depth, they achieve a good balance between noise resilience and expressibility.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\prod_{l=1}^{\\text{reps}} \\left[ U_{\\text{ent}} \\cdot \\bigotimes_{i=0}^{n-1} R_a(x_i) \\right] |0\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 4,
    gateCount: 14,
    singleQubitGates: 8,
    twoQubitGates: 6,
    parameterCount: 8,
    isEntangling: true,
    simulability: "not_simulable",
    trainabilityEstimate: 0.8,
    notes:
      "Hardware-efficient encoding with linear entanglement, RY rotation, 2 reps. Shallow depth optimized for NISQ hardware.",
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
        "Number of repetitions of the encoding + entanglement layer.",
    },
    {
      name: "rotation",
      type: 'Literal["X", "Y", "Z"]',
      default: "Y",
      description: "Rotation axis for data-encoding gates.",
    },
    {
      name: "entanglement",
      type: 'Literal["linear", "circular", "full"]',
      default: "linear",
      description:
        "Entanglement topology. Linear: nearest-neighbor. Circular: ring. Full: all-to-all.",
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
      code: `from encoding_atlas import HardwareEfficientEncoding
import pennylane as qml
import numpy as np

enc = HardwareEfficientEncoding(n_features=4, reps=2, rotation="Y")
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Hardware-efficient encoding with PennyLane using linear entanglement.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import HardwareEfficientEncoding
import numpy as np

enc = HardwareEfficientEncoding(n_features=4, reps=2, entanglement="linear")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Hardware-efficient encoding with Qiskit, designed for NISQ hardware connectivity.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import HardwareEfficientEncoding
import numpy as np

enc = HardwareEfficientEncoding(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Hardware-efficient encoding with Cirq backend.",
    },
  ],

  useCases: [
    "NISQ device experiments requiring minimal gate depth",
    "Variational classifiers on real quantum hardware",
    "Noise-resilient encoding for near-term applications",
    "Benchmarking quantum ML on current processors",
    "Hybrid quantum-classical architectures with hardware constraints",
  ],

  prosAndCons: {
    pros: [
      "Minimal circuit depth (2 layers per rep) — highly NISQ-compatible",
      "Connectivity-respecting entanglement avoids SWAP overhead",
      "Good trainability (~0.8) with moderate depth",
      "Supports native gate sets of various hardware platforms",
      "No feature count limit — scales linearly with any dataset size",
    ],
    cons: [
      "Risk of barren plateaus with random initialization",
      "Limited expressibility compared to deeper encodings",
      "Not designed for provable quantum advantage",
      "Linear entanglement limits long-range feature correlations",
      "Full entanglement loses NISQ advantage due to SWAP overhead",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
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
      nFeatures: 4,
      nQubits: 4,
      depth: 4,
      gateCount: 14,
      singleQubitGates: 8,
      twoQubitGates: 6,
      parameterCount: 8,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 4,
      gateCount: 30,
      singleQubitGates: 16,
      twoQubitGates: 14,
      parameterCount: 16,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 4,
      gateCount: 62,
      singleQubitGates: 32,
      twoQubitGates: 30,
      parameterCount: 32,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
    bestFor: ["nisq_hardware", "native_gates", "noise_resilience"],
    avoidWhen: ["simulator_only", "quantum_advantage"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "shallow",
  },

  references: [
    "Kandala, A., et al. (2017). Hardware-efficient variational quantum eigensolver for small molecules and quantum magnets. Nature, 549(7671), 242–246.",
    "Sim, S., Johnson, P.D., & Aspuru-Guzik, A. (2019). Expressibility and entangling capability of parameterized quantum circuits for hybrid quantum-classical algorithms. Advanced Quantum Technologies, 2(12), 1900070.",
    "McClean, J.R., et al. (2018). Barren plateaus in quantum neural network training landscapes. Nature Communications, 9(1), 4812.",
  ],

  relatedEncodings: ["angle", "data-reuploading", "trainable"],
};
