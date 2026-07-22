import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import ContactButton from "../../components/ContactButton";
import { BlogPost } from "../../models/blog";
import { fetchBlogById } from "../../services/blogs.api";
import { parseBlogContent } from "../../utils/blogRelatedLinks";
import { Skeleton } from "../../components/ui/skeleton";

const isAbortLikeError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; name?: string };
  return (
    maybeError.code === "ERR_CANCELED" ||
    maybeError.name === "CanceledError" ||
    maybeError.name === "AbortError"
  );
};

function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [productNamesById, setProductNamesById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (!id) {
      setError("Noticia inválida.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchBlogById(id, controller.signal)
      .then((data) => setBlog(data))
      .catch((error: unknown) => {
        const isCanceled = isAbortLikeError(error);
        if (!isCanceled) {
          setError("No se pudo cargar la noticia.");
          console.error("[BlogDetail] Error loading blog:", error);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  const parsed = useMemo(
    () => parseBlogContent(blog?.content || ""),
    [blog?.content]
  );

  useEffect(() => {
    const ids = parsed.relatedProductIds;
    if (ids.length === 0) {
      setProductNamesById({});
      return;
    }
    let cancelled = false;
    Promise.all(
      ids.map(async (productId) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_PLATINUM_DRIVELINE_API_URL || "http://localhost:4000/api/v1"}/products/${productId}`
          );
          if (!response.ok) return [productId, productId] as const;
          const product = await response.json();
          return [productId, product?.name || productId] as const;
        } catch {
          return [productId, productId] as const;
        }
      })
    ).then((entries) => {
      if (cancelled) return;
      setProductNamesById(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [parsed.relatedProductIds]);

  return (
    <PlatinumLayout>
      <main className="px-5 xl:px-40 py-6">
        <div className="py-6">
          <Link to="/Blogs" className="text-sm text-naranja hover:underline">
            ← Volver a noticias
          </Link>
        </div>
        {loading ? (
          <article className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <Skeleton className="mb-6 h-64 w-full rounded-lg" />
            <Skeleton className="mb-3 h-8 w-3/4" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-11/12" />
            <Skeleton className="mb-6 h-4 w-10/12" />
            <Skeleton className="mb-3 h-5 w-40" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
          </article>
        ) : error || !blog ? (
          <p className="text-sm text-slate-600">{error || "Noticia no encontrada."}</p>
        ) : (
          <article className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            {blog.coverImagePath ? (
              <img
                src={blog.coverImagePath}
                alt={blog.title}
                className="w-full max-h-[460px] object-cover rounded-lg mb-6"
              />
            ) : null}
            <h1 className="!text-left text-gris_oscuro">{blog.title}</h1>
            <div
              className="mt-4 text-slate-700 leading-7 [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
            <hr className="my-6" />
            <div
              className="prose max-w-none [&_img]:rounded-md [&_img]:max-h-[420px] [&_img]:object-cover"
              dangerouslySetInnerHTML={{ __html: parsed.htmlContent }}
            />

            {(parsed.relatedProductIds.length > 0 ||
              parsed.relatedReferences.length > 0 ||
              parsed.relatedApplications.length > 0) && (
              <section className="mt-8 border-t pt-5">
                <h2 className="text-xl font-semibold mb-3">Contenido relacionado</h2>
                {parsed.relatedProductIds.length > 0 && (
                  <div className="mb-3">
                    <p className="font-medium">Productos</p>
                    <ul className="list-disc pl-5">
                      {parsed.relatedProductIds.map((productId) => {
                        return (
                          <li key={productId}>
                            <Link to={`/producto/${productId}`} className="text-naranja hover:underline">
                              {productNamesById[productId] || productId}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {parsed.relatedReferences.length > 0 && (
                  <div className="mb-3">
                    <p className="font-medium">Referencias</p>
                    <ul className="list-disc pl-5">
                      {parsed.relatedReferences.map((reference) => (
                        <li key={reference}>{reference}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsed.relatedApplications.length > 0 && (
                  <div>
                    <p className="font-medium">Aplicaciones</p>
                    <ul className="list-disc pl-5">
                      {parsed.relatedApplications.map((application) => (
                        <li key={application}>{application}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </article>
        )}
        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}

export default BlogDetail;
