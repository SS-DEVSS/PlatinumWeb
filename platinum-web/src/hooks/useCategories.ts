import { useState, useEffect, useCallback } from "react";
import { Category } from "../models/category";
import axiosClient from "../services/axiosInstance";

/* ----------------------------------
 * Helpers
 * ---------------------------------- */
const normalizeCategory = (data: any): Category => ({
  id: data.id,
  name: data.name,
  description: data.description || "",
  imgUrl: data.imgUrl,
  attributes: {
    product: data.attributes?.product || [],
    variant: data.attributes?.variant || [],
    reference: data.attributes?.reference || [],
    application: data.attributes?.application || [],
  },
});

/* ----------------------------------
 * Hook
 * ---------------------------------- */
export const useCategories = () => {
  const client = axiosClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /* ----------------------------------
   * Fetch all categories
   * ---------------------------------- */
  const getAllCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await client.get("/categories");
      setCategories(data.map(normalizeCategory));
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch categories"));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [client]);

  /* ----------------------------------
   * Fetch single category
   * ---------------------------------- */
  const getCategoryById = useCallback(
    async (id?: Category["id"]) => {
      if (!id) return null;

      try {
        setLoading(true);
        const { data } = await client.get(
          `/categories/${id}?attributes=true`
        );

        return normalizeCategory(data);
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch category"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  /* ----------------------------------
   * Fetch category filters
   * ---------------------------------- */
  const getCategoryFilters = useCallback(
    async (
      id: string,
      filters?: Record<string, any>,
      signal?: AbortSignal
    ) => {
      try {
        const params = filters
          ? { filters: JSON.stringify(filters) }
          : undefined;

        const { data } = await client.get(
          `/products/category/${id}/filters`,
          { params, signal }
        );

        return data;
      } catch (err: any) {
        if (err.code === "ERR_CANCELED") throw err;
        console.error("Failed to fetch category filters:", err);
        return {};
      }
    },
    [client]
  );

  /* ----------------------------------
   * Initial load
   * ---------------------------------- */
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  return {
    categories,
    loading,
    error,
    getAllCategories,
    getCategoryById,
    getCategoryFilters,
  };
};
