import katex from "katex";

interface MathDisplayProps {
  formula: string;
  ariaLabel?: string;
}

export function MathDisplay({ formula, ariaLabel }: MathDisplayProps) {
  let html: string;
  let hasError = false;

  try {
    html = katex.renderToString(formula, {
      throwOnError: true,
      displayMode: true,
    });
  } catch {
    hasError = true;
    html = katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true,
    });
  }

  return (
    <div
      className="my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 px-6 py-8 text-center"
      role="math"
      aria-label={ariaLabel ?? `Mathematical formula: ${formula}`}
    >
      {hasError && (
        <p className="mb-2 text-xs text-destructive">
          Formula rendering encountered an issue
        </p>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
