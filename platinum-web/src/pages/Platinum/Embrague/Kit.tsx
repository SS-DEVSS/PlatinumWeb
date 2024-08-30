import PlatinumLayout from "../../../Layouts/PlatinumLayout";

function Kit() {
  return (
    <PlatinumLayout>
      <main className="px-8 lg:px-10 xl:px-32">
        <h1 className="py-6 lg:py-9">Kit de Clutch</h1>

        <section className="flex flex-col md:flex-row justify-between mb-16 px-4 md:gap-16 md:items-center">
          <section className="basis-2/5">
            <img
              src="/images/componentes/KitCompletoPlatinum.png"
              alt="NS73-3"
              width={400}
              height={400}
              className="w-1/2 md:w-[90%] mx-auto mb-8 md:mb-0"
            />
          </section>
          <ul className="list-disc leading-10 basis-3/5 text-lg text-justify">
            <li>
              Diseño, funcionamiento y características óptimos para reemplazo de
              equipo original.
            </li>
            <li>
              Fabricados con componentes de calidad y alta resistencia, tratados
              térmicamente y acabados con precisión.
            </li>
            <li>Kits con accesorios y componentes incluidos.</li>
            <li>
              Tenemos las aplicaciones de mayor rotación para servicio ligero y
              diésel rango medio.
            </li>
          </ul>
        </section>

        <h1>También te puede interesar</h1>

        <section className="flex flex-col sm:flex-row justify-center gap-10 mb-20 mt-10">
          <a href="/Productos/Plato">
            <article className="py-10 px-16 flex flex-col items-center border border-gray-300 rounded-md">
              <img
                src="/images/componentes/VW03-2.png"
                alt="NS73-3"
                width={200}
                height={200}
              />
              <h3 className="font-medium text-[35px] mb-3">Plato</h3>
              <button className="bg-naranja py-4 px-7 rounded-lg">
                Mas información
              </button>
            </article>
          </a>

          <a href="/Productos/Disco">
            <article className="py-10 px-16 flex flex-col items-center border border-gray-300 rounded-md">
              <img
                src="/images/componentes/NS73-3.png"
                alt="NS73-3"
                width={200}
                height={200}
              />
              <h3 className="font-medium text-[35px] mb-3">Disco</h3>
              <button className="bg-naranja py-4 px-7 rounded-lg">
                Mas información
              </button>
            </article>
          </a>
        </section>
      </main>
    </PlatinumLayout>
  );
}

export default Kit;
