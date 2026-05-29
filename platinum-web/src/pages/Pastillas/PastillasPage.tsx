import ContactButton from "../../components/ContactButton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

function PastillasPage() {
  return (
    <PlatinumLayout>
      {/* Hero */}
      <section className="bg-gris_oscuro px-6 lg:px-16 xl:px-24 pt-6 pb-0">
        <div className="flex items-center gap-4 mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors flex-shrink-0"
          >
            <img
              src="/icons/left-arrow.png"
              width={14}
              height={14}
              alt="regresar"
            />
            Regresar
          </a>
          <span className="text-slate-600">|</span>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
            Platinum Driveline
          </p>
          <span className="text-slate-600">|</span>
          <span className="text-white text-lg font-bold">Pastillas de Freno</span>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-slate-100 md:w-2/5 flex items-center justify-center p-8">
            <img
              src="/images/cajas/CajaPastilla.png"
              alt="Pastillas de Freno"
              className="w-72 object-contain"
            />
          </div>
          <div className="md:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
            <p className="font-bold text-gray-900 text-lg mb-3">
              Platinum Premium Brake Pads
            </p>
            <p className="text-gray-600 leading-relaxed">
              Pastillas de freno integral moldeadas de última tecnología, con
              shims, accesorios y homologación con primer equipo. Material de
              fricción seleccionado para satisfacer las demandas de los
              vehículos modernos con ABS y sistemas de frenado automatizado.
            </p>
          </div>
        </div>
      </section>

      {/* Características y Garantía */}
      <section className="bg-gris_oscuro px-6 lg:px-16 xl:px-24 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <article className="bg-white rounded-2xl p-8 flex-1">
            <h3 className="font-bold text-xl text-gray-900 mb-5">
              Características
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              {[
                "Fabricadas bajo altos estándares de equipo original. Con aprobación SAE-J661.",
                "Frenado eficiente y seguro para su vehículo.",
                "Excelente duración y alta resistencia a la temperatura.",
                "No genera ruidos ni vibraciones.",
                "No abrasivas con los discos.",
                "Calidad competitiva a precios atractivos.",
                "Marcado con lote de fabricación, coeficiente de fricción y número de parte.",
                "Producto garantizado por Platinum Driveline. Sujeta a revisión técnica.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-naranja font-bold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-white rounded-2xl p-8 flex-1">
            <h3 className="font-bold text-xl text-gray-900 mb-4">Garantía</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Garantía de 6 meses o 10,000 km, lo que ocurra primero, únicamente
              por defectos de material o fabricación. No incluye gastos de
              desmontaje ni mano de obra.
            </p>
            <p className="font-semibold text-gray-900 text-sm mb-3">
              La garantía no aplica cuando:
            </p>
            <ul className="space-y-2 text-gray-600 text-sm">
              {[
                "Hayan sido instaladas incorrectamente.",
                "Muestren daños originados por motivos ajenos a su funcionamiento.",
                "Tengan alguna modificación en su diseño original.",
                "Presenten signos visibles de abuso en su utilización.",
                "Se instalen en vehículos para los cuales no fueron diseñadas.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-red-400 font-bold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-xs mt-4 leading-relaxed">
              Para que la garantía de desgaste proceda, se debe tener un
              desgaste regular en las 4 pastillas de forma pareja.
            </p>
          </article>
        </div>
      </section>

      {/* Boletines */}
      <section className="px-6 lg:px-16 xl:px-24 py-14 bg-[#F5F6F8]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Nuestros Boletines
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/download/boletinInstalacion.jpg"
            download
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow w-full sm:w-72"
          >
            <img
              src="/download/boletinInstalacion.jpg"
              alt="Boletín Instalación"
              className="w-full object-contain border-b border-slate-100"
            />
            <div className="p-5">
              <p className="font-medium text-gray-900 text-sm">
                Recomendaciones de Instalación
              </p>
              <p className="text-naranja text-sm font-semibold mt-2 group-hover:underline">
                Descargar →
              </p>
            </div>
          </a>
        </div>
      </section>

      <ContactButton />
    </PlatinumLayout>
  );
}

export default PastillasPage;
