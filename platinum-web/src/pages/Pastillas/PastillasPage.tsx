import CardDownload from "../../components/CardDownload";
import Footer from "../../components/Footer";

function PastillasPage() {
  return (
    <main>
      <section className="bg-azul_pastillas p-6 xl:px-40 mb-20 pb-16 pt-10">
        <a href="/">
          <button className="flex border rounded-full px-6 py-2 gap-3">
            <img
              src="/icons/left-arrow.png"
              width={24}
              height={24}
              alt="Icon regresar"
            />
            <p className="text-white">Regresar</p>
          </button>
        </a>
        <h2 className="font-bold text-white text-5xl mt-12">
          Pastillas de Freno
        </h2>
        <p className="font-bold text-[#dbdddd] mt-5 mb-10">
          PLATINUM DRIVELINE
        </p>

        <article className="flex flex-col md:flex-row bg-white rounded-2xl rounded-t-2xl mt-7">
          <section className="bg-[#e5e2e2] rounded-t-2xl md:rounded-r-none md:rounded-l-2xl basis-2/6 flex flex-col items-center justify-center">
            <img
              src="/images/cajas/CajaPastilla.png"
              alt="Kit"
              width={400}
              height={400}
            />
          </section>
          <p className="basis-4/6 text-justify p-8 lg:p-16 leading-10 flex flex-col items-center justify-center">
            <span className="text-left mr-auto font-bold">
              Platinum Premium brake pads
            </span>
            Pastillas de freno integral moldeadas de última tecnología, con
            shims, accesorios y homologación con primer equipo. Material de
            fricción seleccionado para satisfacer las demandas de los vehículos
            modernos con ABS y sistemas de frenado automatizado.
          </p>
        </article>
      </section>
      <section className="px-6 lg:px-12 xl:px-40 mb-20">
        <h1>Visita Nuestro Catálogo</h1>
        <section className="mt-28 flex flex-col sm:flex-row justify-center gap-28 sm:gap-4 md:gap-8 lg:gap-6 xl:gap-10">
          <CardDownload
            page={"pastillas"}
            title={"Catálogo Pastillas de Freno"}
            content={
              "Explora el catálogo de pastillas de freno de Platinum Driveline. Conoce nuestra línea de productos desarrollados para garantizar una frenada eficiente y segura."
            }
            type={"download"}
            href={"/download/BrakesLista.pdf"}
          />
        </section>
      </section>
      <section className="bg-azul_pastillas px-5 lg:px-16 xl:px-28">
        <h1 className="text-center py-16 text-white text-[32px] font-medium">
          Mas Información
        </h1>
        <section className="md:flex gap-5 pb-20">
          <article className="bg-white rounded-2xl rounded-t-2xl p-7 w-full lg:w-1/2 mb-8 md:mb-0">
            <h3 className="font-bold text-2xl mb-5">Características:</h3>
            <ul className="list-disc space-y-5 px-4 text-justify">
              <li>
                Fabricadas bajo altos estandares de equipo original. Con
                aprobacion SAE-J661
              </li>
              <li>Frenado eficiente y seguro para su vehiculo.</li>
              <li>Excelente duracion.</li>
              <li>Alta resistencia a la temperatura.</li>
              <li>No genera ruidos ni vibraciones.</li>
              <li>No abrasivas con los discos.</li>
              <li>Calidad competitiva a precios atractivos.</li>
              <li>
                Marcado con lote de fabricacion, coeficiente de friccion y
                numero de parte, para control de calidad.
              </li>
              <li>
                Producto garantizado por parte de Platinum Driveline y su red de
                distribuidores, aplicable a defectos de fabricacion y/o
                materiales. Sujeta a revision tecnica.
              </li>
            </ul>
          </article>
          <article className="bg-white rounded-2xl rounded-t-2xl p-8 w-full lg:w-1/2">
            <h3 className="font-bold text-2xl mb-3">Garantía:</h3>
            <p className="text-justify leading-8">
              Garantia de 6 meses o 10,000 km , lo que ocurra primero,
              unicamente por defectos de material o fabricacion. No incluye
              gastos de desmontaje ni mano de obra.
            </p>
            <p className="my-3 font-bold">
              La garantia no se hara efectiva en los siguientes casos:
            </p>
            <ul className="list-disc ml-6 leading-8">
              <li>Hayan sido instaladas incorrectamente.</li>
              <li>
                Muestren daños originados por motivos ajenos a su
                funcionamiento.
              </li>
              <li>
                Tengan alguna modificación o alteración en su diseño original.
              </li>
              <li>Presenten signos visibles de abuso en su utilización.</li>
              <li>
                Se instalen en vehículos para los cuales no fueron diseñadas o
                en aquellos que hayan sido modificados de su diseño original.
              </li>
            </ul>
            <p className="mt-3 leading-8">
              Para que la garantía de desgaste proceda, se debe tener un
              desgaste regular en las 4 pastillas, parejo, ya que lo común es
              que se presente solo en 1 pastilla, que se quede pegada, o las de
              un eje, o desgaste en forma de cuña, tampoco aplicable.
            </p>
          </article>
        </section>
      </section>
      <section className="px-6 lg:px-12 xl:px-40">
        <section className="bg-gris_oscuro text-white mt-10 mb-10 lg:mb-20 p-4 md:p-10 text-center rounded-2xl">
          <h3 className="text-3xl py-3 lg:py-5">Nuestros Boletines</h3>
          <section className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mt-3 lg:mt-6 px-4 pb-4">
            <a
              href="/download/boletinInstalacion.jpg"
              download
              className="bg-white rounded-xl flex flex-col items-center"
            >
              <section className="flex-shrink-0">
                <img
                  src="/download/boletinInstalacion.jpg"
                  alt="Kit"
                  width={550}
                  height={400}
                  className="w-full h-full rounded-t-xl object-contain border-b-2 sm:max-w-[400px]"
                />
              </section>
              <h5 className="p-4 lg:p-6 text-center flex-grow flex flex-col justify-center text-black">
                Recomendaciones de Instalación
              </h5>
            </a>
          </section>
        </section>
      </section>
      <Footer />
    </main>
  );
}

export default PastillasPage;
