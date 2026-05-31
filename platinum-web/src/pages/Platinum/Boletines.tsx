import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileSearch, FileText, Search } from "lucide-react";
import ContactButton from "../../components/ContactButton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { TechnicalSheet } from "../../models/techincalSheet";
import { fetchTechSheets } from "../../services/techSheets.api";
import BoletinesListSkeleton from "../../skeletons/BoletinesListSkeleton";

const isAbortLikeError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; name?: string };
  return (
    maybeError.code === "ERR_CANCELED" ||
    maybeError.name === "CanceledError" ||
    maybeError.name === "AbortError"
  );
};

function BoletinesEmptyState({
  hasSearch,
  onClearSearch,
}: {
  hasSearch: boolean;
  onClearSearch: () => void;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <FileSearch className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-gris_oscuro">
        {hasSearch ? "Sin resultados" : "Aún no hay boletines"}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
        {hasSearch
          ? "No encontramos boletines con ese criterio. Prueba con otro título, SKU o referencia."
          : "Cuando haya boletines técnicos publicados, aparecerán aquí."}
      </p>
      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-6 rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-gris_oscuro transition hover:border-naranja hover:text-naranja"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  );
}

function Boletines() {
  const [technicalSheets, setTechnicalSheets] = useState<TechnicalSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    const timeoutId = window.setTimeout(() => {
      fetchTechSheets(1, 200, controller.signal, searchFilter)
        .then(({ technicalSheets }) => {
          if (cancelled) return;
          setTechnicalSheets(technicalSheets);
        })
        .catch((err: unknown) => {
          if (cancelled || isAbortLikeError(err)) return;
          setTechnicalSheets([]);
          setError("No se pudieron cargar los boletines.");
          console.error("[Boletines] Error loading technical sheets:", err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchFilter, reloadNonce]);

  const hasTechnicalSheets = useMemo(
    () => technicalSheets.length > 0,
    [technicalSheets],
  );

  const hasSearch = searchFilter.trim().length > 0;

  return (
    <PlatinumLayout>
      <main className="px-5 py-6 lg:py-9 xl:px-40">
        <h1 className="pb-4">Nuestros Boletines</h1>
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

        <section
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          aria-busy={loading}
        >
          {loading ? (
            <BoletinesListSkeleton count={6} />
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setReloadNonce((n) => n + 1);
                }}
                className="mt-4 text-sm font-semibold text-naranja hover:underline"
              >
                Reintentar
              </button>
            </div>
          ) : !hasTechnicalSheets ? (
            <BoletinesEmptyState
              hasSearch={hasSearch}
              onClearSearch={() => setSearchFilter("")}
            />
          ) : (
            technicalSheets.map((boletin) => (
              <article
                key={boletin.id}
                className="group h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Link to={`/Boletines/${boletin.id}`} className="block h-full">
                  <section className="flex h-full flex-col p-5">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      <FileText className="h-3.5 w-3.5" />
                      Boletín técnico
                    </div>
                    <h5 className="line-clamp-2 text-xl font-semibold text-gris_oscuro">
                      {boletin.title}
                    </h5>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
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
                    <div className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-naranja">
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
