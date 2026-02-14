import katex from "katex";

export function DisplayMath({ formula }: { formula: string }) {
  const html = katex.renderToString(formula, {
    throwOnError: false,
    displayMode: true,
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
