import { useState } from "react";
import { Category } from "../models/category";
import axiosClient from "../services/axiosInstance";

export const useCategories = () => {
  const client = axiosClient();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const getCategoryById = async (id: Category["id"] | undefined) => {
    try {
      setLoading(true);
      const response = await client.get(`/categories/${id}?attributes=true`);
      setCategory(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };
  return { category, loading, getCategoryById, setCategory };
};
