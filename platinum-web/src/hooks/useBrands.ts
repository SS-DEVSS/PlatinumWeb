import { useQuery } from "@tanstack/react-query";
import { fetchBrands } from "../services/brands.api";
import { Brand } from "../models/brand";
import { useMemo } from "react";

export const useBrands = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: ({ signal }) => fetchBrands(signal),
    staleTime: 30 * 60 * 1000,
  });

  const brands = useMemo(() => {
    if (!data) return {};
    return data.reduce((acc: Record<string, Brand>, brand: Brand) => {
      acc[brand.id] = {
        id: brand.id,
        name: brand.name,
        logoImgUrl: brand.logoImgUrl,
        categories: brand.categories,
      };
      return acc;
    }, {});
  }, [data]);

  return {
    brands,
    loading: isLoading,
    error: error instanceof Error ? error : null,
  };
};