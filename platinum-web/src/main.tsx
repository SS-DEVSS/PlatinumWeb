import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import QuienesSomos from "./pages/Platinum/QuienesSomos";
import ProductosEmbrague from "./pages/Platinum/Embrague/ProductosEmbrague";
import Kit from "./pages/Platinum/Embrague/Kit";
import Disco from "./pages/Platinum/Embrague/Disco";
import Plato from "./pages/Platinum/Embrague/Plato";
import Boletines from "./pages/Platinum/Boletines";
import Galeria from "./pages/Platinum/Galeria";
import Contacto from "./pages/Platinum/Contacto";
import DelphiPage from "./pages/Delphi/DelphiPage";
import PastillasPage from "./pages/Pastillas/PastillasPage";
import Catalogo from "./pages/Platinum/Catalogo";
import ProductDetail from "./pages/Platinum/ProductDetail";
import { ItemContextProvider } from "./context/Item-context";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/catalogo",
    element: <Catalogo />,
  },
  {
    path: "/producto/:itemId",
    element: <ProductDetail />,
  },
  {
    path: "/kit/:itemId",
    element: <ProductDetail />,
  },
  {
    path: "/quienes-somos",
    element: <QuienesSomos />,
  },
  {
    path: "/Productos",
    element: <ProductosEmbrague />,
  },
  {
    path: "/Productos/Kit",
    element: <Kit />,
  },
  {
    path: "/Productos/Disco",
    element: <Disco />,
  },
  {
    path: "/Productos/Plato",
    element: <Plato />,
  },
  {
    path: "/Boletines",
    element: <Boletines />,
  },
  {
    path: "/Galeria",
    element: <Galeria />,
  },
  {
    path: "/Contacto",
    element: <Contacto />,
  },
  {
    path: "/Pastillas",
    element: <PastillasPage />,
  },
  {
    path: "/Delphi",
    element: <DelphiPage />,
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
