import { useState, useEffect, useMemo, useCallback } from "react";
import { Category } from "../models/category";
import axiosClient from "../services/axiosInstance";

export const useCategories = () => {
  const client = useMemo(() => axiosClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Process category data from API
   */
  const processCategories = useCallback((data: any) => {
    if (!data) return;

    // Check if the data is an array (multiple categories)
    if (Array.isArray(data)) {
      const formattedCategories = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || "",
        imgUrl: cat.imgUrl,
        label: cat.name,
        value: cat.id,
        attributes: cat.attributes || []
      }));
      setCategories(formattedCategories);
      setCategory(null);
    }
    // If it's a single category object
    else if (typeof data === 'object' && data !== null) {
      // Ensure attributes are properly structured (with product, variant, reference, application)
      const attributes = data.attributes || {};
      const formattedCategory = {
        id: data.id,
        name: data.name,
        description: data.description || "",
        imgUrl: data.imgUrl,
        label: data.name,
        value: data.id,
        attributes: {
          product: attributes.product || [],
          variant: attributes.variant || [],
          reference: attributes.reference || [],
          application: attributes.application || [],
        },
        ...data
      };
      setCategory(formattedCategory);
      setCategories([formattedCategory]);
    }
  }, []);

  /**
   * Fetch all categories
   */
  const getAllCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await client.get("/categories");
      processCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch categories"));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [client, processCategories]);

  /**
   * Fetch a specific category by ID
   */
  const getCategoryById = useCallback(async (id: Category["id"] | undefined) => {
    if (!id) return null;

    try {
      setLoading(true);
      const response = await client.get(`/categories/${id}?attributes=true`);
      const categoryData = response.data;

      // Process the single category
      processCategories(categoryData);
      return categoryData;
    } catch (error) {
      console.error("Failed to fetch category:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch category"));
      return null;
    } finally {
      setLoading(false);
    }
  }, [client, processCategories]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  /**
   * Fetch filter options for a category
   */
  const getCategoryFilters = useCallback(async (id: string, filters?: Record<string, any>, signal?: AbortSignal) => {
    try {
      const params: any = {};
      if (filters) {
        params.filters = JSON.stringify(filters);
      }
      const response = await client.get(`/products/category/${id}/filters`, { params, signal });
      return response.data;
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.code === "ERR_CANCELED") {
        // Request was canceled, propagate or ignore
        throw error;
      }
      console.error("Failed to fetch category filters:", error);
      return {};
    }
  }, [client]);

  return {
    category,
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryFilters,
    setCategory,
    refreshCategories: getAllCategories
  };
};