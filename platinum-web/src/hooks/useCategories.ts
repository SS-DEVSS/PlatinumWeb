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

  const buildFiltersQueryKey = useCallback(
    (id: string, filters?: Record<string, string | number | boolean>) => {
      if (!filters || Object.keys(filters).length === 0) {
        return ["categoryFilters", id, null] as const;
      }
      const sortedEntries = Object.entries(filters)
        .filter(([, value]) => value !== null && value !== undefined && value !== "")
        .sort(([a], [b]) => a.localeCompare(b));
      return ["categoryFilters", id, sortedEntries] as const;
    },
    []
  );

  const peekCategoryFilters = useCallback(
    (
      id: string,
      filters?: Record<string, string | number | boolean>
    ): Record<string, string[]> | undefined => {
      return queryClient.getQueryData<Record<string, string[]>>(
        buildFiltersQueryKey(id, filters)
      );
    },
    [queryClient, buildFiltersQueryKey]
  );

  const getCategoryFilters = useCallback(async (
    id: string,
    filters?: Record<string, string | number | boolean>,
    signal?: AbortSignal
  ) => {
    const queryKey = buildFiltersQueryKey(id, filters);
    const cached = queryClient.getQueryData<Record<string, string[]>>(queryKey);
    if (cached) return cached;

    try {
      const result = await queryClient.fetchQuery({
        queryKey,
        queryFn: ({ signal: querySignal }) =>
          fetchCategoryFilters(id, filters, signal ?? querySignal),
        staleTime: 30 * 60 * 1000,
      });
      return result ?? {};
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && err.code === "ERR_CANCELED") throw err;
      console.error("Failed to fetch category filters:", err);
      return {};
    }
  }, [queryClient, buildFiltersQueryKey]);

  return {
    categories,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    getCategoryById,
    getCategoryFilters,
    peekCategoryFilters,
  };
};
