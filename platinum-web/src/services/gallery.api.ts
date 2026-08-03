import axiosClient from "./axiosInstance";
import { GalleryImage } from "../models/galleryImage";

const client = axiosClient();

type GalleryResponse = {
  images: GalleryImage[] | null;
  total: number;
  totalPages: number;
};

export const fetchGalleryImages = async (
  page: number = 1,
  pageSize: number = 100,
  signal?: AbortSignal
): Promise<GalleryResponse> => {
  const { data } = await client.get("/gallery", { params: { page, pageSize }, signal });
  return {
    images: data.images ?? [],
    total: data.total ?? 0,
    totalPages: data.totalPages ?? 1,
  };
};
