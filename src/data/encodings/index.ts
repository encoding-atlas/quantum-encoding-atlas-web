export type {
  Encoding,
  EncodingProperties,
  EncodingRule,
  EncodingParameter,
  CodeExample,
  CircuitGate,
  ResourceProfile,
  EncodingCategory,
  EncodingCategoryId,
  Simulability,
  QubitScaling,
  CircuitDepthClass,
  BackendType,
  GuideInput,
  Recommendation,
  DataType,
  SymmetryType,
  Priority,
  Task,
  ProblemStructure,
  FeatureInteraction,
} from "./types";

import { angleEncoding } from "./angle";
import { amplitudeEncoding } from "./amplitude";
import { basisEncoding } from "./basis";
import { iqpEncoding } from "./iqp";
import { zzFeatureMapEncoding } from "./zz-feature-map";
import { pauliFeatureMapEncoding } from "./pauli-feature-map";
import { dataReuploadingEncoding } from "./data-reuploading";
import { hardwareEfficientEncoding } from "./hardware-efficient";
import { higherOrderAngleEncoding } from "./higher-order-angle";
import { qaoaEncoding } from "./qaoa";
import { hamiltonianEncoding } from "./hamiltonian";
import { trainableEncoding } from "./trainable";
import { symmetryInspiredEncoding } from "./symmetry-inspired";
import {
  so2EquivariantEncoding,
  cyclicEquivariantEncoding,
  swapEquivariantEncoding,
} from "./equivariant";
import type { Encoding } from "./types";

export const encodings: readonly Encoding[] = [
  angleEncoding,
  higherOrderAngleEncoding,
  amplitudeEncoding,
  basisEncoding,
  iqpEncoding,
  zzFeatureMapEncoding,
  pauliFeatureMapEncoding,
  dataReuploadingEncoding,
  hardwareEfficientEncoding,
  qaoaEncoding,
  hamiltonianEncoding,
  trainableEncoding,
  symmetryInspiredEncoding,
  so2EquivariantEncoding,
  cyclicEquivariantEncoding,
  swapEquivariantEncoding,
] as const;

export const encodingMap = new Map<string, Encoding>(
  encodings.map((e) => [e.id, e]),
);

const slugMap = new Map<string, Encoding>(
  encodings.map((e) => [e.slug, e]),
);

export function getEncodingById(id: string): Encoding | undefined {
  return encodingMap.get(id);
}

export function getEncodingBySlug(slug: string): Encoding | undefined {
  return slugMap.get(slug);
}

export function getEncodingsByCategory(
  categoryId: string,
): readonly Encoding[] {
  return encodings.filter((e) => e.category === categoryId);
}

export {
  angleEncoding,
  amplitudeEncoding,
  basisEncoding,
  iqpEncoding,
  zzFeatureMapEncoding,
  pauliFeatureMapEncoding,
  dataReuploadingEncoding,
  hardwareEfficientEncoding,
  higherOrderAngleEncoding,
  qaoaEncoding,
  hamiltonianEncoding,
  trainableEncoding,
  symmetryInspiredEncoding,
  so2EquivariantEncoding,
  cyclicEquivariantEncoding,
  swapEquivariantEncoding,
};
