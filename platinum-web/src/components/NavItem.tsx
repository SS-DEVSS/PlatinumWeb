import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { isNavActive } from "../utils/navActive";

type NavItemProps = {
  href: string | undefined;
  text: string;
  icon: string;
  variant?: "desktop" | "mobile";
};

const desktopLinkClass = (active: boolean) =>
  active
    ? "relative inline-flex items-center gap-3 py-2 text-base font-medium text-naranja border-b-2 border-naranja transition-colors"
    : "relative inline-flex items-center gap-3 py-2 text-base font-light text-white border-b-2 border-transparent hover:border-naranja hover:text-naranja/90 transition-colors";

const mobileLinkClass = (active: boolean) =>
  active
    ? "flex w-full items-center justify-between text-base font-semibold text-naranja border-l-[3px] border-naranja pl-3 -ml-3 transition-colors"
    : "flex w-full items-center justify-between text-base font-medium text-gray-800 border-l-[3px] border-transparent pl-3 -ml-3 hover:border-naranja hover:text-naranja transition-colors";

const NavItem = ({ href = "", text, icon, variant = "desktop" }: NavItemProps) => {
  const { pathname } = useLocation();
  const active = isNavActive(pathname, href);
  const isDesktop = variant === "desktop";
  const linkClass = isDesktop ? desktopLinkClass(active) : mobileLinkClass(active);

  if (text === "Otros Productos") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`${linkClass} outline-none focus-visible:ring-2 focus-visible:ring-naranja/50`}
        >
          {text}
          {isDesktop && (
            <img
              className="w-5"
              src="/icons/arrowDown.png"
              alt="dropdown arrow"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/Delphi">Delphi</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/Pastillas">Pastillas de Freno</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      to={href}
      className={linkClass}
      aria-current={active ? "page" : undefined}
    >
      {text}
      {!isDesktop && (
        <img
          src={active ? `/icons/active-${icon}` : `/icons/${icon}`}
          alt=""
          className="w-5 opacity-70"
        />
      )}
    </Link>
  );
};

export default NavItem;
