import ContactButton from "../../../components/ContactButton";
import Productos from "../../../components/Productos";
import PlatinumLayout from "../../../Layouts/PlatinumLayout";

function ProductosEmbrague() {
  return (
    <PlatinumLayout>
      <h1 className="py-6 lg:py-9">Nuestra Calidad</h1>
      <section className="px-6 md:px-10 lg:px-14 xl:px-28 gap-10 lg:gap-20 flex flex-col lg:flex-row justify-between w-full mb-28 mt-6">
        <article className="basis-[50%] text-justify flex flex-col items-center leading-9">
          <img
            src="/images/cajas/Clutch.png"
            alt="Boletin #1"
            className="max-w-[360px] h-[240px] mb-12 size-full"
          />
          <h3 className="font-medium text-[24px] mb-7">
            Introducción del Programa
          </h3>
          <p>
            Con una experiencia de más de 2 décadas, nuestro portafolio de
            embrague ha madurado en un programa de 8 fábricas, con certificación
            ISO/TS16949.
          </p>
          <p className="mt-3">
            Ofrecemos un programa completo para Aftermarket siguiendo la pauta
            de OEM, bajo especificaciones de cada fabricante de Equipo Original.
          </p>
          <ul className="list-disc my-4 mx-0">
            <li>Plato y Disco</li>
            <li>Collarín Mecánico o Collarín Hidráulico (CSC)</li>
          </ul>
          <p>
            Componentes Elaborados con materia prima de alta calidad, maquinaria
            de última tecnología y los más elevados estándares.
          </p>
        </article>
        <article className="basis-[50%] text-justify flex flex-col items-center leading-9">
          <img
            src="/images/SelloNaranja.jpeg"
            alt="Boletin #1"
            className="max-w-[320px] h-[240px] mb-12 size-full"
          />
          <h3 className="font-medium text-[24px] mb-7">Pruebas</h3>
          <p>
            Durante el proceso de fabricación del plato y el disco, los
            componentes son sometidos a rigurosos procedimientos: prueba de
            resistencia y dureza, de fatiga y rendimiento hasta 5 millones de
            ciclos, pruebas de balance, de resistencia a altas temperaturas, de
            compresión, pruebas de torsión, prueba final del conjunto de
            embrague en banco de ensamble, según protocolos QCT25 y QCT27-2014.
          </p>
        </article>
      </section>
      <Productos />

      <ContactButton />
    </PlatinumLayout>
  );
}

export default ProductosEmbrague;
