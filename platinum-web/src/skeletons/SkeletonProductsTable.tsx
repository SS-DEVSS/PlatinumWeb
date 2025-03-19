const SkeletonProductsTable = () => {
  return (
    <div className="w-full mt-8">
      <div className="animate-pulse">
        {/* Table header */}
        <div className="bg-white h-12 mb-1 rounded-t-lg flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 h-full p-3">
              <div className="bg-gray-200 h-full w-3/4 rounded"></div>
            </div>
          ))}
        </div>

        {/* Table rows */}
        {[1, 2, 3, 4, 5, 6].map((row) => (
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 px-4 py-2 bg-white rounded-b-lg">
          <div className="bg-gray-200 h-8 w-32 rounded"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-8 w-8 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductsTable;