import axiosClient from "./axiosInstance";
import { Subcategory } from "../models/subcategory";

const client = axiosClient();

export type SubcategoryTreeNode = Subcategory;

/**
 * Fetch subcategories tree for a category (root-level nodes with optional children and productCount).
 */
export const fetchSubcategoriesByCategory = async (
  categoryId: string,
  signal?: AbortSignal
): Promise<SubcategoryTreeNode[]> => {
  const { data } = await client.get("/subcategories", {
    params: { categoryId, tree: "true" },
    signal,
  });
  return data ?? [];
};
