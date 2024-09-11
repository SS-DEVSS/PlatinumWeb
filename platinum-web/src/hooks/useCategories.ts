import { useState } from "react";
import { Category } from "../models/category";
import axiosClient from "../services/axiosInstance";

export const useCategories = () => {
  const client = axiosClient();

  // const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  const getCategoryById = (id: Category["id"] | undefined) => {
    client
      .get(`/categories/${id}?attributes=true`)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch category:", error);
      });
  };
  return { category, getCategoryById, setCategory };
};
