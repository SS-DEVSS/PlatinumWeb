import { useQuery } from "@tanstack/react-query";
import { fetchSubcategoriesByCategory } from "../services/subcategories.api";
import { Subcategory } from "../models/subcategory";

export const useSubcategoriesByCategory = (categoryId: string | undefined) => {
  return useQuery<Subcategory[]>({
    queryKey: ["subcategories", categoryId],
    queryFn: ({ signal }) =>
      fetchSubcategoriesByCategory(categoryId!, signal),
    enabled: !!categoryId,
    staleTime: 15 * 60 * 1000,
  });
};
