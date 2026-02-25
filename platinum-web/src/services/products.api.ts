// services/products.api.ts
import axiosClient from "../services/axiosInstance";
import { Item } from "../models/item";

const client = axiosClient();

export type ProductsResponse = {
  products: Item[];
  total: number;
  totalPages: number;
};

export const fetchProductsByCategory = async (
  categoryId: string,
  page: number,
  pageSize: number,
  search: string,
  filters?: Record<string, any>,
  signal?: AbortSignal,
  idSubcategory?: string | null
): Promise<ProductsResponse> => {
  const params: any = {
    type: "single",
    page,
    pageSize,
  };

  if (search) params.search = search;
  if (filters) params.filters = JSON.stringify(filters);
  if (idSubcategory) params.idSubcategory = idSubcategory;

  const { data } = await client.get(
    `/products/category/${categoryId}`,
    { params, signal }
  );

  return {
    products: data.products || [],
    total: data.total || 0,
    totalPages: data.totalPages || 1,
  };
};

export const fetchProductById = async (
  id: string,
  signal?: AbortSignal
): Promise<Item> => {
  const { data } = await client.get(`/products/${id}`, { signal });
  return data;
};

export type FeaturedProduct = {
  id: string;
  name: string;
  sku: string;
  description: string;
  type?: string;
  isFeatured: boolean;
  featuredApplicationId: string | null;
  featuredApplication?: {
    id: string;
    sku: string;
    origin: string | null;
    attributeValues?: Array<{
      id: string;
      idAttribute: string;
      valueString?: string | null;
      valueNumber?: number | null;
      valueBoolean?: boolean | null;
      valueDate?: string | null;
      attribute?: {
        id: string;
        name: string;
        displayName?: string;
        order: number;
      };
    }>;
  };
  images?: Array<{
    id: string;
    path: string;
    url?: string;
    order: number;
  }>;
};

export type FeaturedProductsResponse = {
  products: FeaturedProduct[];
};

export const fetchFeaturedProducts = async (
  signal?: AbortSignal
): Promise<FeaturedProductsResponse> => {
  const { data } = await client.get(`/products/featured`, { signal });
  return {
    products: data.products || [],
  };
};