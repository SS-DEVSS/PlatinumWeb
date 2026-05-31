import { useLocation } from "react-router-dom";
import { menuItems } from "../data/menuData";
import NavItem from "./NavItem";
import { isNavActive } from "../utils/navActive";

const NavMobile = ({ toggleMenu }: { toggleMenu: () => void }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex-1 bg-white flex flex-col overflow-y-auto">
      <ul className="flex flex-col px-5 pt-4 pb-6 gap-1">
        {menuItems.map((item, index) => {
          const active = isNavActive(pathname, item.href);
          return (
            <li
              key={index}
              onClick={toggleMenu}
              className={`px-4 py-3.5 rounded-xl transition-colors border-b border-slate-100 last:border-0 ${
                active ? "bg-naranja/5" : "hover:bg-slate-50"
              }`}
            >
              <NavItem
                href={item.href}
                text={item.text}
                icon={item.icon}
                variant="mobile"
              />
            </li>
          );
        })}
      </ul>

      <div className="px-5 pb-8 pt-2 flex gap-5 items-center">
        <a href="mailto:ventas@platinumdriveline.mx">
          <img src="/icons/emailNaranja.png" alt="email" className="w-6" />
        </a>
        <a href="https://www.facebook.com/PlatinumDrivelineMx/" target="_blank">
          <img src="/icons/facebookNaranja.png" alt="facebook" className="w-6" />
        </a>
        <a href="https://wa.me/4423455370" target="_blank">
          <img src="/icons/whatsappnaranja.png" alt="whatsapp" className="w-6" />
        </a>
      </div>
    </div>
  );
};

export default NavMobile;
