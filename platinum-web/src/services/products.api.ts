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
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  const params: any = {
    type: "single",
    page,
    pageSize,
  };

  if (search) params.search = search;
  if (filters) params.filters = JSON.stringify(filters);

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
