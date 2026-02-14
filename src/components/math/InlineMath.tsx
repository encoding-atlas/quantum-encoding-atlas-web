import katex from "katex";

export function InlineMath({ formula }: { formula: string }) {
  const html = katex.renderToString(formula, {
    throwOnError: false,
    displayMode: false,
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
