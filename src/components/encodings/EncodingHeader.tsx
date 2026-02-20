import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CategoryBadge } from "./CategoryBadge";
import { CATEGORY_MAP } from "@/data/categories";
import type { Encoding, EncodingCategoryId } from "@/data/encodings";
import { Cpu, Layers, Hash, ShieldCheck } from "lucide-react";

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatBox({ icon, label, value }: StatBoxProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

interface EncodingHeaderProps {
  encoding: Encoding;
}

export function EncodingHeader({ encoding }: EncodingHeaderProps) {
  const category = CATEGORY_MAP.get(encoding.category);
  const { properties } = encoding;

  const simulabilityLabel =
    properties.simulability === "simulable"
      ? "Simulable"
      : properties.simulability === "conditionally_simulable"
        ? "Conditional"
        : "Not simulable";

  return (
    <header>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/encodings">Encodings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/encodings?category=${encoding.category}`}>
                {category?.name ?? encoding.category}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{encoding.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <CategoryBadge categoryId={encoding.category as EncodingCategoryId} />
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          {encoding.name}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          {encoding.shortDescription}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox
          icon={<Cpu className="size-4" />}
          label="Qubits"
          value={String(properties.nQubits)}
        />
        <StatBox
          icon={<Layers className="size-4" />}
          label="Depth"
          value={String(properties.depth)}
        />
        <StatBox
          icon={<Hash className="size-4" />}
          label="Total Gates"
          value={String(properties.gateCount)}
        />
        <StatBox
          icon={<ShieldCheck className="size-4" />}
          label="Simulability"
          value={simulabilityLabel}
        />
      </div>
    </header>
  );
}
