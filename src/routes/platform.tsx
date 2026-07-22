import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const PlatformExperience = lazy(() =>
  import("@/components/platform/PlatformExperience").then((m) => ({ default: m.PlatformExperience }))
);

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform 9¾ — A Birthday for Umema" },
      { name: "description", content: "Run straight through the wall." },
    ],
  }),
  component: PlatformPage,
});

function PlatformPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080507]" />}>
      <PlatformExperience />
    </Suspense>
  );
}
