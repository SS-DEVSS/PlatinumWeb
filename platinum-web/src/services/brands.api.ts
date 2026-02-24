import axiosClient from "./axiosInstance";
import { Brand } from "../models/brand";

const client = axiosClient();

export const fetchBrands = async (signal?: AbortSignal): Promise<Brand[]> => {
  const { data } = await client.get("/brands", { signal });
  return data;
};
