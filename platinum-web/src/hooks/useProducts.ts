import { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";
import { Item } from "../models/item";

export const useProducts = () => {
  const client = axiosClient();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      // First, fetch page 1 to get total count
      const firstPage = await client.get("/products?type=&page=1&pageSize=100");
      const firstPageData = firstPage.data;
      const total = firstPageData.total || 0;
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
        
        console.log(`[useProducts] Fetched all products:`, {
          totalCount: allProducts.length,
          total,
          totalPages,
          products: allProducts.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku, categoryId: p.category?.id }))
        });
        
        setProducts(allProducts);
        return allProducts;
      } else {
        // Only one page
        console.log(`[useProducts] Fetched products:`, {
          totalCount: firstPageData.products?.length || 0,
          total,
          totalPages,
          products: firstPageData.products?.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku, categoryId: p.category?.id }))
        });
        
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
      const total = firstPageData.total || 0;
      const totalPages = firstPageData.totalPages || 1;
      
      console.log(`[useProducts] First page response:`, {
        categoryId,
        total,
        totalPages,
        firstPageCount: firstPageData.products?.length || 0
      });

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
        
        console.log(`[useProducts] Fetched all products by category:`, {
          categoryId,
          totalCount: allProducts.length,
          total,
          totalPages,
          products: allProducts.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku, categoryId: p.category?.id }))
        });
        
        setProducts(allProducts);
        return allProducts;
      } else {
        // Only one page, use the first page data
        console.log(`[useProducts] Fetched products by category (single page):`, {
          categoryId,
          totalCount: firstPageData.products?.length || 0,
          total,
          totalPages,
          products: firstPageData.products?.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku, categoryId: p.category?.id }))
        });
        
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
