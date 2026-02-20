import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <SearchX className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No encodings match your filters</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try adjusting your search or clearing filters to see all encodings.
      </p>
      <Button variant="outline" className="mt-6" onClick={onClearFilters}>
        Clear all filters
      </Button>
    </div>
  );
}
