import { useEffect, useState } from "react";
import { Brand } from "../models/brand";
import axiosClient from "../services/axiosInstance";

export const useBrands = () => {
  const client = axiosClient();
  const [brands, setBrands] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getBrands();
  }, []);

  const getBrands = async () => {
    try {
      setLoading(true);
      const data = await client.get("/brands");
      setBrands(data.data[0]);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, brands };
};
