// hooks/useProduct.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../services/products.api";

export const useProduct = (productId?: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => fetchProductById(productId!, signal),
    enabled: !!productId,
    staleTime: 15 * 60 * 1000,
  });
};
