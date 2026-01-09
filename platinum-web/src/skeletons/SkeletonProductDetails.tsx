import { Skeleton } from "../components/ui/skeleton";

const SkeletonProductDetails = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-20 py-4 sm:py-6 lg:py-8 flex flex-col lg:flex-row gap-4 lg:gap-8 xl:gap-12">
      <section className="w-full lg:basis-1/2">
        {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <Skeleton className="rounded-full py-3 sm:py-4 lg:py-5 px-12 sm:px-16 lg:px-24 w-full sm:w-auto" />
          <Skeleton className="rounded-2xl py-3 sm:py-4 lg:py-5 px-16 sm:px-20 lg:px-28 w-full sm:w-auto" />
        </div>
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mt-4 sm:mt-6">
          <div className="w-full sm:w-auto">
            <Skeleton className="rounded-lg max-w-full sm:max-w-[190px] py-3 sm:py-4 w-full sm:w-auto" />
            <Skeleton className="mt-3 py-3 sm:py-4 lg:py-5 px-8 sm:px-16 lg:px-40 w-full sm:w-auto" />
          </div>
          <div className="rounded-full w-full sm:w-auto">
            <Skeleton className="px-16 sm:px-20 lg:px-32 py-4 sm:py-5 lg:py-6 rounded-full w-full sm:w-auto" />
          </div>
        </section>
        <Skeleton className="mt-4 py-2 sm:py-3 max-w-full sm:max-w-[200px] px-8 sm:px-12 w-full sm:w-auto" />
        <div className="flex flex-wrap gap-2 py-3 sm:py-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="rounded-full px-8 sm:px-12 lg:px-20 py-3 sm:py-4 lg:py-5 flex-1 sm:flex-none min-w-[100px]" />
          ))}
        </div> */}
        <Skeleton className="w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] aspect-square mt-4" />
      </section>

      <section className="w-full lg:basis-1/2 space-y-4 sm:space-y-5 mt-4 lg:mt-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Skeleton className="w-full sm:w-1/2 lg:w-[60%] h-9 sm:h-10" />
          <Skeleton className="w-full sm:w-1/2 lg:w-[60%] h-9 sm:h-10" />
        </div>

        <Skeleton className="w-full h-48 sm:h-56 lg:h-60" />

        <Skeleton className="w-full h-32 sm:h-36 lg:h-40" />

        <Skeleton className="w-full h-32 sm:h-36 lg:h-40" />

        <Skeleton className="w-full h-16 sm:h-18 lg:h-20" />
      </section>
    </div>
  );
};

export default SkeletonProductDetails;
