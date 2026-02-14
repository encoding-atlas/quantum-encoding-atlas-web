"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1>Something went wrong</h1>
          <button onClick={() => reset()} style={{ marginTop: "1rem" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
