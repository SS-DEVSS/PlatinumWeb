import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import ContactButton from "../../components/ContactButton";
import { Skeleton } from "../../components/ui/skeleton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { TechnicalSheet } from "../../models/techincalSheet";
import { fetchTechSheets } from "../../services/techSheets.api";

function Boletines() {
  const [technicalSheets, setTechnicalSheets] = useState<TechnicalSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchTechSheets(1, 200, controller.signal)
      .then(({ technicalSheets }) => setTechnicalSheets(technicalSheets))
      .catch((error: any) => {
        const isCanceled =
          error?.code === "ERR_CANCELED" ||
          error?.name === "CanceledError" ||
          error?.name === "AbortError";
        if (!isCanceled) {
          setError("No se pudieron cargar los boletines.");
          console.error("[Boletines] Error loading technical sheets:", error);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const hasTechnicalSheets = useMemo(() => technicalSheets.length > 0, [technicalSheets]);

  return (
    <PlatinumLayout>
      <main className="px-5 xl:px-40 py-6 lg:py-9">
        <h1 className="pb-6 lg:pb-9">Nuestros Boletines</h1>
        <p className="mb-6 text-sm text-slate-600">
          Consulta documentación técnica, productos relacionados y referencias aplicables.
        </p>
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <article
                key={`boletin-skeleton-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <Skeleton className="mb-3 h-6 w-28" />
                <Skeleton className="mb-2 h-6 w-11/12" />
                <Skeleton className="mb-4 h-4 w-4/5" />
                <Skeleton className="mb-2 h-3 w-full" />
                <Skeleton className="mb-1 h-3 w-10/12" />
                <Skeleton className="mt-4 h-4 w-24" />
              </article>
            ))
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : !hasTechnicalSheets ? (
            <p className="text-sm text-slate-600">No hay boletines disponibles.</p>
          ) : (
            technicalSheets.map((boletin) => (
              <article
                key={boletin.id}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Link to={`/Boletines/${boletin.id}`}>
                  <section className="p-5">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      <FileText className="h-3.5 w-3.5" />
                      Boletín técnico
                    </div>
                    <h5 className="text-xl font-semibold text-gris_oscuro line-clamp-2">{boletin.title}</h5>
                    <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-4">
                      {boletin.description || "Boletín técnico"}
                    </p>
                    {boletin.products && boletin.products.length > 0 ? (
                      <p className="mt-3 text-xs text-slate-500">
                        Productos: {boletin.products.map((product) => product.name).join(", ")}
                      </p>
                    ) : null}
                    {boletin.references && boletin.references.length > 0 ? (
                      <p className="mt-1 text-xs text-slate-500">
                        Referencias: {boletin.references.join(", ")}
                      </p>
                    ) : null}
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-naranja">
                      Ver detalle
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </section>
                </Link>
              </article>
            ))
          )}
        </section>
        <div className="mt-8">
          <ContactButton />
        </div>
      </main>
    </PlatinumLayout>
  );
}

export default Boletines;
