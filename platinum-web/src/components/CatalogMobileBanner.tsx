import { Link, useLocation } from "react-router-dom";

function isCatalogPage(pathname: string): boolean {
  const path = pathname.toLowerCase();
  return path === "/catalogo" || path === "/catalogo/";
}

/** Misma barra naranja del desktop, visible solo en mobile y arriba del navbar */
export default function CatalogMobileBanner() {
  const { pathname } = useLocation();

  if (isCatalogPage(pathname)) {
    return null;
  }

  return (
    <div className="nav2:hidden flex items-center justify-between bg-naranja/90 px-6 py-2 text-white text-xs">
      <div className="flex items-center gap-3">
        <Link
          to="https://www.facebook.com/PlatinumDrivelineMx/"
          target="_blank"
          className="opacity-80 transition-opacity hover:opacity-100"
        >
          <img
            src="/icons/facebookWhite.png"
            alt="facebook"
            className="w-5"
          />
        </Link>
        <Link
          to="mailto:ventas@platinumdriveline.mx"
          className="opacity-80 transition-opacity hover:opacity-100"
        >
          <img src="/icons/emailWhite.png" alt="email" className="w-5" />
        </Link>
      </div>
      <Link
        to="/catalogo"
        className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/25"
      >
        <img className="w-3.5" src="/icons/webWhite.png" alt="" />
        ¡Nuevo! Catálogo en línea
      </Link>
    </div>
  );
}
