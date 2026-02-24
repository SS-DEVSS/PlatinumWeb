import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Category } from "../models/category";
import {
  fetchAllCategories,
  fetchCategoryById,
  fetchCategoryFilters,
} from "../services/categories.api";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => fetchAllCategories(signal),
    staleTime: 30 * 60 * 1000,
  });

  const getCategoryById = useCallback(async (id?: Category["id"]) => {
    if (!id) return null;

    const queryKey = ["category", id];
    const cached = queryClient.getQueryData<Category>(queryKey);
    if (cached) return cached;

    const category = await fetchCategoryById(id);
    if (category) {
      queryClient.setQueryData(queryKey, category);
    }
    return category;
  }, [queryClient]);

  const getCategoryFilters = useCallback(async (
    id: string,
    filters?: Record<string, string | number | boolean>,
    signal?: AbortSignal
  ) => {
    try {
      return await fetchCategoryFilters(id, filters, signal);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && err.code === "ERR_CANCELED") throw err;
      console.error("Failed to fetch category filters:", err);
      return {};
    }
  }, []);

  return {
    categories,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    getCategoryById,
    getCategoryFilters,
  };
};
