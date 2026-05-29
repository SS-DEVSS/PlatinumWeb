import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchSubcategoriesByCategory } from "../services/subcategories.api";
import { Subcategory } from "../models/subcategory";

export function useSubcategoriesMap(categoryIds: string[]) {
  const queries = useQueries({
    queries: categoryIds.map((categoryId) => ({
      queryKey: ["subcategories", categoryId],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchSubcategoriesByCategory(categoryId, signal),
      enabled: Boolean(categoryId),
      staleTime: 15 * 60 * 1000,
    })),
  });

  const map = useMemo(() => {
    const result = new Map<string, Subcategory[]>();
    categoryIds.forEach((categoryId, index) => {
      const data = queries[index]?.data;
      if (data) result.set(categoryId, data);
    });
    return result;
  }, [categoryIds, queries]);

  const isLoading = queries.some((query) => query.isLoading);

  return { map, isLoading };
}
