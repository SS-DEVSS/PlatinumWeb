import { useState } from "react";
import ContactButton from "../../components/ContactButton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import frenosImg from "../../assets/frenos.png";

function BoletinCard({
  href,
  imageSrc,
  title,
}: {
  href: string;
  imageSrc: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);

  const markLoaded = () => setLoaded(true);

  return (
    <a
      href={href}
      download
      className="group block w-full max-w-[288px] overflow-hidden rounded-2xl border border-slate-100 bg-white transition-shadow hover:shadow-md sm:w-72"
    >
      <div
        className="relative aspect-[3/4] w-full overflow-hidden border-b border-slate-200 bg-white"
        aria-busy={!loaded}
      >
        {!loaded && (
          <div
            className="absolute inset-0 z-10 flex flex-col gap-4 border border-slate-200 bg-white p-6 animate-pulse"
            aria-label="Cargando vista previa del boletín"
          >
            <div className="h-6 w-2/3 rounded-md bg-slate-300" />
            <div className="min-h-0 flex-1 rounded-lg bg-slate-200" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-4/5 rounded bg-slate-200" />
              <div className="h-3 w-3/5 rounded bg-slate-200" />
            </div>
          </div>
        )}
        <img
          src={imageSrc}
          alt={title}
          width={288}
          height={384}
          loading="lazy"
          decoding="async"
          onLoad={markLoaded}
          ref={(img) => {
            if (img?.complete) markLoaded();
          }}
          className={`h-full w-full object-contain object-center transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <div className="p-5">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-2 text-sm font-semibold text-naranja group-hover:underline">
          Descargar →
        </p>
      </div>
    </a>
  );
}

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
          <span className="text-white text-lg font-bold">
            Pastillas de Freno
          </span>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-slate-100 md:w-2/5 flex items-center justify-center p-8">
            <img
              src={frenosImg}
              alt="Pastillas de Freno"
              className="h-52 w-auto max-w-[260px] object-contain md:h-56"
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
        <h2 className="page-title mb-8">Nuestros Boletines</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <BoletinCard
            href="/download/boletinInstalacion.jpg"
            imageSrc="/download/boletinInstalacion.jpg"
            title="Recomendaciones de Instalación"
          />
        </div>
      </section>

      <ContactButton />
    </PlatinumLayout>
  );
}

export default PastillasPage;
