const bar = "animate-pulse rounded-md bg-gray-200";

const SkeletonBoletinDetail = () => {
  return (
    <article
      className="mt-6 min-h-[420px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:rounded-3xl lg:p-8"
      aria-busy="true"
      aria-label="Cargando boletín"
    >
      <div className={`mb-4 h-7 w-36 rounded-full ${bar}`} />
      <div className={`mb-4 h-9 w-full max-w-2xl rounded-lg lg:h-10 ${bar}`} />
      <div className={`mb-2 h-4 w-full ${bar}`} />
      <div className={`mb-2 h-4 w-11/12 ${bar}`} />
      <div className={`mb-2 h-4 w-10/12 ${bar}`} />
      <div className={`mb-8 h-4 w-8/12 ${bar}`} />

      <section className="mt-5 space-y-3">
        <div className={`h-5 w-48 ${bar}`} />
        <div className="space-y-2 pl-5">
          <div className={`h-4 w-56 ${bar}`} />
          <div className={`h-4 w-64 ${bar}`} />
          <div className={`h-4 w-52 ${bar}`} />
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <div className={`h-5 w-32 ${bar}`} />
        <div className="space-y-2 pl-5">
          <div className={`h-4 w-40 ${bar}`} />
          <div className={`h-4 w-44 ${bar}`} />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className={`h-10 w-44 rounded-full ${bar}`} />
        <div className={`h-10 w-48 rounded-full ${bar}`} />
      </div>
    </article>
  );
};

export default SkeletonBoletinDetail;
