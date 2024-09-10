import { useEffect, useState } from "react";
import { Brand } from "../models/brand";
import axiosClient from "../services/axiosInstance";

export const useBrands = () => {
  const client = axiosClient();
  const [brands, setBrands] = useState<Brand | null>(null);
  useEffect(() => {
    client
      .get("/brands")
      .then((response) => {
        setBrands(response.data[1]);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);
  return { brands };
};
