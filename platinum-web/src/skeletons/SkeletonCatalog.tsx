import { Skeleton } from "../components/ui/skeleton";

const SkeletonCatalog = () => {
  return (
    <>
      <section className="bg-[#d3cfcf] pb-14 pl-[160px]">
        <div className="py-28">
          <Skeleton className="w-80 h-[40px]" />
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-3">
            <Skeleton className="max-w-[140px] h-[60px]" />
            <Skeleton className="rounded-lg h-full py-4 px-6 w-80" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="max-w-[140px] h-[60px]" />
            <Skeleton className="rounded-lg h-full py-4 px-6 w-80" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="max-w-[140px] h-[60px]" />
            <Skeleton className="rounded-lg h-full py-4 px-6 w-80" />
          </div>
        </div>
      </section>
      <Skeleton className="w-40 h-10 my-8 ml-[160px]" />
    </>
  );
};

export default SkeletonCatalog;
