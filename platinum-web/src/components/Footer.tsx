import { Link } from "react-router-dom";
import { menuItemsFooter } from "../data/menuData";

function Footer() {
  return (
    <footer className="bg-gris_oscuro">
      <div className="px-6 lg:px-16 pt-12 pb-6">
        <div className="flex flex-col nav:flex-row justify-between gap-10">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-4">
            <img src="/LOGOPlatinum.png" alt="Platinum Driveline" width={150} />
            <p className="text-slate-400 text-sm max-w-[220px] leading-relaxed">
              Componentes de transmisión de alta calidad para el mercado automotriz.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h6 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contacto</h6>
            <div className="flex flex-col gap-2 text-slate-400 text-sm">
              <a href="mailto:ventas@platinumdriveline.mx" className="hover:text-white transition-colors">
                ventas@platinumdriveline.mx
              </a>
              <p>(442) 674 35 53 / 55</p>
              <a href="mailto:soporte@platinumdriveline.mx" className="hover:text-white transition-colors mt-2">
                soporte@platinumdriveline.mx
              </a>
              <p>(446) 138 53 47</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h6 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Navegación</h6>
            <ul className="flex flex-col gap-2">
              {menuItemsFooter.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors">
                    {item.text}
                    <img src="/icons/arrowWhite.png" alt="" className="w-4 opacity-50" />
                  </a>
                </li>
              ))}
              <li>
                <Link to="/privacidad" className="flex items-center gap-2 text-slate-400 text-sm hover:text-white transition-colors">
                  Política de Privacidad
                  <img src="/icons/arrowWhite.png" alt="" className="w-4 opacity-50" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h6 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Síguenos</h6>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/PlatinumDrivelineMx/" target="_blank"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <img src="/icons/facebookWhite.png" alt="facebook" className="w-4" />
              </a>
              <a href="mailto:ventas@platinumdriveline.mx"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <img src="/icons/emailWhite.png" alt="email" className="w-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10 px-6 lg:px-16 py-4">
        <p className="text-slate-500 text-xs text-center">
          © 2024 Platinum Driveline. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
