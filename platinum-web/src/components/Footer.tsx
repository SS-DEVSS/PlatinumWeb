import { menuItemsFooter } from "../data/menuData";

function Footer() {
  return (
    <main className="bg-gris_oscuro py-7">
      <section className="flex flex-col nav:flex-row justify-between items-center px-5 lg:px-16">
        <div className="basis-1/3">
          <img src="/LOGOPlatinum.png" alt="NS73-3" width={160} height={160} />
        </div>

        <section className="flex flex-col mt-8 lg:mt-0 sm:flex-row justify-center gap-10 lg:gap-20 basis-1/3 text-center text-gris_ligero">
          <article className="text-sm">
            <h5 className="text-[19px] text-[#d3d3d3] mb-5">Contacto</h5>
            <h6>ventas@platinumdriveline.mx</h6>
            <h6 className="mt-2">
              (442) 674 35<span className="text-naranja">53</span>/
              <span className="text-naranja">55</span>
            </h6>
          </article>
          <article className="text-sm">
            <h5 className="text-[19px] text-[#d3d3d3] mb-5">Soporte</h5>
            <h6>soporte@platinumdriveline.mx</h6>
            <h6 className="mt-2">
              <span className="text-naranja">(446)</span> 138 53 47
            </h6>
          </article>
        </section>
        <section className="basis-1/3 flex justify-end lg:pr-12 mt-10 lg:mt-0">
          <ul className="text-white mx-auto lg:mx-0">
            <li>
              {menuItemsFooter.map(
                (
                  item: { href: string; text: string; icon: string },
                  index: number
                ) => (
                  <article
                    className="py-1 text-sm text-[#d3d3d3] text-center"
                    key={index}
                  >
                    <a
                      className="hover:underline transition-all flex items-center gap-2"
                      href={item.href}
                    >
                      <p>{item.text}</p>
                      <img
                        src={`/icons/${item.icon}.png`}
                        alt="menu icon"
                        width={18}
                        height={18}
                      />
                    </a>
                  </article>
                )
              )}
            </li>
          </ul>
        </section>
      </section>
      <h6 className="basis-1/3 text-gris_ligero text-center text-sm mt-8 nav:mt-0 md:px-10 xl:px-0 py-8">
        @ 2024 Platinum Driveline All rights reserved
      </h6>
    </main>
  );
}

export default Footer;
