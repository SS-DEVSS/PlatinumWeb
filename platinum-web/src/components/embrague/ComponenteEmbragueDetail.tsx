import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ContactButton from "../ContactButton";
import PlatinumLayout from "../../Layouts/PlatinumLayout";

type RelatedProduct = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

type ComponenteEmbragueDetailProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  features: string[];
  related: RelatedProduct[];
};

function RelatedCardGrid({ title, href, imageSrc, imageAlt }: RelatedProduct) {
  return (
    <article className="flex h-full flex-col items-center rounded-2xl bg-white py-2 text-center shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md">
      <Link to={href} className="flex h-full w-full flex-col items-center pb-8">
        <h3 className="mt-9 text-[35px] font-medium text-gris_oscuro">
          {title}
        </h3>
        <p className="mt-4 text-lg font-regular text-naranja hover:underline">
          Más información
        </p>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="mb-10 mt-8 w-full max-w-[320px] object-contain px-6"
        />
      </Link>
    </article>
  );
}

function RelatedCardFeatured({
  title,
  href,
  imageSrc,
  imageAlt,
}: RelatedProduct) {
  return (
    <Link
      to={href}
      className="group mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md md:flex-row"
    >
      <div className="flex w-full items-center justify-center bg-slate-100 p-6 md:w-5/12 md:p-8">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-44 w-full max-w-[240px] object-contain md:h-56 md:max-w-[280px]"
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 p-6 text-center md:w-7/12 md:items-start md:p-10 md:text-left">
        <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Componente relacionado
        </span>
        <h3 className="text-3xl font-semibold text-gris_oscuro md:text-4xl">
          {title}
        </h3>
        <p className="text-base font-semibold text-naranja group-hover:underline md:text-lg">
          Más información →
        </p>
      </div>
    </Link>
  );
}

function ComponenteEmbragueDetail({
  title,
  imageSrc,
  imageAlt,
  features,
  related,
}: ComponenteEmbragueDetailProps) {
  return (
    <PlatinumLayout>
      <section>
        <section className="bg-gris_oscuro px-6 pb-10 pt-6 lg:px-16 lg:pb-12 xl:px-24">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              to="/Productos"
              className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a componentes
            </Link>
            <span className="text-slate-600">|</span>
            <span className="font-semibold uppercase tracking-widest text-slate-400">
              Sistema de embrague
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-bold text-white">{title}</span>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white">
            <div className="flex flex-col lg:flex-row">
              <div className="flex items-center justify-center bg-slate-100 p-8 lg:w-2/5">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-56 w-full max-w-sm object-contain md:h-64"
                />
              </div>
              <div className="flex flex-col items-start justify-center p-6 text-left lg:w-3/5 lg:p-8">
                <div className="mb-5 w-full space-y-2 text-left">
                  <span className="inline-flex w-fit rounded-full bg-naranja/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-naranja">
                    Embrague
                  </span>
                  <h1 className="text-left text-3xl font-bold leading-tight text-gris_oscuro md:text-4xl">
                    {title}
                  </h1>
                </div>
                <ul className="w-full space-y-3 text-left text-[15px] leading-relaxed text-slate-600">
                  {features.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 font-bold text-naranja">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-[#F5F6F8] px-6 py-12 lg:px-16 xl:px-24">
            <h2 className="mb-10 text-center text-2xl font-medium text-gris_oscuro md:text-3xl">
              También te puede interesar
            </h2>
            {related.length === 1 ? (
              <RelatedCardFeatured {...related[0]} />
            ) : (
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
                {related.map((item) => (
                  <RelatedCardGrid key={item.href} {...item} />
                ))}
              </div>
            )}
          </section>
        )}

        <ContactButton />
      </section>
    </PlatinumLayout>
  );
}

export default ComponenteEmbragueDetail;
