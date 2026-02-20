import { Check, X } from "lucide-react";

interface ProsConsSectionProps {
  pros: string[];
  cons: string[];
}

export function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">Pros & Cons</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Pros */}
        <div className="rounded-lg border border-cat-amplitude/20 bg-cat-amplitude/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-cat-amplitude">
            Advantages
          </h3>
          <ul className="space-y-2.5">
            {pros.map((pro) => (
              <li
                key={pro}
                className="flex gap-2.5 text-sm leading-relaxed"
              >
                <Check className="mt-0.5 size-3.5 shrink-0 text-cat-amplitude" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-destructive">
            Limitations
          </h3>
          <ul className="space-y-2.5">
            {cons.map((con) => (
              <li
                key={con}
                className="flex gap-2.5 text-sm leading-relaxed"
              >
                <X className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
