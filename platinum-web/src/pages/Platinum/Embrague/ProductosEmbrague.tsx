import ContactButton from "../../../components/ContactButton";
import Productos from "../../../components/Productos";
import PlatinumLayout from "../../../Layouts/PlatinumLayout";

function ProductosEmbrague() {
  return (
    <PlatinumLayout>
      {/* Hero */}
      <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-14 bg-white">
        <h1 className="text-gray-900 text-4xl font-bold mb-12">Nuestra Calidad</h1>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          <article className="flex-1 flex flex-col">
            <img
              src="/images/cajas/Clutch.png"
              alt="Kit de Embrague"
              className="w-full max-w-sm mx-auto h-56 object-contain mb-8"
            />
            <h3 className="text-gray-900 text-xl font-semibold mb-4">Introducción del Programa</h3>
            <div className="space-y-3 text-gray-500 text-[15px] leading-relaxed">
              <p>
                Con una experiencia de más de 2 décadas, nuestro portafolio de embrague ha madurado en un
                programa de 8 fábricas, con certificación ISO/TS16949.
              </p>
              <p>
                Ofrecemos un programa completo para Aftermarket siguiendo la pauta de OEM, bajo
                especificaciones de cada fabricante de Equipo Original.
              </p>
              <ul className="list-disc ml-5 space-y-1 text-gray-400">
                <li>Plato y Disco</li>
                <li>Collarín Mecánico o Collarín Hidráulico (CSC)</li>
              </ul>
              <p>Componentes elaborados con materia prima de alta calidad y los más elevados estándares.</p>
            </div>
          </article>

          <article className="flex-1 flex flex-col">
            <img
              src="/images/SelloNaranja.jpeg"
              alt="Sello de Calidad"
              className="w-full max-w-sm mx-auto h-56 object-contain mb-8"
            />
            <h3 className="text-gray-900 text-xl font-semibold mb-4">Pruebas de Calidad</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Durante el proceso de fabricación, los componentes son sometidos a rigurosos procedimientos:
              prueba de resistencia y dureza, fatiga y rendimiento hasta 5 millones de ciclos, pruebas de
              balance, resistencia a altas temperaturas, compresión, torsión y prueba final del conjunto en
              banco de ensamble según protocolos QCT25 y QCT27-2014.
            </p>
          </article>

        </div>
      </section>

      <Productos />
      <ContactButton />
    </PlatinumLayout>
  );
}

export default ProductosEmbrague;
