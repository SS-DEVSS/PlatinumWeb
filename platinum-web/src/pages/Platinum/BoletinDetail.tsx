import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, ExternalLink, FileText } from "lucide-react";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import ContactButton from "../../components/ContactButton";
import { TechnicalSheet } from "../../models/techincalSheet";
import { fetchTechSheets } from "../../services/techSheets.api";
import { Skeleton } from "../../components/ui/skeleton";

function BoletinDetail() {
  const { id } = useParams<{ id: string }>();
  const [boletin, setBoletin] = useState<TechnicalSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchTechSheets(1, 300, controller.signal)
      .then(({ technicalSheets }) => {
        const selected = technicalSheets.find((sheet) => sheet.id === id) || null;
        setBoletin(selected);
        if (!selected) setError("No se encontró el boletín.");
      })
      .catch((err: any) => {
        const isCanceled =
          err?.code === "ERR_CANCELED" ||
          err?.name === "CanceledError" ||
          err?.name === "AbortError";
        if (!isCanceled) setError("No se pudo cargar el boletín.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  return (
    <PlatinumLayout>
      <main className="px-5 xl:px-40 py-6">
        <Link to="/Boletines" className="text-sm text-naranja hover:underline">
          ← Volver a boletines
        </Link>

        {loading ? (
          <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <Skeleton className="mb-4 h-6 w-36" />
            <Skeleton className="mb-3 h-8 w-3/4" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-11/12" />
            <Skeleton className="mb-6 h-4 w-9/12" />
            <Skeleton className="h-10 w-44" />
          </article>
        ) : error || !boletin ? (
          <p className="mt-6 text-sm text-slate-600">{error || "No se encontró el boletín."}</p>
        ) : (
          <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <FileText className="h-3.5 w-3.5" />
              Boletín técnico
            </div>
            <h1 className="text-3xl font-semibold text-gris_oscuro">{boletin.title}</h1>
            <p className="mt-4 text-slate-700 leading-7 text-sm lg:text-base">
              {boletin.description || "Boletín técnico"}
            </p>

            {boletin.products && boletin.products.length > 0 && (
              <section className="mt-5">
                <h2 className="font-semibold mb-2">Productos relacionados</h2>
                <ul className="list-disc pl-5">
                  {boletin.products.map((product) => (
                    <li key={product.id}>
                      <Link to={`/producto/${product.id}`} className="text-naranja hover:underline">
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {boletin.references && boletin.references.length > 0 && (
              <section className="mt-5">
                <h2 className="font-semibold mb-2">Referencias</h2>
                <ul className="list-disc pl-5">
                  {boletin.references.map((reference) => (
                    <li key={reference}>{reference}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={boletin.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir documento
              </a>
              <a
                href={boletin.url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 rounded-md bg-naranja px-4 py-2 text-white hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Descargar boletín
              </a>
            </div>
          </article>
        )}
        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}

export default BoletinDetail;
