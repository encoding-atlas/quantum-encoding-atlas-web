"use client";

import { useCallback, useMemo, useReducer, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type {
  DataType,
  FeatureInteraction,
  GuideInput,
  Priority,
  ProblemStructure,
  SymmetryType,
  Task,
} from "@/data/encodings/types";

// ---------------------------------------------------------------------------
// Step configuration
// ---------------------------------------------------------------------------

export interface StepConfig {
  id: string;
  label: string;
  shortLabel: string;
  shouldShow: (answers: Partial<GuideInput>) => boolean;
}

const STEP_CONFIGS: StepConfig[] = [
  {
    id: "data_type",
    label: "Data Type",
    shortLabel: "Data",
    shouldShow: () => true,
  },
  {
    id: "n_features",
    label: "Features",
    shortLabel: "Features",
    shouldShow: () => true,
  },
  {
    id: "symmetry",
    label: "Symmetry",
    shortLabel: "Symmetry",
    shouldShow: (a) => a.dataType !== "binary" && a.dataType !== "discrete",
  },
  {
    id: "task",
    label: "Task Type",
    shortLabel: "Task",
    shouldShow: () => true,
  },
  {
    id: "priority",
    label: "Priority",
    shortLabel: "Priority",
    shouldShow: () => true,
  },
  {
    id: "hardware",
    label: "Hardware",
    shortLabel: "Hardware",
    shouldShow: () => true,
  },
  {
    id: "advanced",
    label: "Advanced",
    shortLabel: "Advanced",
    shouldShow: () => true,
  },
];

// ---------------------------------------------------------------------------
// State and actions
// ---------------------------------------------------------------------------

export interface WizardState {
  currentStep: number;
  answers: Partial<GuideInput>;
  direction: 1 | -1;
  showResults: boolean;
}

type WizardAction =
  | { type: "SET_ANSWER"; field: keyof GuideInput; value: GuideInput[keyof GuideInput] }
  | { type: "NEXT_STEP"; totalSteps: number }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "SHOW_RESULTS" }
  | { type: "EDIT_ANSWERS" }
  | { type: "RESET" }
  | { type: "HYDRATE"; answers: Partial<GuideInput>; showResults: boolean };

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_ANSWER": {
      const newAnswers = { ...state.answers, [action.field]: action.value };
      // If data type changes to binary/discrete, clear symmetry
      if (
        action.field === "dataType" &&
        (action.value === "binary" || action.value === "discrete")
      ) {
        newAnswers.symmetry = null;
      }
      return { ...state, answers: newAnswers };
    }
    case "NEXT_STEP":
      if (state.currentStep >= action.totalSteps - 1) {
        return { ...state, showResults: true, direction: 1 };
      }
      return {
        ...state,
        currentStep: state.currentStep + 1,
        direction: 1,
      };
    case "PREV_STEP":
      if (state.currentStep <= 0) return state;
      return {
        ...state,
        currentStep: state.currentStep - 1,
        direction: -1,
      };
    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.step,
        direction: action.step > state.currentStep ? 1 : -1,
      };
    case "SHOW_RESULTS":
      return { ...state, showResults: true, direction: 1 };
    case "EDIT_ANSWERS":
      return { ...state, showResults: false, currentStep: 0, direction: -1 };
    case "RESET":
      return {
        currentStep: 0,
        answers: {},
        direction: 1,
        showResults: false,
      };
    case "HYDRATE":
      return {
        ...state,
        answers: action.answers,
        showResults: action.showResults,
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// URL param serialization
// ---------------------------------------------------------------------------

function serializeToParams(answers: Partial<GuideInput>): URLSearchParams {
  const params = new URLSearchParams();
  if (answers.dataType) params.set("data_type", answers.dataType);
  if (answers.nFeatures !== undefined) params.set("n_features", String(answers.nFeatures));
  if (answers.nSamples !== undefined && answers.nSamples !== 500) {
    params.set("n_samples", String(answers.nSamples));
  }
  if (answers.task) params.set("task", answers.task);
  if (answers.hardware) params.set("hardware", answers.hardware);
  if (answers.priority) params.set("priority", answers.priority);
  if (answers.symmetry) params.set("symmetry", answers.symmetry);
  if (answers.trainable) params.set("trainable", "true");
  if (answers.problemStructure) params.set("problem_structure", answers.problemStructure);
  if (answers.featureInteractions) params.set("feature_interactions", answers.featureInteractions);
  return params;
}

function parseFromParams(params: URLSearchParams): Partial<GuideInput> | null {
  const dataType = params.get("data_type");
  const nFeatures = params.get("n_features");
  if (!dataType || !nFeatures) return null;

  return {
    dataType: dataType as DataType,
    nFeatures: parseInt(nFeatures, 10),
    nSamples: params.get("n_samples")
      ? parseInt(params.get("n_samples")!, 10)
      : 500,
    task: (params.get("task") as Task) ?? "classification",
    hardware: params.get("hardware") ?? "simulator",
    priority: (params.get("priority") as Priority) ?? "accuracy",
    symmetry: (params.get("symmetry") as SymmetryType) ?? null,
    trainable: params.get("trainable") === "true",
    problemStructure: (params.get("problem_structure") as ProblemStructure) ?? null,
    featureInteractions: (params.get("feature_interactions") as FeatureInteraction) ?? null,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGuideWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useRef(false);

  const [state, dispatch] = useReducer(reducer, {
    currentStep: 0,
    answers: {},
    direction: 1,
    showResults: false,
  });

  // Hydrate from URL params on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const parsed = parseFromParams(searchParams);
    if (parsed && parsed.dataType && parsed.nFeatures) {
      dispatch({
        type: "HYDRATE",
        answers: parsed,
        showResults: true,
      });
    }
  }, [searchParams]);

  // Active steps (filtered by conditional logic)
  const activeSteps = useMemo(
    () => STEP_CONFIGS.filter((s) => s.shouldShow(state.answers)),
    [state.answers]
  );

  const currentStepConfig = activeSteps[state.currentStep] ?? activeSteps[0];
  const totalSteps = activeSteps.length;

  // URL sync on answers change (only when results are showing)
  const updateUrl = useCallback(
    (answers: Partial<GuideInput>, showResults: boolean) => {
      if (!showResults) return;
      const params = serializeToParams(answers);
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  // Actions
  const setAnswer = useCallback(
    (field: keyof GuideInput, value: GuideInput[keyof GuideInput]) => {
      dispatch({ type: "SET_ANSWER", field, value });
    },
    []
  );

  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP", totalSteps });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: "GO_TO_STEP", step });
  }, []);

  const showResultsView = useCallback(() => {
    dispatch({ type: "SHOW_RESULTS" });
    updateUrl(state.answers, true);
  }, [state.answers, updateUrl]);

  const editAnswers = useCallback(() => {
    dispatch({ type: "EDIT_ANSWERS" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Sync URL when results become visible
  useEffect(() => {
    if (state.showResults && state.answers.dataType && state.answers.nFeatures) {
      updateUrl(state.answers, true);
    }
  }, [state.showResults, state.answers, updateUrl]);

  // Derived state
  const canGoBack = state.currentStep > 0;
  const isLastStep = state.currentStep >= totalSteps - 1;

  const canGoNext = useMemo(() => {
    if (!currentStepConfig) return false;
    const { id } = currentStepConfig;
    const a = state.answers;
    switch (id) {
      case "data_type":
        return a.dataType !== undefined;
      case "n_features":
        return a.nFeatures !== undefined && a.nFeatures >= 1;
      case "symmetry":
        return true; // null is valid (no symmetry)
      case "task":
        return a.task !== undefined;
      case "priority":
        return a.priority !== undefined;
      case "hardware":
        return a.hardware !== undefined;
      case "advanced":
        return true; // all optional
      default:
        return false;
    }
  }, [currentStepConfig, state.answers]);

  return {
    currentStep: state.currentStep,
    activeSteps,
    currentStepConfig,
    answers: state.answers,
    direction: state.direction,
    showResults: state.showResults,
    totalSteps,

    setAnswer,
    nextStep,
    prevStep,
    goToStep,
    showResultsView,
    editAnswers,
    reset,

    canGoNext,
    canGoBack,
    isLastStep,
  };
}
