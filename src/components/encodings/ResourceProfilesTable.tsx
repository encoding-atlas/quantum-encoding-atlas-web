import type { ResourceProfile } from "@/data/encodings";

interface ResourceProfilesTableProps {
  profiles: ResourceProfile[];
}

export function ResourceProfilesTable({
  profiles,
}: ResourceProfilesTableProps) {
  if (profiles.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">
        Resource Scaling
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        How resource requirements grow with the number of input features.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-4 font-medium text-muted-foreground">
                Features
              </th>
              <th className="pb-2 pr-4 font-medium text-muted-foreground">
                Qubits
              </th>
              <th className="pb-2 pr-4 font-medium text-muted-foreground">
                Depth
              </th>
              <th className="pb-2 pr-4 font-medium text-muted-foreground">
                Gates
              </th>
              <th className="pb-2 font-medium text-muted-foreground">
                2Q Gates
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr
                key={p.nFeatures}
                className="border-b border-border last:border-b-0"
              >
                <td className="py-2.5 pr-4 tabular-nums">{p.nFeatures}</td>
                <td className="py-2.5 pr-4 tabular-nums">{p.nQubits}</td>
                <td className="py-2.5 pr-4 tabular-nums">{p.depth}</td>
                <td className="py-2.5 pr-4 tabular-nums">{p.gateCount}</td>
                <td className="py-2.5 tabular-nums">{p.twoQubitGates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
