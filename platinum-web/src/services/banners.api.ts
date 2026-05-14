import axiosClient from "./axiosInstance";
import { Banner } from "../models/banner";

const client = axiosClient();

type BannersResponse = {
  banners: Banner[] | null;
  total: number;
  totalPages: number;
};

export const fetchBanners = async (
  page: number = 1,
  pageSize: number = 50,
  signal?: AbortSignal
): Promise<BannersResponse> => {
  const { data } = await client.get("/banners", { params: { page, pageSize }, signal });
  return {
    banners: data.banners ?? [],
    total: data.total ?? 0,
    totalPages: data.totalPages ?? 1,
  };
};
