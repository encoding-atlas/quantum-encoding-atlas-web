/** Metadata for quantum gate types used in circuit visualization tooltips. */
export interface GateInfo {
  name: string;
  symbol: string;
  description: string;
  matrix?: string;
  isParameterized: boolean;
  isTwoQubit: boolean;
}

export const GATE_INFO: Record<string, GateInfo> = {
  H: {
    name: "Hadamard Gate",
    symbol: "H",
    description:
      "Creates equal superposition. Maps |0\u27E9 to |+\u27E9 and |1\u27E9 to |-\u27E9.",
    matrix: "(1/\u221A2) [[1, 1], [1, -1]]",
    isParameterized: false,
    isTwoQubit: false,
  },
  X: {
    name: "Pauli-X Gate",
    symbol: "X",
    description: "Bit-flip gate. Maps |0\u27E9 to |1\u27E9 and |1\u27E9 to |0\u27E9.",
    matrix: "[[0, 1], [1, 0]]",
    isParameterized: false,
    isTwoQubit: false,
  },
  RX: {
    name: "X-Rotation Gate",
    symbol: "R\u2093",
    description:
      "Rotates the qubit state around the X-axis of the Bloch sphere by angle \u03B8.",
    matrix: "[[cos(\u03B8/2), -i\u00B7sin(\u03B8/2)], [-i\u00B7sin(\u03B8/2), cos(\u03B8/2)]]",
    isParameterized: true,
    isTwoQubit: false,
  },
  RY: {
    name: "Y-Rotation Gate",
    symbol: "R\u02B8",
    description:
      "Rotates the qubit state around the Y-axis of the Bloch sphere by angle \u03B8.",
    matrix: "[[cos(\u03B8/2), -sin(\u03B8/2)], [sin(\u03B8/2), cos(\u03B8/2)]]",
    isParameterized: true,
    isTwoQubit: false,
  },
  RZ: {
    name: "Z-Rotation Gate",
    symbol: "R\u1D5A",
    description:
      "Rotates the qubit state around the Z-axis of the Bloch sphere by angle \u03B8.",
    matrix: "[[e^{-i\u03B8/2}, 0], [0, e^{i\u03B8/2}]]",
    isParameterized: true,
    isTwoQubit: false,
  },
  P: {
    name: "Phase Gate",
    symbol: "P",
    description:
      "Applies a phase shift e^{i\u03B8} to the |1\u27E9 state, leaving |0\u27E9 unchanged.",
    matrix: "[[1, 0], [0, e^{i\u03B8}]]",
    isParameterized: true,
    isTwoQubit: false,
  },
  CNOT: {
    name: "Controlled-NOT Gate",
    symbol: "CNOT",
    description:
      "Flips the target qubit if and only if the control qubit is |1\u27E9. Creates entanglement.",
    isParameterized: false,
    isTwoQubit: true,
  },
  CZ: {
    name: "Controlled-Z Gate",
    symbol: "CZ",
    description:
      "Applies a Z gate to the target qubit when the control is |1\u27E9. Symmetric between qubits.",
    isParameterized: false,
    isTwoQubit: true,
  },
  RZZ: {
    name: "ZZ Interaction Gate",
    symbol: "R\u1D5A\u1D5A",
    description:
      "Ising-type ZZ coupling between two qubits. Creates correlated phase rotations.",
    matrix: "e^{-i\u03B8 Z\u2297Z / 2}",
    isParameterized: true,
    isTwoQubit: true,
  },
};

/** Returns gate info, falling back to a generic entry for unknown gate types. */
export function getGateInfo(gateType: string): GateInfo {
  return (
    GATE_INFO[gateType] ?? {
      name: `${gateType} Gate`,
      symbol: gateType,
      description: `Quantum gate: ${gateType}`,
      isParameterized: false,
      isTwoQubit: false,
    }
  );
}
