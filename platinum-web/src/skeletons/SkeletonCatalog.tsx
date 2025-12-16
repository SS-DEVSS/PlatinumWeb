import { Skeleton } from "../components/ui/skeleton";

const SkeletonCatalog = () => {
  return (
    <>
      <section className="bg-[#d3cfcf] pb-6 sm:pb-8 md:pb-10 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="pt-6 pb-4 sm:pb-5 md:pb-6">
          <Skeleton className="w-48 sm:w-64 md:w-80 h-8 sm:h-9 md:h-10" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 flex-wrap items-end">
          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 sm:flex-none">
            <Skeleton className="w-16 sm:w-20 h-4 sm:h-5" />
            <Skeleton className="rounded-lg h-9 sm:h-10 w-full sm:w-[200px] md:w-[220px]" />
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 sm:flex-none">
            <Skeleton className="w-20 sm:w-24 h-4 sm:h-5" />
            <Skeleton className="rounded-lg h-9 sm:h-10 w-full sm:w-[200px] md:w-[220px]" />
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-auto flex-1 sm:flex-none">
            <Skeleton className="w-24 sm:w-28 h-4 sm:h-5" />
            <Skeleton className="rounded-lg h-8 w-full sm:w-auto" />
          </div>
        </div>
      </section>
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8">
        <Skeleton className="w-32 sm:w-40 md:w-48 h-8 sm:h-10 mb-6" />
      </div>
    </>
  );
};

export default SkeletonCatalog;
