import { useState, useEffect } from 'react';
import { Brand } from "../models/brand";
import axiosClient from "../services/axiosInstance";

/**
 * Custom hook to fetch and manage brand data
 * Based on mobile implementation
 */
export const useBrands = () => {
  const client = axiosClient();
  const [brands, setBrands] = useState<Record<string, Brand>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getBrands();
  }, []);

  const getBrands = async () => {
    try {
      setLoading(true);
      const response = await client.get("/brands");
      processBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch brands"));
      setBrands({});
    } finally {
      setLoading(false);
    }
  };

  /**
   * Process brand data from API and convert it into a hashmap
   */
  const processBrands = (data: any[]) => {
    const brandsMap = data.reduce((acc: Record<string, Brand>, brand: any) => {
      acc[brand.id] = {
        id: brand.id,
        name: brand.name,
        logoImgUrl: brand.logoImgUrl,
        categories: brand.categories,
      };
      return acc;
    }, {});
    setBrands(brandsMap);
  };

  return {
    brands,
    loading,
    error,
    refreshBrands: getBrands
  };
};