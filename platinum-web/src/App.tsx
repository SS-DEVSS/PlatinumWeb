import { Navigate } from "react-router-dom";
import Carousel from "./components/Carousel/Carousel";
import ContactButton from "./components/ContactButton";
import Marcas from "./components/Marcas";
import PlatinumLayout from "./Layouts/PlatinumLayout";
import FeaturedProductsSection from "./components/FeaturedProductsSection";
import { MOBILE_NAV_MEDIA_QUERY } from "./hooks/useIsMobileNav";

const MOBILE_CATALOG_FIRST_VISIT_KEY = "platinum-mobile-catalog-first-visit";

function shouldRedirectMobileHomeOnce(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia(MOBILE_NAV_MEDIA_QUERY).matches) return false;
  if (sessionStorage.getItem(MOBILE_CATALOG_FIRST_VISIT_KEY)) return false;
  sessionStorage.setItem(MOBILE_CATALOG_FIRST_VISIT_KEY, "1");
  return true;
}

function HomePage() {
  return (
    <PlatinumLayout>
      <Carousel />
      <Marcas />
      <FeaturedProductsSection />
      <ContactButton />
    </PlatinumLayout>
  );
}

function App() {
  const redirectOnce = shouldRedirectMobileHomeOnce();

  if (redirectOnce) {
    return <Navigate to="/catalogo" replace />;
  }

  return <HomePage />;
}

export default App;
