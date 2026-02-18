import type { Encoding } from "./types";

export const higherOrderAngleEncoding: Encoding = {
  id: "higher_order_angle",
  slug: "higher-order-angle",
  name: "Higher-Order Angle Encoding",
  className: "HigherOrderAngleEncoding",
  category: "angle-based",

  shortDescription:
    "Extends angle encoding with polynomial feature interactions without entanglement.",

  description:
    "Higher-order angle encoding extends the basic angle encoding by computing polynomial combinations of input features before encoding them as rotation angles. Instead of mapping each feature directly to a qubit rotation, the encoding first computes all polynomial terms up to a specified order (e.g., x_0·x_1, x_0·x_2, x_1·x_2 for order 2), then distributes these terms across qubits.\n\nLike basic angle encoding, the result is a product state with no entanglement, making it classically simulable. However, the polynomial feature expansion captures nonlinear feature interactions at the classical preprocessing stage, analogous to classical polynomial kernel methods. This provides richer feature representations while maintaining the simplicity of single-qubit rotations.\n\nThe number of polynomial terms grows as Σ_{k=1}^{order} C(n,k). For order 2, this is n + n(n-1)/2 terms; for order n, it's 2^n - 1 terms (exponential). A \"sum\" combination mode averages terms assigned to each qubit, while \"product\" mode multiplies them.",

  mathFormulation:
    "|\\psi(\\mathbf{x})\\rangle = \\bigotimes_{q=0}^{n-1} R_a\\left(\\sum_{S} c_S \\prod_{i \\in S} x_i\\right)|0\\rangle",

  properties: {
    nQubits: 4,
    depth: 1,
    gateCount: 4,
    singleQubitGates: 4,
    twoQubitGates: 0,
    parameterCount: 0,
    isEntangling: false,
    simulability: "simulable",
    trainabilityEstimate: 0.93,
    notes:
      "Higher-order angle encoding with order=2, RY rotation, product combination. Classically simulable product states with polynomial feature interactions.",
  },

  parameters: [
    {
      name: "n_features",
      type: "int",
      default: null,
      description: "Number of input features (determines qubit count).",
    },
    {
      name: "order",
      type: "int",
      default: 2,
      description:
        "Maximum polynomial order. Order 2 includes pairwise products; higher orders grow combinatorially.",
    },
    {
      name: "rotation",
      type: 'Literal["X", "Y", "Z"]',
      default: "Y",
      description: "Rotation axis for encoding gates.",
    },
    {
      name: "combination",
      type: 'Literal["product", "sum"]',
      default: "product",
      description:
        "How polynomial terms are combined: product multiplies, sum averages.",
    },
    {
      name: "include_first_order",
      type: "bool",
      default: true,
      description: "Whether to include first-order (linear) terms.",
    },
    {
      name: "scaling",
      type: "float",
      default: 1.0,
      description: "Global scaling factor applied to all computed angles.",
    },
    {
      name: "reps",
      type: "int",
      default: 1,
      description: "Number of repetitions of the encoding layer.",
    },
  ],

  circuitStructure: [
    [
      { type: "RY", qubits: [0], parameter: "f(x_0, x_1, ...)" },
      { type: "RY", qubits: [1], parameter: "f(x_0, x_1, ...)" },
      { type: "RY", qubits: [2], parameter: "f(x_0, x_1, ...)" },
      { type: "RY", qubits: [3], parameter: "f(x_0, x_1, ...)" },
    ],
  ],

  codeExamples: [
    {
      backend: "pennylane",
      code: `from encoding_atlas import HigherOrderAngleEncoding
import pennylane as qml
import numpy as np

enc = HigherOrderAngleEncoding(n_features=4, order=2, rotation="Y")
dev = qml.device("default.qubit", wires=enc.n_qubits)

@qml.qnode(dev)
def circuit(x):
    enc.get_circuit(x, backend="pennylane")
    return qml.state()

x = np.array([0.1, 0.5, 1.2, 2.3])
state = circuit(x)`,
      description:
        "Higher-order angle encoding with PennyLane using order-2 polynomial features.",
    },
    {
      backend: "qiskit",
      code: `from encoding_atlas import HigherOrderAngleEncoding
import numpy as np

enc = HigherOrderAngleEncoding(n_features=4, order=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
qc = enc.get_circuit(x, backend="qiskit")
print(qc.draw())`,
      description:
        "Higher-order angle encoding with Qiskit showing polynomial feature expansion.",
    },
    {
      backend: "cirq",
      code: `from encoding_atlas import HigherOrderAngleEncoding
import numpy as np

enc = HigherOrderAngleEncoding(n_features=4, order=2)
x = np.array([0.1, 0.5, 1.2, 2.3])
circuit = enc.get_circuit(x, backend="cirq")
print(circuit)`,
      description: "Higher-order angle encoding with Cirq backend.",
    },
  ],

  useCases: [
    "Capturing polynomial feature interactions without entanglement",
    "Classical polynomial kernel emulation in quantum circuits",
    "Low-depth feature maps for NISQ devices needing nonlinear encoding",
    "Feature expansion preprocessing combined with variational layers",
    "Research into product-state expressibility limits",
  ],

  prosAndCons: {
    pros: [
      "Captures polynomial feature interactions (x_i·x_j terms)",
      "Constant depth (O(1) per rep) — extremely NISQ-friendly",
      "High trainability (~0.93) with no barren plateau risk",
      "Flexible order and combination modes",
      "No entanglement overhead — purely single-qubit operations",
    ],
    cons: [
      "No entanglement — classically simulable, no quantum advantage",
      "Term count grows combinatorially with order (2^n - 1 at max order)",
      "Limited to ~10 features before polynomial explosion",
      "Product state expressibility fundamentally limited",
      "Polynomial interactions computed classically — quantum circuit adds no benefit for this computation",
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
    bestFor: [
      "polynomial_features",
      "feature_interactions",
      "product_states",
    ],
    avoidWhen: [
      "many_features",
      "need_entanglement",
      "quantum_advantage",
    ],
    maxFeatures: 10,
    simulable: true,
    requiresDataType: null,
    requiresSymmetry: null,
    requiresNFeatures: null,
    requiresEvenFeatures: false,
    requiresTrainable: false,
    qubitScaling: "linear",
    circuitDepth: "shallow",
  },

  references: [
    "Schuld, M., Sweke, R., & Meyer, J.K. (2021). Effect of data encoding on the expressive power of variational quantum machine learning models. Physical Review A, 103(3), 032430.",
    "Havlíček, V., et al. (2019). Supervised learning with quantum-enhanced feature spaces. Nature, 567(7747), 209–212.",
  ],

  relatedEncodings: ["angle", "iqp", "pauli-feature-map"],
};
