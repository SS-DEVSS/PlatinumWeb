import nuestrosProductos1 from "../assets/Nuestros_Productos_1.png";
import nuestrosProductos2 from "../assets/Nuestros_Productos_2.png";
import nuestrosProductos3 from "../assets/Nuestros_Productos_3.png";

const PRODUCT_LINES = [
  {
    title: "Kits + CSC",
    imageSrc: nuestrosProductos1,
    imageAlt: "Kits de embrague Platinum con CSC",
  },
  {
    title: "HD",
    imageSrc: nuestrosProductos2,
    imageAlt: "Embrague heavy duty Platinum",
  },
  {
    title: "Volante Motriz",
    imageSrc: nuestrosProductos3,
    imageAlt: "Volante motriz Platinum",
  },
] as const;

function Productos() {
  return (
    <main className="pb-12 lg:pb-16">
      <h1 className="mb-10 px-6 md:px-10 lg:px-16 xl:px-24">
        Nuestros Productos
      </h1>

      <section id="embrague" className="scroll-mt-24 w-full">
        <article className="w-full rounded-2xl bg-[#F5F6F8] py-2 text-center">
          <section className="mb-12 mt-6 flex w-full flex-col items-stretch gap-10 px-4 md:flex-row md:items-start md:justify-between md:gap-6 md:px-6 lg:gap-8">
            {PRODUCT_LINES.map((line) => (
              <div
                key={line.title}
                className="flex w-full min-w-0 flex-col items-center md:flex-1"
              >
                <h2 className="text-2xl font-medium md:text-[35px]">
                  {line.title}
                </h2>
                <img
                  src={line.imageSrc}
                  alt={line.imageAlt}
                  className="mt-6 w-full max-w-none object-contain md:mt-8"
                />
              </div>
            ))}
          </section>
        </article>
      </section>

      <div className="my-12 flex flex-col items-center px-6 text-center md:px-10 lg:px-16 xl:px-24">
        <h2 className="page-title md:mb-0">Componentes principales</h2>
      </div>

      <section className="flex flex-col justify-between gap-6 md:flex-row">
        <article className="flex basis-1/2 flex-col items-center rounded-2xl bg-[#F5F6F8] py-2 text-center">
          <a href="/Productos/Plato">
            <h2 className="mt-9 text-[35px] font-medium">Plato</h2>
            <p className="mb-5 mt-1 text-lg font-regular text-naranja hover:underline">
              Más información
            </p>
            <img
              src="/images/componentes/VW03-2.png"
              alt="Plato"
              className="mb-12 w-[360px] max-w-full"
            />
          </a>
        </article>

        <article className="flex basis-1/2 flex-col items-center rounded-2xl bg-[#F5F6F8] py-2 text-center">
          <a href="/Productos/Disco">
            <h2 className="mt-9 text-[35px] font-medium">Disco</h2>
            <p className="mb-5 mt-1 text-lg font-regular text-naranja hover:underline">
              Más información
            </p>
            <img
              src="/images/componentes/NS73-3.png"
              alt="Disco"
              className="mb-12 w-[360px] max-w-full"
            />
          </a>
        </article>
      </section>
    </main>
  );
}

export default Productos;
