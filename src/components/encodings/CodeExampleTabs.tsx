"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CodeBlock } from "./CodeBlock";
import type { CodeExample } from "@/data/encodings";

const BACKEND_LABELS: Record<string, string> = {
  pennylane: "PennyLane",
  qiskit: "Qiskit",
  cirq: "Cirq",
};

interface CodeExampleTabsProps {
  examples: CodeExample[];
}

export function CodeExampleTabs({ examples }: CodeExampleTabsProps) {
  if (examples.length === 0) return null;

  const defaultTab = examples[0].backend;

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        {examples.map((ex) => (
          <TabsTrigger key={ex.backend} value={ex.backend}>
            {BACKEND_LABELS[ex.backend] ?? ex.backend}
          </TabsTrigger>
        ))}
      </TabsList>
      {examples.map((ex) => (
        <TabsContent key={ex.backend} value={ex.backend}>
          <p className="mb-3 text-sm text-muted-foreground">{ex.description}</p>
          <CodeBlock code={ex.code} language="python" />
        </TabsContent>
      ))}
    </Tabs>
  );
}
