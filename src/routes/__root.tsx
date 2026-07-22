import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ParticleBackground } from "../components/layout/ParticleBackground";
import { PageTransition } from "../components/layout/PageTransition";
import { VideoBackground } from "../components/layout/VideoBackground";
import { AudioBackground } from "../components/layout/AudioBackground";
import { IntroScreen } from "../components/layout/IntroScreen";
import { ExperienceProvider, useExperience } from "../context/ExperienceContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-gold text-glow-gold">404</h1>
        <h2 className="mt-4 font-display text-xl text-parchment">This corridor doesn't exist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The staircase must have moved. Try heading home.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-gold/60 px-6 py-2 font-display text-sm uppercase tracking-widest text-gold hover:bg-gold hover:text-ink"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl text-parchment">A spell misfired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again, or head back to the start.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-gold/60 px-6 py-2 font-display text-sm uppercase tracking-widest text-gold hover:bg-gold hover:text-ink"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-parchment/30 px-6 py-2 font-display text-sm uppercase tracking-widest text-parchment hover:bg-parchment/10"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Letter — A Birthday for Umema" },
      {
        name: "description",
        content:
          "You've been accepted. Open the envelope.",
      },
      { name: "author", content: "For Umema, with love" },
      { property: "og:title", content: "The Letter — A Birthday for Umema" },
      {
        property: "og:description",
        content: "You've been accepted. Open the envelope.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Letter — A Birthday for Umema" },
      { name: "twitter:description", content: "You've been accepted. Open the envelope." },
      { property: "og:image", content: "/U.png" },
      { name: "twitter:image", content: "/U.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", href: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ExperienceProvider>
        <RootExperience />
      </ExperienceProvider>
    </QueryClientProvider>
  );
}

function RootExperience() {
  const { hasEntered } = useExperience();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink">
      <AudioBackground />
      {hasEntered && (
        <>
          <VideoBackground />
          <ParticleBackground />
          <PageTransition>
            <Outlet />
          </PageTransition>
        </>
      )}
      <IntroScreen />
    </div>
  );
}
