import type { Encoding } from "./types";

// =============================================================================
// SO(2) Equivariant Feature Map
// =============================================================================

export const so2EquivariantEncoding: Encoding = {
  id: "so2_equivariant",
  slug: "so2-equivariant",
  name: "SO(2) Equivariant Feature Map",
  className: "SO2EquivariantFeatureMap",
  category: "symmetry",

  shortDescription:
    "Rigorously equivariant encoding for 2D rotational symmetry using angular momentum eigenstates.",

  description:
    "The SO(2) Equivariant Feature Map encodes 2D data points (r, θ) into quantum states that transform correctly under rotations: applying a rotation by angle φ to the input is equivalent to a unitary rotation of the quantum state. This is achieved by encoding data into angular momentum eigenstates |m⟩ with amplitudes modulated by a radial function.\n\nThe encoding converts Cartesian (x, y) coordinates to polar (r, θ), then prepares a superposition of angular momentum eigenstates m ∈ {-max_m, ..., +max_m}. The radial component c_m(r) can be Gaussian (centered at |m|) or uniform, while the angular component e^{imθ} ensures exact equivariance under SO(2) rotations.\n\nThis encoding requires exactly 2 input features (x, y coordinates) and uses ⌈log₂(2·max_m + 1)⌉ qubits. It provides the strongest theoretical guarantees among the equivariant encodings but is restricted to 2D rotation problems.",

  mathFormulation:
    "|\\psi(r, \\theta)\\rangle = \\sum_{m=-M}^{M} c_m(r) \\cdot e^{im\\theta} |m\\rangle",

  properties: {
    nQubits: 2,
    depth: 6,
    gateCount: 5,
    singleQubitGates: 5,
    twoQubitGates: 0,
    parameterCount: 0,
    isEntangling: false,
    simulability: "not_simulable",
    notes:
      "SO(2) Equivariant with max_angular_momentum=1. Requires exactly 2 features. Rigorously equivariant under 2D rotations.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: 2,
      description: "Must be exactly 2 (x, y coordinates for SO(2) symmetry).",
    },
    {
      name: "max_angular_momentum",
      type: "int",
      default: 1,
      description:
        "Maximum angular momentum quantum number M. Determines qubit count as ⌈log₂(2M+1)⌉.",
    },
    {
      name: "radial_function",
      type: 'Literal["gaussian", "uniform"]',
      default: "gaussian",
      description:
        "Radial amplitude function: gaussian centers at |m| with σ, uniform gives equal weights.",
    },
    {
      name: "radial_sigma",
      type: "float",
      default: 1.0,
      description:
        "Width parameter for Gaussian radial function. Larger σ = broader radial distribution.",
    },
  ],

  circuitStructure: [
    [
      { type: "RY", qubits: [0], parameter: "c_0(r)" },
      { type: "RY", qubits: [1], parameter: "c_1(r)" },
    ],
    [
      { type: "RZ", qubits: [0], parameter: "mθ" },
      { type: "RZ", qubits: [1], parameter: "mθ" },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import SO2EquivariantFeatureMap
import pennylane as qml
import numpy as np

enc = SO2EquivariantFeatureMap(n_features=2, max_angular_momentum=1)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([1.0, 0.5])  # (x, y) coordinates
state = circuit(x)`,
      description:
        "SO(2) equivariant encoding with PennyLane for 2D point classification.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import SO2EquivariantFeatureMap
import numpy as np

enc = SO2EquivariantFeatureMap(n_features=2, max_angular_momentum=1)
x = np.array([1.0, 0.5])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "SO(2) equivariant encoding with Qiskit for angular momentum state preparation.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import SO2EquivariantFeatureMap
import numpy as np

enc = SO2EquivariantFeatureMap(n_features=2)
x = np.array([1.0, 0.5])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "SO(2) equivariant encoding with Cirq backend.",
    },
  ],

  useCases: [
    "2D point cloud classification with rotational symmetry",
    "Image classification on rotationally symmetric data",
    "Molecular property prediction for 2D molecules",
    "Signal processing with circular symmetry",
    "Research into equivariant quantum ML",
  ],

  prosAndCons: {
    pros: [
      "Rigorous SO(2) equivariance — mathematically guaranteed",
      "Compact encoding — few qubits for angular momentum states",
      "Strong inductive bias reduces sample complexity",
      "Configurable angular momentum resolution",
      "Physically meaningful angular momentum basis",
    ],
    cons: [
      "Restricted to exactly 2 features (2D data only)",
      "Limited applicability to strictly rotational problems",
      "State preparation depth grows with angular momentum",
      "Gaussian radial function may not suit all data distributions",
      "Cannot capture non-rotational data patterns",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 6,
      gateCount: 5,
      singleQubitGates: 5,
      twoQubitGates: 0,
      parameterCount: 0,
      isEntangling: false,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
    bestFor: [
      "rotation_equivariance",
      "2d_rotation",
      "rigorous_equivariance",
    ],
    avoidWhen: ["many_features", "non_2d_data"],
    maxFeatures: 2,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: "rotation",
    requiresNFeatures: 2,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },

  references: [
    "Nguyen, Q.T., et al. (2022). Theory for equivariant quantum neural networks. PRX Quantum, 3(3), 030322.",
    "Larocca, M., et al. (2022). Group-invariant quantum machine learning. PRX Quantum, 3(3), 030341.",
    "Schatzki, L., et al. (2022). Theoretical guarantees for permutation-equivariant quantum neural networks. npj Quantum Information, 8, 130.",
  ],

  relatedEncodings: [
    "symmetry-inspired",
    "cyclic-equivariant",
    "swap-equivariant",
  ],
};

// =============================================================================
// Cyclic Equivariant Feature Map
// =============================================================================

export const cyclicEquivariantEncoding: Encoding = {
  id: "cyclic_equivariant",
  slug: "cyclic-equivariant",
  name: "Cyclic Equivariant Feature Map",
  className: "CyclicEquivariantFeatureMap",
  category: "symmetry",

  shortDescription:
    "Translationally invariant encoding preserving cyclic (Z_n) group symmetry via ring topology.",

  description:
    "The Cyclic Equivariant Feature Map constructs a circuit that is equivariant under cyclic permutations of the input features. A cyclic shift σ of the input features x → (x_1, x_2, ..., x_n, x_0) results in the same cyclic shift of the quantum state, preserving the Z_n symmetry group.\n\nEach layer applies: (1) RY rotations encoding features x_i on each qubit, (2) RZZ entangling gates in a ring topology connecting (0,1), (1,2), ..., (n-1,0) with a fixed coupling strength, and (3) RX rotations with a fixed angle (π/6) for basis mixing. The ring topology and uniform coupling ensure that the circuit commutes with cyclic permutation operators.\n\nThis encoding is ideal for data with periodic or cyclic structure, such as time series with seasonal patterns, molecular ring structures, or any problem where features have a natural circular ordering.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\prod_{l=1}^{\\text{reps}} \\left[ \\bigotimes_i RX(\\pi/6) \\cdot \\prod_{i} RZZ_{i,i+1}(\\alpha) \\cdot \\bigotimes_i RY(x_i) \\right] |0\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 6,
    gateCount: 24,
    singleQubitGates: 16,
    twoQubitGates: 8,
    parameterCount: 0,
    isEntangling: true,
    simulability: "not_simulable",
    notes:
      "Cyclic equivariant encoding with 2 reps, 4 qubits. Ring topology RZZ gates ensure Z_4 equivariance.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count and Z_n symmetry group).",
    },
    {
      name: "reps",
      type: "int",
      default: 2,
      description: "Number of layer repetitions.",
    },
    {
      name: "coupling_strength",
      type: "float",
      default: 0.7854,
      description:
        "Coupling strength α for RZZ gates (default π/4 ≈ 0.7854).",
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
      { type: "RZZ", qubits: [0, 1], parameter: "α" },
      { type: "RZZ", qubits: [1, 2], parameter: "α" },
      { type: "RZZ", qubits: [2, 3], parameter: "α" },
      { type: "RZZ", qubits: [3, 0], parameter: "α" },
    ],
    [
      { type: "RX", qubits: [0], parameter: "π/6" },
      { type: "RX", qubits: [1], parameter: "π/6" },
      { type: "RX", qubits: [2], parameter: "π/6" },
      { type: "RX", qubits: [3], parameter: "π/6" },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import CyclicEquivariantFeatureMap
import pennylane as qml
import numpy as np

enc = CyclicEquivariantFeatureMap(n_features=4, reps=2)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Cyclic equivariant encoding with PennyLane using ring topology RZZ gates.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import CyclicEquivariantFeatureMap
import numpy as np

enc = CyclicEquivariantFeatureMap(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Cyclic equivariant encoding with Qiskit showing translationally invariant structure.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import CyclicEquivariantFeatureMap
import numpy as np

enc = CyclicEquivariantFeatureMap(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Cyclic equivariant encoding with Cirq backend.",
    },
  ],

  useCases: [
    "Periodic or seasonal time series data",
    "Molecular ring structures (e.g., benzene, cyclopentane)",
    "Data with natural circular ordering",
    "Clock-like or angular measurements",
    "Problems with discrete rotational symmetry (Z_n group)",
  ],

  prosAndCons: {
    pros: [
      "Rigorous Z_n equivariance — mathematically guaranteed",
      "Ring topology provides efficient O(n) entanglement",
      "Strong inductive bias for periodic/cyclic data",
      "Constant depth per repetition (3 layers per rep)",
      "Configurable coupling strength for interaction control",
    ],
    cons: [
      "Only captures cyclic symmetry — not general permutation equivariance",
      "Ring topology limits to nearest-neighbor+wrap interactions",
      "Requires features to have meaningful cyclic ordering",
      "Fixed RX angle limits circuit flexibility",
      "Performance degrades for non-periodic data",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 6,
      gateCount: 12,
      singleQubitGates: 8,
      twoQubitGates: 4,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 6,
      gateCount: 24,
      singleQubitGates: 16,
      twoQubitGates: 8,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 6,
      gateCount: 48,
      singleQubitGates: 32,
      twoQubitGates: 16,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 6,
      gateCount: 96,
      singleQubitGates: 64,
      twoQubitGates: 32,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
    bestFor: [
      "cyclic_symmetry",
      "periodic_data",
      "rigorous_equivariance",
    ],
    avoidWhen: ["non_periodic_data"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: "cyclic",
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },

  references: [
    "Nguyen, Q.T., et al. (2022). Theory for equivariant quantum neural networks. PRX Quantum, 3(3), 030322.",
    "Larocca, M., et al. (2022). Group-invariant quantum machine learning. PRX Quantum, 3(3), 030341.",
    "Meyer, J.J., et al. (2023). Exploiting symmetry in variational quantum machine learning. PRX Quantum, 4(1), 010328.",
  ],

  relatedEncodings: [
    "symmetry-inspired",
    "so2-equivariant",
    "swap-equivariant",
  ],
};

// =============================================================================
// Swap Equivariant Feature Map
// =============================================================================

export const swapEquivariantEncoding: Encoding = {
  id: "swap_equivariant",
  slug: "swap-equivariant",
  name: "Swap Equivariant Feature Map",
  className: "SwapEquivariantFeatureMap",
  category: "symmetry",

  shortDescription:
    "Pairwise permutation-equivariant encoding using symmetric CZ gates for paired feature data.",

  description:
    "The Swap Equivariant Feature Map constructs a circuit equivariant under pairwise permutations: swapping feature pairs (x_0, x_1) ↔ (x_2, x_3) results in the corresponding swap of qubits. This is achieved using only gates that commute with SWAP operations — CZ (symmetric two-qubit gate) and Hadamard (symmetric single-qubit gate).\n\nEach layer applies: (1) RY rotations encoding features x_i on each qubit, (2) Hadamard gates for basis mixing, and (3) CZ gates on the feature pairs (0,1), (2,3), etc. The key insight is that CZ is symmetric (CZ = SWAP · CZ · SWAP), H commutes with SWAP, and RY under SWAP exchanges feature values — together ensuring pairwise swap equivariance.\n\nThis encoding requires an even number of features (paired structure) and is well-suited for problems with natural feature pair structure, such as comparing measurement pairs, stereo data processing, or problems with permutation symmetry between groups of variables.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\prod_{l=1}^{\\text{reps}} \\left[ \\prod_{k} CZ_{2k, 2k+1} \\cdot H^{\\otimes n} \\cdot \\bigotimes_i RY(x_i) \\right] |0\\rangle^{\\otimes n}",

  properties: {
    nQubits: 4,
    depth: 6,
    gateCount: 20,
    singleQubitGates: 16,
    twoQubitGates: 4,
    parameterCount: 0,
    isEntangling: true,
    simulability: "not_simulable",
    notes:
      "Swap equivariant encoding with 2 reps, 4 qubits. CZ gates on pairs (0,1) and (2,3) ensure pairwise permutation equivariance.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (must be even for paired structure).",
    },
    {
      name: "reps",
      type: "int",
      default: 2,
      description: "Number of layer repetitions.",
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
      { type: "H", qubits: [0] },
      { type: "H", qubits: [1] },
      { type: "H", qubits: [2] },
      { type: "H", qubits: [3] },
    ],
    [
      { type: "CZ", qubits: [0, 1] },
      { type: "CZ", qubits: [2, 3] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import SwapEquivariantFeatureMap
import pennylane as qml
import numpy as np

enc = SwapEquivariantFeatureMap(n_features=4, reps=2)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Swap equivariant encoding with PennyLane using CZ gates on feature pairs.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import SwapEquivariantFeatureMap
import numpy as np

enc = SwapEquivariantFeatureMap(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Swap equivariant encoding with Qiskit showing paired CZ structure.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import SwapEquivariantFeatureMap
import numpy as np

enc = SwapEquivariantFeatureMap(n_features=4, reps=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Swap equivariant encoding with Cirq backend.",
    },
  ],

  useCases: [
    "Problems with natural feature pair structure",
    "Stereo data processing (left/right measurements)",
    "Comparing measurement pairs with permutation symmetry",
    "Molecular property prediction for symmetric atom pairs",
    "Any task where swapping feature groups should not change the prediction",
  ],

  prosAndCons: {
    pros: [
      "Rigorous pairwise swap equivariance — mathematically guaranteed",
      "Efficient O(n/2) CZ gates per layer — minimal entanglement overhead",
      "Constant depth per repetition (3 layers per rep)",
      "Simple circuit structure — easy to implement on hardware",
      "CZ symmetry naturally respects SWAP operations",
    ],
    cons: [
      "Requires even number of features (hard constraint)",
      "Only captures pairwise permutation — not general permutation symmetry",
      "Limited expressibility due to sparse CZ pattern",
      "Features must have meaningful pairing structure",
      "Not applicable to problems without pair symmetry",
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
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 4,
      nQubits: 4,
      depth: 6,
      gateCount: 20,
      singleQubitGates: 16,
      twoQubitGates: 4,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 8,
      nQubits: 8,
      depth: 6,
      gateCount: 40,
      singleQubitGates: 32,
      twoQubitGates: 8,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
    {
      nFeatures: 16,
      nQubits: 16,
      depth: 6,
      gateCount: 80,
      singleQubitGates: 64,
      twoQubitGates: 16,
      parameterCount: 0,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
    bestFor: [
      "permutation_pairs",
      "paired_features",
      "rigorous_equivariance",
    ],
    avoidWhen: ["odd_features", "non_paired_data"],
    maxFeatures: null,
    simulable: false,
    requiresDataType: null,
    requiresSymmetry: "permutation_pairs",
    requiresNFeatures: null,
    requiresEvenFeatures: true,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "moderate",
  },

  references: [
    "Schatzki, L., et al. (2022). Theoretical guarantees for permutation-equivariant quantum neural networks. npj Quantum Information, 8, 130.",
    "Nguyen, Q.T., et al. (2022). Theory for equivariant quantum neural networks. PRX Quantum, 3(3), 030322.",
    "Meyer, J.J., et al. (2023). Exploiting symmetry in variational quantum machine learning. PRX Quantum, 4(1), 010328.",
  ],

  relatedEncodings: [
    "symmetry-inspired",
    "so2-equivariant",
    "cyclic-equivariant",
  ],
};
