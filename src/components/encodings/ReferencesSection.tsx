interface ReferencesSectionProps {
  references: string[];
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  if (references.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">References</h2>
      <ol className="mt-4 space-y-3">
        {references.map((ref, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed">
            <span className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground">
              [{i + 1}]
            </span>
            <span className="text-muted-foreground">{ref}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
