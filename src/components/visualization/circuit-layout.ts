import type { CircuitGate } from "@/data/encodings";

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

export const WIRE_SPACING = 56;
export const LAYER_SPACING = 80;
export const GATE_WIDTH = 44;
export const GATE_HEIGHT = 36;
export const LABEL_WIDTH = 48;
export const PADDING = 16;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GateNode {
  id: string;
  gate: CircuitGate;
  x: number;
  y: number;
  column: number;
  layerIndex: number;
}

export interface WireSegment {
  qubitIndex: number;
  x1: number;
  x2: number;
  y: number;
}

export interface TwoQubitConnection {
  gateId: string;
  type: "cnot" | "cz" | "rzz";
  x: number;
  y1: number;
  y2: number;
  controlQubit: number;
  targetQubit: number;
}

export interface CircuitLayout {
  nodes: GateNode[];
  wires: WireSegment[];
  connections: TwoQubitConnection[];
  totalWidth: number;
  totalHeight: number;
  nQubits: number;
  nLayers: number;
  totalColumns: number;
}

// ---------------------------------------------------------------------------
// Layout algorithm
// ---------------------------------------------------------------------------

/**
 * Splits a conceptual layer into visual sub-columns when gates
 * conflict on the same qubit. Returns an array of sub-layers,
 * each containing non-conflicting gates.
 */
function splitLayerIntoColumns(gates: CircuitGate[]): CircuitGate[][] {
  const columns: CircuitGate[][] = [];

  for (const gate of gates) {
    const gateQubits = new Set(gate.qubits);
    let placed = false;

    for (const column of columns) {
      const columnQubits = new Set<number>();
      for (const g of column) {
        for (const q of g.qubits) columnQubits.add(q);
      }

      let conflicts = false;
      for (const q of gateQubits) {
        if (columnQubits.has(q)) {
          conflicts = true;
          break;
        }
      }

      if (!conflicts) {
        column.push(gate);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([gate]);
    }
  }

  return columns;
}

/**
 * Computes the full layout for a quantum circuit diagram.
 * Takes the 2D gate array from encoding data and returns
 * positioned nodes, wire segments, and two-qubit connections.
 */
export function computeCircuitLayout(
  circuitStructure: CircuitGate[][],
): CircuitLayout {
  // Determine number of qubits
  let nQubits = 0;
  for (const layer of circuitStructure) {
    for (const gate of layer) {
      for (const q of gate.qubits) {
        nQubits = Math.max(nQubits, q + 1);
      }
    }
  }
  if (nQubits === 0) nQubits = 1;

  // Split layers into visual columns
  const allColumns: { gates: CircuitGate[]; layerIndex: number }[] = [];
  for (let li = 0; li < circuitStructure.length; li++) {
    const subColumns = splitLayerIntoColumns(circuitStructure[li]);
    for (const col of subColumns) {
      allColumns.push({ gates: col, layerIndex: li });
    }
  }

  const totalColumns = allColumns.length;

  // Compute gate nodes
  const nodes: GateNode[] = [];
  const connections: TwoQubitConnection[] = [];

  for (let ci = 0; ci < allColumns.length; ci++) {
    const { gates, layerIndex } = allColumns[ci];
    const x = PADDING + LABEL_WIDTH + ci * LAYER_SPACING + LAYER_SPACING / 2;

    for (const gate of gates) {
      const primaryQubit = gate.qubits[0];
      const y = PADDING + primaryQubit * WIRE_SPACING + WIRE_SPACING / 2;
      const id = `gate-${ci}-${primaryQubit}-${gate.type}`;

      nodes.push({ id, gate, x, y, column: ci, layerIndex });

      // Two-qubit connections
      if (gate.qubits.length >= 2) {
        const q1 = gate.qubits[0];
        const q2 = gate.qubits[1];
        const y1 = PADDING + q1 * WIRE_SPACING + WIRE_SPACING / 2;
        const y2 = PADDING + q2 * WIRE_SPACING + WIRE_SPACING / 2;

        let connectionType: TwoQubitConnection["type"] = "cnot";
        if (gate.type === "CZ") connectionType = "cz";
        else if (gate.type === "RZZ") connectionType = "rzz";

        connections.push({
          gateId: id,
          type: connectionType,
          x,
          y1,
          y2,
          controlQubit: q1,
          targetQubit: q2,
        });
      }
    }
  }

  // Compute wire segments
  const totalWidth =
    PADDING * 2 + LABEL_WIDTH + totalColumns * LAYER_SPACING + LAYER_SPACING / 2;
  const totalHeight = PADDING * 2 + nQubits * WIRE_SPACING;

  const wires: WireSegment[] = [];
  for (let qi = 0; qi < nQubits; qi++) {
    const y = PADDING + qi * WIRE_SPACING + WIRE_SPACING / 2;
    wires.push({
      qubitIndex: qi,
      x1: PADDING,
      x2: totalWidth - PADDING,
      y,
    });
  }

  return {
    nodes,
    wires,
    connections,
    totalWidth,
    totalHeight,
    nQubits,
    nLayers: circuitStructure.length,
    totalColumns,
  };
}
