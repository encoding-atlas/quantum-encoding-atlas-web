"use client";

import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { WizardProgress } from "./WizardProgress";
import { QuestionStep } from "./QuestionStep";
import {
  DataTypeStep,
  FeatureCountStep,
  SymmetryStep,
  TaskStep,
  PriorityStep,
  HardwareStep,
  AdvancedStep,
} from "./steps";
import type { useGuideWizard } from "@/hooks/useGuideWizard";
import type { DataType, Priority, SymmetryType, Task } from "@/data/encodings/types";

interface GuideWizardProps {
  wizard: ReturnType<typeof useGuideWizard>;
}

const STEP_META: Record<
  string,
  { title: string; description?: string }
> = {
  data_type: {
    title: "What type of data will you encode?",
    description:
      "Select the nature of your input features. This determines which encodings are structurally compatible.",
  },
  n_features: {
    title: "How many features does your dataset have?",
    description:
      "This determines qubit requirements. Most quantum encodings use one qubit per feature.",
  },
  symmetry: {
    title: "Does your data have a known symmetry?",
    description:
      "Symmetry-aware encodings can provide stronger inductive biases and guaranteed equivariance properties.",
  },
  task: {
    title: "What machine learning task are you solving?",
  },
  priority: {
    title: "What is your optimization priority?",
    description:
      "This determines which trade-offs the recommender favors.",
  },
  hardware: {
    title: "What hardware will you run on?",
    description:
      "Hardware constraints affect which encodings are practical.",
  },
  advanced: {
    title: "Fine-tune your recommendation",
    description:
      "These optional parameters help the engine narrow down the best encoding for your specific use case.",
  },
};

export function GuideWizard({ wizard }: GuideWizardProps) {
  const {
    currentStep,
    activeSteps,
    currentStepConfig,
    answers,
    direction,
    setAnswer,
    nextStep,
    prevStep,
    goToStep,
    showResultsView,
    canGoNext,
    canGoBack,
    isLastStep,
  } = wizard;

  const stepId = currentStepConfig?.id ?? "data_type";
  const meta = STEP_META[stepId] ?? { title: "" };

  function handleOptionSelect() {
    // Auto-advance after selection with brief delay
    setTimeout(() => {
      if (isLastStep) {
        showResultsView();
      } else {
        nextStep();
      }
    }, 300);
  }

  function renderStep() {
    switch (stepId) {
      case "data_type":
        return (
          <DataTypeStep
            value={answers.dataType}
            onChange={(v: DataType) => {
              setAnswer("dataType", v);
              handleOptionSelect();
            }}
          />
        );
      case "n_features":
        return (
          <FeatureCountStep
            value={answers.nFeatures}
            onChange={(v: number) => setAnswer("nFeatures", v)}
          />
        );
      case "symmetry":
        return (
          <SymmetryStep
            value={answers.symmetry}
            nFeatures={answers.nFeatures ?? 4}
            onChange={(v: SymmetryType | null) => {
              setAnswer("symmetry", v);
              handleOptionSelect();
            }}
          />
        );
      case "task":
        return (
          <TaskStep
            value={answers.task}
            onChange={(v: Task) => {
              setAnswer("task", v);
              handleOptionSelect();
            }}
          />
        );
      case "priority":
        return (
          <PriorityStep
            value={answers.priority}
            onChange={(v: Priority) => {
              setAnswer("priority", v);
              handleOptionSelect();
            }}
          />
        );
      case "hardware":
        return (
          <HardwareStep
            value={answers.hardware}
            onChange={(v: string) => setAnswer("hardware", v)}
          />
        );
      case "advanced":
        return (
          <AdvancedStep
            answers={answers}
            onFieldChange={setAnswer}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Progress */}
      <WizardProgress
        currentStep={currentStep}
        activeSteps={activeSteps}
        onStepClick={goToStep}
      />

      {/* Step content with animation */}
      <div className="min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <QuestionStep
            stepKey={stepId}
            direction={direction}
            title={meta.title}
            description={meta.description}
          >
            {renderStep()}
          </QuestionStep>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={!canGoBack}
          className={!canGoBack ? "invisible" : ""}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            size="lg"
            onClick={showResultsView}
            className="glow-primary"
          >
            <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
            Get Recommendation
          </Button>
        ) : (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canGoNext}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
