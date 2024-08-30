import PlatinumLayout from "../../../Layouts/PlatinumLayout";

function Disco() {
  return (
    <PlatinumLayout>
      <main className="px-8 lg:px-10 xl:px-32">
        <h1 className="py-6 lg:py-9">Disco</h1>

        <section className="flex flex-col lg:flex-row justify-between mb-16 px-4 md:gap-16">
          <section className="basis-2/5">
            <img
              src="/images/componentes/NS73-3.png"
              alt="NS73-3"
              width={400}
              height={400}
              className="w-1/2 lg:w-[90%] mx-auto mb-8 md:mb-0"
            />
          </section>
          <ul className="list-disc leading-10 basis-3/5 text-lg text-justify">
            <li>
              Alta resistencia al desgaste por excelente composición de
              materiales.
            </li>
            <li>Amortiguador torsional templado con acabado anodizado.</li>
            <li>
              Segmentos con tratamiento térmico de alta flexibilidad, ofrecen
              arranques más suaves sin vibraciones y mayor resistencia al
              sobrecalentamiento por abuso en el manejo.
            </li>
            <li>
              Pastas a base de fibras de vidrio aglutinado con resina polimérica
              de primera calidad, que dan fortaleza estructural, combinado con
              metales en un porcentaje mayor a otras marcas en el mercado. Con
              esto se garantiza una respuesta inmediata al desembragar, alto
              coeficiente de fricción y una experiencia de manejo confortable.
            </li>
            <li>
              Pastas ranuradas que generan un flujo de aire entre la superficie
              y la pista de fricción, favoreciendo el enfriamiento de los
              componentes.
            </li>
            <li>
              Eje estriado (estrías) forjado con prueba de dureza, temple y
              altas temperaturas.
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

          <a href="/Productos/Kit">
            <article className="py-10 px-16 flex flex-col items-center justify-between border border-gray-300 rounded-md w-full h-full">
              <img
                src="/images/componentes/KitCompletoPlatinum.png"
                alt="NS73-3"
                width={200}
                height={200}
              />
              <h3 className="font-medium text-[35px] mb-3">Kits</h3>
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

export default Disco;
