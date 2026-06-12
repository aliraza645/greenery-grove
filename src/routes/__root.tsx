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
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-leaf">404</h1>
        <h2 className="mt-4 text-xl text-ink">This page is overgrown.</h2>
        <p className="mt-2 text-sm text-ink/60">The page you're looking for doesn't exist.</p>
        <div className="mt-8">
          <Link to="/" className="inline-flex items-center bg-leaf text-mist px-6 py-3 text-xs uppercase tracking-widest font-medium">
            Back to greenhouse
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
    <div className="flex min-h-screen items-center justify-center bg-mist px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-leaf">Something wilted</h1>
        <p className="mt-2 text-sm text-ink/60">Try refreshing the page.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-leaf text-mist px-5 py-2.5 text-xs uppercase tracking-widest font-medium"
          >
            Try again
          </button>
          <a href="/" className="border border-leaf text-leaf px-5 py-2.5 text-xs uppercase tracking-widest font-medium">
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
      { title: "ePlant — Botanical eCommerce" },
      { name: "description", content: "Curated architectural plants and handmade vessels, delivered from our greenhouse to your living room." },
      { property: "og:title", content: "ePlant — Botanical eCommerce" },
      { property: "og:description", content: "Curated architectural plants and handmade vessels, delivered from our greenhouse to your living room." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ePlant — Botanical eCommerce" },
      { name: "twitter:description", content: "Curated architectural plants and handmade vessels, delivered from our greenhouse to your living room." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/28d8c4f5-6aa3-4163-b195-b9682080c122/id-preview-7653ea12--131724e7-d385-4432-a06e-bd39488f8fea.lovable.app-1781263496317.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/28d8c4f5-6aa3-4163-b195-b9682080c122/id-preview-7653ea12--131724e7-d385-4432-a06e-bd39488f8fea.lovable.app-1781263496317.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
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
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-mist text-ink">
              <Navbar />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
            </div>
            <Toaster richColors position="top-center" />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
