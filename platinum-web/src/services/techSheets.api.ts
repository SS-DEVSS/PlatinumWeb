import axiosClient from "./axiosInstance";
import { TechnicalSheet } from "../models/techincalSheet";

const client = axiosClient();

export type TechnicalSheetsResponse = {
  technicalSheets: TechnicalSheet[];
  total: number;
  totalPages: number;
};

export const fetchTechSheets = async (
  page: number = 1,
  pageSize: number = 100,
  signal?: AbortSignal
): Promise<TechnicalSheetsResponse> => {
  const { data } = await client.get("/ts", { params: { page, pageSize }, signal });
  return {
    technicalSheets: data.technicalSheets || [],
    total: data.total || 0,
    totalPages: data.totalPages || 1,
  };
};
