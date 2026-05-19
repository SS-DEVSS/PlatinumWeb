import { Card, CardContent } from "./ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="flex flex-col overflow-hidden animate-pulse">
      <div className="relative w-full aspect-square overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gray-200" />
      </div>
      <CardContent className="p-3 bg-gray-50 space-y-2">
        <div className="bg-gray-300 h-4 w-28 rounded" />
        <div className="bg-gray-300 h-3 w-full rounded" />
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

export default ProductCardSkeleton;
