import { useState, useEffect } from "react";
import NavItem from "./NavItem";
import NavMobile from "./NavMobile";
import CatalogMobileBanner from "./CatalogMobileBanner";
import { Link } from "react-router-dom";
import { menuItems } from "../data/menuData";

function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsVisible(!isVisible);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
  }, [isVisible]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <CatalogMobileBanner />

      {/* Top bar desktop */}
      <div className="hidden nav2:flex bg-naranja/90 px-12 2xl:px-16 py-1.5 justify-between items-center text-white text-xs">
        <div className="flex gap-4 items-center">
          <Link
            to="https://www.facebook.com/PlatinumDrivelineMx/"
            target="_blank"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <img
              src="/icons/facebookWhite.png"
              alt="facebook"
              className="w-6"
            />
          </Link>
          <Link
            to="mailto:ventas@platinumdriveline.mx"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <img src="/icons/emailWhite.png" alt="email" className="w-6" />
          </Link>
        </div>
        <div className="flex gap-3">
          <Link
            to="/Catalogo"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-4 py-1.5 rounded-full text-white text-xs font-medium"
          >
            <img className="w-3.5" src="/icons/webWhite.png" alt="web" />
            ¡Nuevo! Catálogo en línea
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`${isVisible ? "fixed inset-0 z-50 flex flex-col" : "sticky top-0 z-40"}`}
      >
        <div
          className={`flex justify-between items-center px-6 md:px-10 xl:px-14 h-20 transition-all duration-200
          ${isVisible ? "bg-white" : scrolled ? "bg-gris_oscuro/95 backdrop-blur-sm shadow-md" : "bg-gris_oscuro"}`}
        >
          <a href="/">
            <img
              src="/LOGOPlatinum.png"
              alt="Platinum Driveline"
              className="w-36 h-auto"
            />
          </a>

          {/* Burger */}
          <button
            onClick={toggleMenu}
            className="nav2:hidden p-1"
            aria-label="Menu"
          >
            <img
              src={isVisible ? "/icons/close.png" : "/icons/menu.png"}
              alt="menu"
              width={24}
              height={24}
            />
          </button>

          {/* Desktop links */}
          <ul className="hidden nav2:flex gap-6 xl:gap-8 text-white items-center">
            {menuItems.map((item) => (
              <li key={item.text}>
                <NavItem
                  href={item.href}
                  text={item.text}
                  icon={item.icon}
                  variant="desktop"
                />
              </li>
            ))}
          </ul>
        </div>

        {isVisible && <NavMobile toggleMenu={toggleMenu} />}
      </nav>
    </header>
  );
}

export default Header;
