import { useState, useEffect } from "react";
import NavItem from "./NavItem";
import NavMobile from "./NavMobile";
import { Link } from "react-router-dom";
import { menuItems } from "../data/menuData";

function Header() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isVisible]);

  return (
    <main>
      <section className="hidden nav2:flex bg-naranja px-[50px] 2xl:px-[60px] py-2 justify-between items-center">
        <section className="flex gap-5">
          <Link
            to="https://www.facebook.com/PlatinumDrivelineMx/"
            target="_blank"
          >
            <img src="/icons/facebookWhite.png" alt="facebook" />
          </Link>
          <Link to="mailto:ventas@platinumdriveline.mx">
            <img src="/icons/emailWhite.png" alt="email" />
          </Link>
        </section>
        <section>
          <section className="flex gap-5 text-[#edeaea] py-1">
            <Link to="https://catalogoplatinumdriveline.com/" target="_blank">
              <article className="flex items-center px-5 gap-3 rounded-xl bg-white py-2 hover:bg-slate-200">
                <img className="w-5" src="/icons/webBlack.png" alt="email" />
                <p className="font-medium text-gris_oscuro hover:underline">
                  Visita el Catálogo Electrónico
                </p>
              </article>
            </Link>
            <Link
              to="https://drive.google.com/file/d/18D9Jt4JPXq125AJl3dbak-qnmIVdtaBj/view?usp=sharing"
              target="_blank"
            >
              <article className="flex items-center px-5 gap-3 rounded-xl bg-white py-2 hover:bg-slate-200">
                <img className="w-5" src="/icons/webBlack.png" alt="email" />
                <p className="font-medium text-gris_oscuro hover:underline">
                  Visita el Catálogo Ligero
                </p>
              </article>
            </Link>
          </section>
        </section>
      </section>
      <nav
        className={`${
          isVisible
            ? "fixed inset-0 overflow-y-auto w-full flex flex-col z-50"
            : ""
        }`}
      >
        <section
          className={`${
            isVisible ? "bg-white" : "bg-gris_oscuro"
          } flex justify-between items-center md:pl-10 pr-7 md:pr-20 xl:px-[50px] h-[10vh]`}
        >
          <section className="flex gap-4 items-center">
            <a href="/">
              <img
                src="/LOGOPlatinum.png"
                alt="Kit"
                className="w-[160px] h-auto ml-8 nav:ml-0"
              />
            </a>
          </section>
          <img
            onClick={toggleMenu}
            src={isVisible ? "/icons/close.png" : "/icons/menu.png"}
            alt="burger menu"
            width={25}
            height={25}
            className="float-end nav2:hidden cursor-pointer"
          />
          <ul className="hidden nav2:flex gap-10 text-white justify-end w-[80%] items-center">
            {menuItems.map((item) => (
              <NavItem
                key={item.text}
                href={item.href}
                text={item.text}
                icon={item.icon}
              />
            ))}
          </ul>
        </section>
        {isVisible && <NavMobile toggleMenu={toggleMenu} />}
      </nav>
    </main>
  );
}

export default Header;
