import { CheckCircle2 } from "lucide-react";

interface UseCasesSectionProps {
  useCases: string[];
}

export function UseCasesSection({ useCases }: UseCasesSectionProps) {
  if (useCases.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">
        When to Use This Encoding
      </h2>
      <ul className="mt-4 space-y-3">
        {useCases.map((useCase) => (
          <li key={useCase} className="flex gap-3 text-sm leading-relaxed">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cat-amplitude" />
            <span>{useCase}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
