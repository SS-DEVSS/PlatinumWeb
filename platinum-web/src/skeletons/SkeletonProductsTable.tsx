const SkeletonProductsTable = () => {
  return (
    <div className="w-full mt-6">
      <div className="animate-pulse">
        {/* View Toggle */}
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 h-8 w-16 sm:w-24 rounded"></div>
            <div className="bg-gray-200 h-8 w-16 sm:w-20 rounded"></div>
          </div>
        </div>

        {/* Cards Grid Skeleton (for card view) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
            <div key={card} className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="w-full aspect-square bg-gray-100"></div>
              <div className="p-3 sm:p-4 bg-gray-50">
                <div className="mb-2">
                  <div className="bg-gray-200 h-3 w-24 rounded mb-1"></div>
                  <div className="bg-gray-200 h-4 w-32 rounded"></div>
                </div>
                <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-3"></div>
                <div className="flex gap-1 flex-wrap">
                  <div className="bg-gray-200 h-5 w-16 rounded"></div>
                  <div className="bg-gray-200 h-5 w-20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton (hidden on mobile, shown on larger screens if needed) */}
        <div className="hidden lg:block">
          <div className="bg-white h-12 mb-1 rounded-t-lg flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 h-full p-3">
                <div className="bg-gray-200 h-full w-3/4 rounded"></div>
              </div>
            ))}
          </div>
          {[1, 2, 3].map((row) => (
            <div key={row} className="bg-white h-16 mb-1 flex">
              {[1, 2, 3, 4, 5].map((col) => (
                <div key={col} className="flex-1 h-full p-3 flex items-center">
                  {col === 1 ? (
                    <div className="bg-gray-200 h-10 w-10 rounded-md"></div>
                  ) : (
                    <div className="bg-gray-200 h-4 w-4/5 rounded"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:space-x-4 py-4 sm:py-6 bg-gray-50 rounded-lg px-3 sm:px-4 border border-gray-200 mt-6">
          <div className="bg-gray-200 h-4 sm:h-5 w-40 sm:w-48 rounded"></div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="bg-gray-200 h-9 w-9 rounded"></div>
            <div className="bg-gray-200 h-9 w-9 rounded"></div>
            <div className="bg-gray-200 h-9 w-24 sm:w-32 rounded"></div>
            <div className="bg-gray-200 h-9 w-9 rounded"></div>
            <div className="bg-gray-200 h-9 w-9 rounded"></div>
            <div className="bg-gray-200 h-9 w-20 sm:w-24 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductsTable;