/**
 * @file ProductCardSkeleton.tsx
 * @brief Skeleton loader for product cards
 */

import { Card, CardContent } from "./ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-white flex items-center justify-center p-4">
        <div className="w-full h-full bg-gray-200 rounded"></div>
      </div>
      {/* Content skeleton */}
      <CardContent className="p-4 bg-gray-50">
        {/* SKU skeleton */}
        <div className="mb-2">
          <div className="bg-gray-300 h-3 w-20 rounded mb-1"></div>
          <div className="bg-gray-300 h-4 w-24 rounded"></div>
        </div>
        {/* Name skeleton */}
        <div className="mb-3">
          <div className="bg-gray-300 h-4 w-full rounded mb-2"></div>
          <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
        </div>
        {/* References skeleton */}
        <div className="mt-2">
          <div className="bg-gray-300 h-3 w-16 rounded mb-1"></div>
          <div className="flex gap-1 flex-wrap mt-1">
            <div className="bg-gray-300 h-5 w-16 rounded"></div>
            <div className="bg-gray-300 h-5 w-20 rounded"></div>
          </div>
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

export default ProductCardSkeleton;

