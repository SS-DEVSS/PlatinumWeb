import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/ErrorPage";
import { ItemContextProvider } from "./context/Item-context";
import { Toaster } from "./components/ui/toaster";

const QuienesSomos = lazy(() => import("./pages/Platinum/QuienesSomos"));
const ProductosEmbrague = lazy(() => import("./pages/Platinum/Embrague/ProductosEmbrague"));
const Kit = lazy(() => import("./pages/Platinum/Embrague/Kit"));
const Disco = lazy(() => import("./pages/Platinum/Embrague/Disco"));
const Plato = lazy(() => import("./pages/Platinum/Embrague/Plato"));
const Boletines = lazy(() => import("./pages/Platinum/Boletines"));
const BoletinDetail = lazy(() => import("./pages/Platinum/BoletinDetail"));
const Blogs = lazy(() => import("./pages/Platinum/Blogs"));
const BlogDetail = lazy(() => import("./pages/Platinum/BlogDetail"));
const Galeria = lazy(() => import("./pages/Platinum/Galeria"));
const Contacto = lazy(() => import("./pages/Platinum/Contacto"));
const DelphiPage = lazy(() => import("./pages/Delphi/DelphiPage"));
const PastillasPage = lazy(() => import("./pages/Pastillas/PastillasPage"));
const Catalogo = lazy(() => import("./pages/Platinum/Catalogo"));
const ProductDetail = lazy(() => import("./pages/Platinum/ProductDetail"));
const Privacidad = lazy(() => import("./pages/Platinum/Privacidad"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#E4E4E4]">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#20314f] border-t-transparent" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <App /> },
      { path: "catalogo", element: <Catalogo /> },
      { path: "producto/:itemId", element: <ProductDetail /> },
      { path: "kit/:itemId", element: <ProductDetail /> },
      { path: "quienes-somos", element: <QuienesSomos /> },
      { path: "Productos", element: <ProductosEmbrague /> },
      { path: "Productos/Kit", element: <Kit /> },
      { path: "Productos/Disco", element: <Disco /> },
      { path: "Productos/Plato", element: <Plato /> },
      { path: "Boletines", element: <Boletines /> },
      { path: "Boletines/:id", element: <BoletinDetail /> },
      { path: "Blogs", element: <Blogs /> },
      { path: "Blogs/:id", element: <BlogDetail /> },
      { path: "Galeria", element: <Galeria /> },
      { path: "Contacto", element: <Contacto /> },
      { path: "Pastillas", element: <PastillasPage /> },
      { path: "Delphi", element: <DelphiPage /> },
      { path: "privacidad", element: <Privacidad /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ItemContextProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster />
    </ItemContextProvider>
  </StrictMode>
);
