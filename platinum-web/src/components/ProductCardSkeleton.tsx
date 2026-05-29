import { Card, CardContent } from "./ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="flex h-full min-h-[168px] flex-row overflow-hidden border border-gray-300 animate-pulse">
      <div className="relative w-[38%] min-w-[120px] max-w-[180px] shrink-0 border-r border-gray-200 bg-gray-100">
        <div className="h-full min-h-[140px] bg-gray-200" />
      </div>
      <CardContent className="flex flex-1 flex-col p-3">
        <div className="space-y-2 border-b border-gray-200 pb-2">
          <div className="h-3 w-28 rounded bg-gray-200" />
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="min-h-[2.75rem] space-y-1.5">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-4/5 rounded bg-gray-200" />
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-200 pt-2">
          <div className="h-3 w-10 rounded bg-gray-200" />
          <div className="h-3 w-28 rounded bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
};

export const ProductCardSkeletons = ({ count = 8 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
};

/** Skeleton for home "Nuevas Integraciones" cards (vertical CardProduct layout). */
export const FeaturedProductCardSkeleton = () => {
  return (
    <article className="flex w-full h-full flex-col items-center overflow-hidden rounded-[20px] border-t text-center shadow animate-pulse">
      <div className="h-[350px] w-full rounded-t-[20px] border-b bg-gray-200" />
      <section className="flex min-h-[180px] w-full flex-1 flex-col rounded-b-[20px] bg-gray-100 px-4 pb-6 pt-6">
        <div className="mx-auto mb-4 h-8 w-40 rounded-md bg-gray-200 xl:h-9" />
        <div className="mx-auto flex flex-1 flex-col gap-3">
          <div className="mx-auto h-4 w-32 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-48 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-36 rounded bg-gray-200" />
        </div>
      </section>
    </article>
  );
};

export const FeaturedProductCardSkeletons = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <FeaturedProductCardSkeleton key={`featured-skeleton-${index}`} />
      ))}
    </>
  );
};

export default ProductCardSkeleton;
