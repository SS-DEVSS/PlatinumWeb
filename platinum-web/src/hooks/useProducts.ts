import { useState, useMemo, useCallback } from "react";
import axiosClient from "../services/axiosInstance";
import { Item } from "../models/item";

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const productCache: Record<string, { data: any; timestamp: number }> = {};

// Helper function to create cache key
const createCacheKey = (
  categoryId: string,
  page: number,
  pageSize: number,
  search: string,
  filters?: Record<string, any>
): string => {
  const filtersStr = filters ? JSON.stringify(filters) : '';
  return `category_${categoryId}_page_${page}_size_${pageSize}_search_${search}_filters_${filtersStr}`;
};

// Helper function to check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Function to clear expired cache entries
const clearExpiredCache = () => {
  const now = Date.now();
  Object.keys(productCache).forEach(key => {
    if (now - productCache[key].timestamp >= CACHE_DURATION) {
      delete productCache[key];
    }
  });
};

// Function to clear all cache
export const clearProductsCache = () => {
  Object.keys(productCache).forEach(key => delete productCache[key]);
};

export const useProducts = () => {
  const client = useMemo(() => axiosClient(), []);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  // Remove auto-fetch to prevent infinite loops and duplicate calls
  // useEffect(() => {
  //   getProducts();
  // }, []);

  const getProducts = useCallback(async () => {
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
  }, [client]);

  const getProductsByCategory = useCallback(async (
    categoryId: string,
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    filters?: Record<string, any>,
    signal?: AbortSignal
  ) => {
    try {
      // Clear expired cache entries periodically
      clearExpiredCache();

      // Create cache key
      const cacheKey = createCacheKey(categoryId, page, pageSize, search, filters);

      // Check cache first (only if signal is not aborted)
      if (!signal?.aborted) {
        const cached = productCache[cacheKey];
        if (cached && isCacheValid(cached.timestamp)) {
          // Return cached data immediately without loading state
          setLoading(false);
          setProducts(cached.data.products || []);
          return {
            products: cached.data.products || [],
            total: cached.data.total || 0,
            totalPages: cached.data.totalPages || 1
          };
        }
      }

      setLoading(true);

      let url = `/products/category/${categoryId}?type=single&page=${page}&pageSize=${pageSize}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (filters && Object.keys(filters).length > 0) {
        // Pass filters as JSON string to avoid complex query params parsing issues on backend
        url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
      }

      const response = await client.get(url, { signal });
      const data = response.data;

      // Cache the response (only if not aborted)
      if (!signal?.aborted) {
        productCache[cacheKey] = {
          data: {
            products: data.products || [],
            total: data.total || 0,
            totalPages: data.totalPages || 1
          },
          timestamp: Date.now()
        };
      }

      // Expected response: { products: [], total: number, totalPages: number }
      setProducts(data.products || []);

      return {
        products: data.products || [],
        total: data.total || 0,
        totalPages: data.totalPages || 1
      };
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.code === "ERR_CANCELED") {
        // Request was canceled, do not update state or log error
        throw error;
      }
      console.error("Error fetching products by category:", error);
      setProducts([]);
      return { products: [], total: 0, totalPages: 0 };
    } finally {
      // Only turn off loading if not canceled (to avoid flickering if new request started)
      // Actually, logic here is tricky. If canceled, we usually don't want to touch state.
      // But setLoading(false) is fine as the next request will set it to true.
      // However, if we are in a race, we might turn it off after the NEW request turned it on.
      // Ideally, we check signal.aborted.
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [client]);

  const getProductById = useCallback(async (id: string, forceRefresh: boolean = false) => {
    try {
      const cacheKey = `product_${id}`;

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = productCache[cacheKey];
        if (cached && isCacheValid(cached.timestamp)) {
          setProduct(cached.data);
          return cached.data;
        }
      }

      setLoading(true);
      const { data } = await client.get(`/products/${id}`);

      // Cache the response
      productCache[cacheKey] = {
        data,
        timestamp: Date.now()
      };

      setProduct(data);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    product,
    getProductById,
    products,
    loading,
    getProductsByCategory,
    refreshProducts: getProducts,
    clearCache: clearProductsCache,
  };
};
