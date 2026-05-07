import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import ContactButton from "../../components/ContactButton";
import { BlogPost } from "../../models/blog";
import { fetchBlogs } from "../../services/blogs.api";
import { parseBlogContent } from "../../utils/blogRelatedLinks";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const isAbortLikeError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; name?: string };
  return (
    maybeError.code === "ERR_CANCELED" ||
    maybeError.name === "CanceledError" ||
    maybeError.name === "AbortError"
  );
};

function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const backendSortOrder = sortOrder === "newest" ? "desc" : "asc";
  const showInitialLoading = loading && blogs.length === 0;
  const showRefreshingOverlay = loading && blogs.length > 0;
  const MIN_LOADING_MS = 450;

  useEffect(() => {
    const controller = new AbortController();
    const startedAt = Date.now();
    setLoading(true);
    setError(null);
    fetchBlogs(1, 100, backendSortOrder, controller.signal)
      .then(({ blogPosts }) => setBlogs(blogPosts))
      .catch((error: unknown) => {
        const isCanceled = isAbortLikeError(error);
        if (!isCanceled) {
          setError("No se pudieron cargar los blogs.");
          console.error("[Blogs] Error loading blog posts:", error);
        }
      })
      .finally(() => {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        window.setTimeout(() => setLoading(false), remaining);
      });

    return () => controller.abort();
  }, [backendSortOrder]);

  return (
    <PlatinumLayout>
      <main className="px-5 xl:px-40 py-6 lg:py-9">
        <h1 className="pb-6 lg:pb-9">Nuestros Blogs</h1>
        <p className="mb-6 text-sm text-slate-600">
          Noticias, lanzamientos y contenido técnico de nuestro catálogo.
        </p>
        {!loading && !error && blogs.length > 0 ? (
          <div className="mb-6">
            <label className="mr-2 text-sm text-slate-600" htmlFor="blogs-sort-order">
              Ordenar:
            </label>
            <select
              id="blogs-sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700"
            >
              <option value="newest">Mas reciente primero</option>
              <option value="oldest">Mas antiguo primero</option>
            </select>
          </div>
        ) : null}
        {showInitialLoading ? (
          <section className="relative mb-8 min-h-[55vh]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-4 border-naranja border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-600">Cargando blogs...</p>
              </div>
            </div>
          </section>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-slate-600">No hay blogs disponibles.</p>
        ) : (
          <section className="relative mb-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog) => {
                const parsed = parseBlogContent(blog.content || "");
                return (
                  <article
                    key={blog.id}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                  >
                    {blog.coverImagePath ? (
                      <img
                        src={blog.coverImagePath}
                        alt={blog.title}
                        className="h-48 w-full object-cover"
                      />
                    ) : null}
                    <section className="p-5">
                      <h3 className="text-xl font-semibold text-gris_oscuro">{blog.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                        {stripHtml(blog.description || parsed.htmlContent).slice(0, 180)}
                      </p>
                      <Link to={`/Blogs/${blog.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-naranja hover:underline">
                        Ver blog
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </section>
                  </article>
                );
              })}
            </div>
            {showRefreshingOverlay && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/65 backdrop-blur-[1px] rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 border-4 border-naranja border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-slate-600">Actualizando blogs...</p>
                </div>
              </div>
            )}
          </section>
        )}
        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}

export default Blogs;
