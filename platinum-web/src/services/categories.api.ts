import axiosClient from "./axiosInstance";
import { Category, Attribute } from "../models/category";

const client = axiosClient();

export const fetchAllCategories = async (signal?: AbortSignal): Promise<Category[]> => {
  const { data } = await client.get("/categories", { signal });
  return data.map(normalizeCategory);
};

export const fetchCategoryById = async (
  id: string,
  signal?: AbortSignal
): Promise<Category | null> => {
  const { data } = await client.get(`/categories/${id}?attributes=true`, { signal });
  return normalizeCategory(data);
};

export const fetchCategoryFilters = async (
  id: string,
  filters?: Record<string, string | number | boolean>,
  signal?: AbortSignal
): Promise<Record<string, string[]>> => {
  const params = filters ? { filters: JSON.stringify(filters) } : undefined;
  const { data } = await client.get(`/products/category/${id}/filters`, {
    params,
    signal,
  });
  return data;
};

const normalizeCategory = (data: {
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  attributes?: {
    product?: Attribute[];
    variant?: Attribute[];
    reference?: Attribute[];
    application?: Attribute[];
  };
}): Category => ({
  id: data.id,
  name: data.name,
  description: data.description || "",
  imgUrl: data.imgUrl,
  attributes: {
    product: data.attributes?.product || [],
    variant: data.attributes?.variant || [],
    reference: data.attributes?.reference || [],
    application: data.attributes?.application || [],
  },
});
