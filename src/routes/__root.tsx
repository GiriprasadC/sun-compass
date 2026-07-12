import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Phone } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDbData } from "@/lib/db";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["dbData"],
      queryFn: () => getDbData(),
    });
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SUN Academic Research & Training — Chennai" },
      {
        name: "description",
        content:
          "SUN Academic Research & Training, Chennai. Ph.D. assistance, teachers training, psychological assessment and IAS coaching led by Prof. Dr. R. Rajendran.",
      },
      { name: "author", content: "SUN Academic Research & Training" },
      { property: "og:title", content: "SUN Academic Research & Training" },
      {
        property: "og:description",
        content:
          "Empowering research, education and professional development — 35+ years of academic mentorship in Chennai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
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

function RootContent() {
  const { data: dbData } = useQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  const widget = dbData?.consultationWidget || {
    enabled: true,
    labelSmall: "Click Here For",
    labelLarge: "Free Consultation",
    phoneOverride: ""
  };

  const phone = widget.phoneOverride || dbData?.contactInfo?.phone || "98403 41412";
  const cleanPhone = phone.replace(/\s+/g, "");

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />

      {/* Floating Action Consultation Widget */}
      {widget.enabled && (
        <a
          href={`tel:${cleanPhone}`}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 rounded-full bg-primary pl-4 pr-5 py-3 text-white shadow-elevated transition-all duration-300 hover:scale-105 hover:bg-primary-hover hover:shadow-hover group cursor-pointer animate-bounce-subtle"
          title={`Click here for ${widget.labelLarge}`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            <Phone className="h-4.5 w-4.5 group-hover:animate-wiggle" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">{widget.labelSmall}</span>
            <span className="text-sm font-bold leading-tight animate-pulse">{widget.labelLarge}</span>
          </div>
        </a>
      )}
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RootContent />
    </QueryClientProvider>
  );
}
