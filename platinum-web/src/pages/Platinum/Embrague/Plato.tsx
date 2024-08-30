import PlatinumLayout from "../../../Layouts/PlatinumLayout";

function Plato() {
  return (
    <PlatinumLayout>
      <main className="px-8 lg:px-10 xl:px-32">
        <h1 className="py-6 lg:py-9">Plato</h1>

        <section className="flex flex-col lg:flex-row justify-between mb-16 px-4 md:gap-16">
          <section className="basis-2/5">
            <img
              src="/images/componentes/VW03-2.png"
              alt="NS73-3"
              width={400}
              height={400}
              className="w-1/2 lg:w-[90%] mx-auto mb-8 md:mb-0"
            />
          </section>
          <ul className="list-disc leading-10 basis-3/5 text-lg text-justify">
            <li>Carcaza o tapa sometido a pruebas de dureza y resistencia.</li>
            <li>Protector antioxidante y lubricante.</li>
            <li>Ángulos y bordes desbastados elimina los filos del acero.</li>
            <li>
              Diafragma o abanico producido con metal de alta calidad. Las
              puntas son tratadas térmicamente para incrementar su dureza y
              evitar desgaste prematuro por la fricción del collarín también
              causada por malos hábitos de manejo.
            </li>
            <li>
              Arillos internos de acero al alto carbón para incrementar la vida
              útil de los componentes.
            </li>
            <li>
              Muelles endurecidos con templado, ofrecen mayor flexibilidad y
              resistencia, mejora el desplazamiento equitativo del plato
              opresor.
            </li>
            <li>
              Acabado con maquinado fino, para reducir el tiempo de asentamiento
              de la pasta del disco sobre la pista de fricción.
            </li>
            <li>Balanceo de alta precisión para evitar vibraciones.</li>
            <li>Remachado con equipo hidráulico de precisión.</li>
          </ul>
        </section>

        <h1>También te puede interesar</h1>

        <section className="flex flex-col sm:flex-row justify-center gap-10 mb-20 mt-10">
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

export default Plato;
