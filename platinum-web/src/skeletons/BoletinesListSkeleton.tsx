const bar = "animate-pulse rounded-md bg-slate-200";

function BoletinCardSkeleton() {
  return (
    <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-3 h-6 w-32 rounded-full ${bar}`} />
      <div className={`mb-3 h-7 w-4/5 ${bar}`} />
      <div className={`mb-2 h-4 w-full ${bar}`} />
      <div className={`mb-2 h-4 w-11/12 ${bar}`} />
      <div className={`mb-2 h-4 w-9/12 ${bar}`} />
      <div className={`mt-6 h-4 w-24 ${bar}`} />
    </article>
  );
}

const BoletinesListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BoletinCardSkeleton key={`boletin-skeleton-${index}`} />
      ))}
    </>
  );
};

export default BoletinesListSkeleton;
