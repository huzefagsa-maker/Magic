import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const MaraudersMapExperience = lazy(() =>
  import("@/components/map/MaraudersMapExperience").then((m) => ({ default: m.MaraudersMapExperience }))
);

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "The Marauder's Map — A Birthday for Umema" },
      { name: "description", content: "I solemnly swear that I am up to no good." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050407]" />}>
      <MaraudersMapExperience />
    </Suspense>
  );
}
