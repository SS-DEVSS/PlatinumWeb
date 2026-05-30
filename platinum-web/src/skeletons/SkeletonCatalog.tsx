const bar = "animate-pulse rounded-md bg-slate-300";

const SkeletonCatalog = () => {
  return (
    <section className="bg-[#E4E4E4] px-4 py-6 sm:px-6 sm:py-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className={`mx-auto mb-8 h-9 w-64 ${bar}`} />
        <div className={`mx-auto mb-10 h-4 max-w-xl ${bar}`} />

        <div className="mb-10 flex flex-wrap items-end justify-center gap-4">
          <div className={`h-10 w-full max-w-[220px] rounded-lg sm:w-[200px] ${bar}`} />
          <div className={`h-10 w-full max-w-[220px] rounded-lg sm:w-[200px] ${bar}`} />
          <div className={`h-10 w-32 rounded-lg ${bar}`} />
        </div>

        <div className="mx-auto flex max-w-2xl flex-nowrap justify-center gap-6 pb-1">
          {Array.from({ length: 2 }).map((_, index) => (
            <article
              key={`catalog-skeleton-${index}`}
              className="w-full max-w-[280px] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className={`aspect-square w-full ${bar}`} />
              <div className="space-y-2 p-4">
                <div className={`h-5 w-3/4 ${bar}`} />
                <div className={`h-4 w-1/2 ${bar}`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkeletonCatalog;
