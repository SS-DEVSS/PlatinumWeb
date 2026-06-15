// hooks/useProductsByCategory.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../services/products.api";
import type { CatalogProductSort } from "../models/catalogSort";

export const useProductsByCategory = (
  categoryId?: string,
  page = 1,
  pageSize = 10,
  search = "",
  filters?: Record<string, string | number | boolean>,
  idSubcategory?: string | string[] | null,
  sort?: CatalogProductSort
) => {
  return useQuery({
    queryKey: ["products", "category", categoryId, page, pageSize, search, filters, idSubcategory, sort],
    queryFn: ({ signal }) =>
      fetchProductsByCategory(
        categoryId!,
        page,
        pageSize,
        search,
        filters,
        signal,
        idSubcategory,
        sort
      ),
    enabled: !!categoryId,
    staleTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
