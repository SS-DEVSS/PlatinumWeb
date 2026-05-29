import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Search } from "lucide-react";
import ContactButton from "../../components/ContactButton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { TechnicalSheet } from "../../models/techincalSheet";
import { fetchTechSheets } from "../../services/techSheets.api";

const isAbortLikeError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; name?: string };
  return (
    maybeError.code === "ERR_CANCELED" ||
    maybeError.name === "CanceledError" ||
    maybeError.name === "AbortError"
  );
};

function Boletines() {
  const [technicalSheets, setTechnicalSheets] = useState<TechnicalSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const timeoutId = window.setTimeout(() => {
      fetchTechSheets(1, 200, controller.signal, searchFilter)
        .then(({ technicalSheets }) => setTechnicalSheets(technicalSheets))
        .catch((error: unknown) => {
          const isCanceled = isAbortLikeError(error);
          if (!isCanceled) {
            setError("No se pudieron cargar los boletines.");
            console.error("[Boletines] Error loading technical sheets:", error);
          }
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchFilter]);

  const hasTechnicalSheets = useMemo(
    () => technicalSheets.length > 0,
    [technicalSheets],
  );

  return (
    <PlatinumLayout>
      <main className="px-5 xl:px-40 py-6 lg:py-9">
        <h1 className="pb-4 text-center">Nuestros Boletines</h1>
        <div className="mx-auto mb-8 flex max-w-2xl flex-col items-center text-center">
          <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base">
            Consulta documentación técnica, productos relacionados y referencias
            aplicables.
          </p>
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar por boletín, producto, numero de parte o referencia..."
              className="h-12 w-full rounded-full border border-slate-300 bg-white pl-11 pr-5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-naranja focus:ring-2 focus:ring-naranja/20 md:text-base"
            />
          </div>
        </div>
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <section className="col-span-full mb-2 min-h-[220px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-4 border-naranja border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-600">Cargando boletines...</p>
              </div>
            </section>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : !hasTechnicalSheets ? (
            <p className="text-sm text-slate-600">
              No hay boletines disponibles.
            </p>
          ) : (
            technicalSheets.map((boletin) => (
              <article
                key={boletin.id}
                className="group h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Link to={`/Boletines/${boletin.id}`} className="block h-full">
                  <section className="p-5 h-full flex flex-col">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      <FileText className="h-3.5 w-3.5" />
                      Boletín técnico
                    </div>
                    <h5 className="text-xl font-semibold text-gris_oscuro line-clamp-2">
                      {boletin.title}
                    </h5>
                    <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-4">
                      {boletin.description || "Boletín técnico"}
                    </p>
                    {boletin.products && boletin.products.length > 0 ? (
                      <p className="mt-3 text-xs text-slate-500">
                        Productos:{" "}
                        {boletin.products
                          .map((product) =>
                            product.sku
                              ? `${product.name} (${product.sku})`
                              : product.name,
                          )
                          .join(", ")}
                      </p>
                    ) : null}
                    {boletin.references && boletin.references.length > 0 ? (
                      <p className="mt-1 text-xs text-slate-500">
                        Referencias: {boletin.references.join(", ")}
                      </p>
                    ) : null}
                    <div className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-naranja">
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
