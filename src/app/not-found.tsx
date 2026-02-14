import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold gradient-text-quantum font-mono">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold">State Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          This quantum state has collapsed into the void.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return to Observable Universe</Link>
        </Button>
      </div>
    </div>
  );
}
