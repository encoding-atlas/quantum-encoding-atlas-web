import type { Encoding } from "./types";

export const hamiltonianEncoding: Encoding = {
  id: "hamiltonian",
  slug: "hamiltonian",
  name: "Hamiltonian Encoding",
  className: "HamiltonianEncoding",
  category: "physics-inspired",

  shortDescription:
    "Encodes data via Hamiltonian time evolution with configurable interaction types (IQP, XY, Heisenberg).",

  description:
    "Hamiltonian encoding maps classical data into quantum states through simulated time evolution under a data-dependent Hamiltonian. The circuit implements U(t) = exp(-iHt) via Trotterized time steps, where the Hamiltonian H incorporates the classical features as coupling strengths.\n\nFour Hamiltonian types are supported: (1) IQP — diagonal Z⊗Z interactions with (π−x_i)(π−x_j) couplings, (2) XY — transverse X⊗X + Y⊗Y interactions modeling quantum spin chains, (3) Heisenberg — full X⊗X + Y⊗Y + Z⊗Z interactions capturing isotropic spin coupling, and (4) Pauli-Z — simplified Z-only single-qubit terms. Each type has different gate decompositions and resource requirements.\n\nThis encoding is particularly well-suited for physics simulation tasks where the data naturally maps to Hamiltonian parameters (e.g., molecular energies, lattice couplings). The Heisenberg type requires the most gates (6 CNOTs per pair per rep) but provides the richest interaction structure.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = e^{-iH(\\mathbf{x})t} |+\\rangle^{\\otimes n}, \\quad H = \\sum_i x_i Z_i + \\sum_{(i,j)} f(x_i, x_j) \\vec{\\sigma}_i \\cdot \\vec{\\sigma}_j",

  properties: {
    nQubits: 4,
    depth: 25,
    gateCount: 52,
    singleQubitGates: 28,
    twoQubitGates: 24,
    parameterCount: 20,
    isEntangling: true,
    simulability: "not_simulable",
    notes:
      "Hamiltonian encoding with IQP-type interactions, full entanglement, 2 reps. Suitable for physics-inspired feature maps.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count).",
    },
    {
      name: "hamiltonian_type",
      type: 'Literal["iqp", "xy", "heisenberg", "pauli_z"]',
      default: "iqp",
      description:
        "Type of Hamiltonian interaction: iqp (ZZ), xy (XX+YY), heisenberg (XX+YY+ZZ), or pauli_z (Z only).",
    },
    {
      name: "evolution_time",
      type: "float",
      default: 1.0,
      description: "Total evolution time parameter t.",
    },
    {
      name: "reps",
      type: "int",
      default: 2,
      description: "Number of Trotter steps (repetitions).",
    },
    {
      name: "entanglement",
      type: 'Literal["full", "linear", "circular"]',
      default: "full",
      description: "Entanglement topology for qubit interactions.",
    },
    {
      name: "insert_barriers",
      type: "bool",
      default: true,
      description: "Whether to insert barrier markers between layers.",
    },
    {
      name: "max_pairs",
      type: "int | None",
      default: null,
      description: "Maximum number of qubit pairs for interactions.",
    },
    {
      name: "include_single_qubit_terms",
      type: "bool",
      default: true,
      description: "Whether to include single-qubit RZ terms in the Hamiltonian.",
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
      { type: "RZ", qubits: [0], parameter: "x_0" },
      { type: "RZ", qubits: [1], parameter: "x_1" },
      { type: "RZ", qubits: [2], parameter: "x_2" },
      { type: "RZ", qubits: [3], parameter: "x_3" },
    ],
    [
      { type: "CNOT", qubits: [0, 1] },
      { type: "RZ", qubits: [1], parameter: "(π−x_0)(π−x_1)" },
      { type: "CNOT", qubits: [0, 1] },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import HamiltonianEncoding
import pennylane as qml
import numpy as np

enc = HamiltonianEncoding(n_features=4, hamiltonian_type="iqp", reps=2)
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Hamiltonian encoding with PennyLane using IQP-type interactions.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import HamiltonianEncoding
import numpy as np

enc = HamiltonianEncoding(n_features=4, hamiltonian_type="heisenberg")
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Hamiltonian encoding with Qiskit using Heisenberg-type interactions.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import HamiltonianEncoding
import numpy as np

enc = HamiltonianEncoding(n_features=4, hamiltonian_type="xy")
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Hamiltonian encoding with Cirq using XY-type interactions.",
    },
  ],

  useCases: [
    "Physics simulation tasks (molecular Hamiltonians, lattice models)",
    "Encoding data with natural physical interaction structure",
    "Quantum chemistry feature maps",
    "Time evolution-based quantum ML",
    "Research into physics-inspired quantum kernels",
  ],

  prosAndCons: {
    pros: [
      "Physically motivated — natural fit for physics simulation data",
      "Four Hamiltonian types for different interaction structures",
      "High expressibility from entangling Hamiltonian evolution",
      "Trotterized evolution provides systematic approximation control",
      "Configurable single-qubit and two-qubit terms",
    ],
    cons: [
      "Deep circuits, especially for Heisenberg type (6 CNOTs per pair per rep)",
      "O(n²) gate scaling with full entanglement",
      "Not NISQ-friendly for large feature counts",
      "Critical point at x = π causes zero interaction angles",
      "Higher noise sensitivity due to circuit depth",
    ],
  },

  resourceProfiles: [
    {
      nFeatures: 2,
      nQubits: 2,
      depth: 9,
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
      depth: 25,
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
      depth: 61,
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
      depth: 121,
      gateCount: 784,
      singleQubitGates: 304,
      twoQubitGates: 480,
      parameterCount: 272,
      isEntangling: true,
      simulability: "not_simulable",
    },
  ],

  guideRules: {
    bestFor: [
      "physics_simulation",
      "time_evolution",
      "expressibility",
    ],
    avoidWhen: ["speed", "simplicity", "nisq_hardware"],
    maxFeatures: null,
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
    "Suzuki, M. (1991). General theory of fractal path integrals with applications to many-body theories and statistical physics. Journal of Mathematical Physics, 32(2), 400–407.",
    "Lloyd, S. (1996). Universal quantum simulators. Science, 273(5278), 1073–1078.",
    "Childs, A.M. & Wiebe, N. (2012). Hamiltonian simulation using linear combinations of unitary operations. Quantum Information & Computation, 12(11-12), 901–924.",
  ],

  relatedEncodings: ["iqp", "zz-feature-map", "qaoa"],
};
