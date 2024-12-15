import { Skeleton } from "../components/ui/skeleton";

const SkeletonCatalog = () => {
  return (
    <>
      <section className="bg-hero-catalog bg-cover pl-20 pb-14">
        <Skeleton className="pt-36 pb-20" />
        <div className="flex gap-10">
          <div className="flex flex-col">
            <Skeleton className="mb-4 h-4 w-10" />
            <div className="flex gap-5 bg-white rounded-lg h-full py-4 px-6"></div>
          </div>
          <div className="flex flex-col">
            <Skeleton className="mb-4" />
            <Skeleton className="w-20 max-h-10" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="mb-4" />
          </div>
        </div>
      </section>
      <Skeleton className="w-40 h-10" />
    </>
  );
};

export default SkeletonCatalog;
