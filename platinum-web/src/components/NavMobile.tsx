import { Link } from "react-router-dom";
import { menuItems } from "../data/menuData";
import NavItem from "./NavItem";

const NavMobile = ({ toggleMenu }: { toggleMenu: () => void }) => {
  return (
    <main className="min-h-screen">
      <section className="bg-white flex flex-col justify-between text-black font-medium nav2:hidden px-6 min-h-screen">
        <ul className="flex flex-col justify-center gap-7 bg-gris_oscuro text-white rounded-2xl py-7 px-7">
          {menuItems.map((item, index) => (
            <article
              onClick={toggleMenu}
              className="flex justify-between py-4"
              key={index}
            >
              <NavItem
                key={index}
                href={item.href}
                text={item.text}
                icon={item.icon}
              />
            </article>
          ))}
          <Link to="https://catalogoplatinumdriveline.com" target="_blank">
            <article className="bg-naranja flex items-center px-3 py-3 gap-3 rounded-lg">
              <img className="w-8" src="/icons/webWhite.png" alt="email" />
              <p className="text-white">Visita el Catálogo Electrónico</p>
            </article>
          </Link>
        </ul>
        <section className="md:px-20 xl:px-40 py-10 lg:py-0 flex justify-center lg:justify-start gap-7">
          <a href="mailto:seb.flores2002@gmail.com">
            <img src="/icons/email.png" alt="email" />
          </a>
          <a
            href="https://www.facebook.com/PlatinumDrivelineMx/"
            target="_blank"
          >
            <img src="/icons/facebookNaranja.png" alt="facebook" />
          </a>
          <a href="https://wa.me/4423455370" target="_blank">
            <img
              className="w-6"
              src="/icons/whatsappnaranja.png"
              alt="whatsapp"
            />
          </a>
        </section>
      </section>
    </main>
  );
};

export default NavMobile;
