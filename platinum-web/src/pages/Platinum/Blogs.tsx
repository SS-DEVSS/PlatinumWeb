import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PlatinumLayout from "../../Layouts/PlatinumLayout";
import ContactButton from "../../components/ContactButton";
import { Skeleton } from "../../components/ui/skeleton";
import { BlogPost } from "../../models/blog";
import { fetchBlogs } from "../../services/blogs.api";
import { parseBlogContent } from "../../utils/blogRelatedLinks";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchBlogs(1, 100, controller.signal)
      .then(({ blogPosts }) => setBlogs(blogPosts))
      .catch((error: any) => {
        const isCanceled =
          error?.code === "ERR_CANCELED" ||
          error?.name === "CanceledError" ||
          error?.name === "AbortError";
        if (!isCanceled) {
          setError("No se pudieron cargar los blogs.");
          console.error("[Blogs] Error loading blog posts:", error);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <PlatinumLayout>
      <main className="px-5 xl:px-40 py-6 lg:py-9">
        <h1 className="pb-6 lg:pb-9">Nuestros Blogs</h1>
        <p className="mb-6 text-sm text-slate-600">
          Noticias, lanzamientos y contenido técnico de nuestro catálogo.
        </p>
        {loading ? (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <article
                key={`blog-skeleton-${index}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <Skeleton className="h-48 w-full" />
                <section className="p-5">
                  <Skeleton className="mb-3 h-6 w-10/12" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-2 h-4 w-11/12" />
                  <Skeleton className="h-4 w-24" />
                </section>
              </article>
            ))}
          </section>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-slate-600">No hay blogs disponibles.</p>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
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
          </section>
        )}
        <ContactButton />
      </main>
    </PlatinumLayout>
  );
}

export default Blogs;
