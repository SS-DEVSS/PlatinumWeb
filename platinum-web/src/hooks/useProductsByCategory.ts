// hooks/useProductsByCategory.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../services/products.api";

export const useProductsByCategory = (
  categoryId?: string,
  page = 1,
  pageSize = 10,
  search = "",
  filters?: Record<string, string | number | boolean>
) => {
  return useQuery({
    queryKey: ["products", "category", categoryId, page, pageSize, search, filters],
    queryFn: ({ signal }) =>
      fetchProductsByCategory(
        categoryId!,
        page,
        pageSize,
        search,
        filters,
        signal
      ),
    enabled: !!categoryId,
    staleTime: 15 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
