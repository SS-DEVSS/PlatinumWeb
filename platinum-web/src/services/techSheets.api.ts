import axiosClient from "./axiosInstance";
import { TechnicalSheet } from "../models/techincalSheet";

const client = axiosClient();
const API_BASE_URL = import.meta.env.VITE_PLATINUM_DRIVELINE_API_URL || "http://localhost:4000/api/v1";

export type TechnicalSheetsResponse = {
  technicalSheets: TechnicalSheet[];
  total: number;
  totalPages: number;
};

export const fetchTechSheets = async (
  page: number = 1,
  pageSize: number = 100,
  signal?: AbortSignal,
  search?: string
): Promise<TechnicalSheetsResponse> => {
  const { data } = await client.get("/ts", {
    params: {
      page,
      pageSize,
      ...(search?.trim() ? { search: search.trim() } : {}),
    },
    signal,
  });
  return {
    technicalSheets: data.technicalSheets || [],
    total: data.total || 0,
    totalPages: data.totalPages || 1,
  };
};

export const getTechSheetDocumentUrl = (id: string): string => {
  return `${API_BASE_URL.replace(/\/$/, "")}/ts/${id}/document`;
};
