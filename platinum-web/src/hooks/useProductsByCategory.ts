// hooks/useProductsByCategory.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../services/products.api";

export const useProductsByCategory = (
  categoryId?: string,
  page = 1,
  pageSize = 10,
  search = "",
  filters?: Record<string, string | number | boolean>,
  idSubcategory?: string | null
) => {
  return useQuery({
    queryKey: ["products", "category", categoryId, page, pageSize, search, filters, idSubcategory],
    queryFn: ({ signal }) =>
      fetchProductsByCategory(
        categoryId!,
        page,
        pageSize,
        search,
        filters,
        signal,
        idSubcategory
      ),
    enabled: !!categoryId,
    staleTime: 15 * 60 * 1000,
  });
};
