import { Skeleton } from "../components/ui/skeleton";

const SkeletonProductDetails = () => {
  return (
    <div className="px-6 xl:px-20 py-8 flex flex-col md:flex-row gap-4 lg:gap-12">
      <section className="basis-1/2">
        <div className="flex justify-between items-center">
          <Skeleton className="flex gap-3 rounded-full py-5 px-24" />
          <Skeleton className="flex py-5 px-28 rounded-2xl gap-4" />
        </div>
        <section className="flex justify-between mt-6">
          <div>
            <Skeleton className="rounded-lg max-w-[190px] py-4" />
            <Skeleton className="mt-3 px-40 py-5" />
          </div>
          <div className="rounded-full">
            <Skeleton className="px-32 py-6 rounded-full" />
          </div>
        </section>
        <Skeleton className="mt-4 py-3 max-w-[200px] px-12" />
        <div className="flex flex-wrap gap-2 py-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="rounded-full px-20 py-5" />
          ))}
        </div>
        <Skeleton className="w-full min-h-[500px] aspecet-square" />
      </section>

      <section className="basis-1/2 space-y-5">
        <div className="flex gap-4">
          <Skeleton className="grid-cols-2 grid w-full h-10 2xl:w-[60%]" />
          <Skeleton className="grid-cols-2 grid w-full h-10 2xl:w-[60%]" />
        </div>

        <Skeleton className="w-full h-60" />

        <Skeleton className="h-40" />

        <Skeleton className="h-40" />

        <Skeleton className="h-20" />
      </section>
    </div>
  );
};

export default SkeletonProductDetails;
