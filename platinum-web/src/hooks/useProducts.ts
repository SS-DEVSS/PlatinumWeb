import { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";
import { Item } from "../models/item";

export const useProducts = () => {
  const client = axiosClient();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  // Remove auto-fetch to prevent infinite loops and duplicate calls
  // useEffect(() => {
  //   getProducts();
  // }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      // First, fetch page 1 to get total count
      const firstPage = await client.get("/products?type=&page=1&pageSize=100");
      const firstPageData = firstPage.data;
      const totalPages = firstPageData.totalPages || 1;
      
      // If there are more pages, fetch them all
      if (totalPages > 1) {
        const allPages = [firstPageData.products || []];
        
        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
          const pageData = await client.get(`/products?type=&page=${page}&pageSize=100`);
          allPages.push(pageData.data.products || []);
        }
        
        // Flatten all pages into a single array
        const allProducts = allPages.flat();
        
        setProducts(allProducts);
        return allProducts;
      } else {
        // Only one page
        setProducts(firstPageData.products || []);
        return firstPageData.products || [];
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      // First, fetch page 1 to get total count
      const firstPage = await client.get(`/products/category/${categoryId}?type=single&page=1&pageSize=100`);
      const firstPageData = firstPage.data;
      const totalPages = firstPageData.totalPages || 1;

      // If there are more pages, fetch them all
      if (totalPages > 1) {
        const allPages = [firstPageData.products || []];
        
        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
          const pageData = await client.get(`/products/category/${categoryId}?type=single&page=${page}&pageSize=100`);
          allPages.push(pageData.data.products || []);
        }
        
        // Flatten all pages into a single array
        const allProducts = allPages.flat();
        
        setProducts(allProducts);
        return allProducts;
      } else {
        // Only one page, use the first page data
        setProducts(firstPageData.products || []);
        return firstPageData.products || [];
      }
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await client.get(`/products/${id}`);
      setProduct(data);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    getProductById,
    products,
    loading,
    getProductsByCategory,
    refreshProducts: getProducts,
  };
};
