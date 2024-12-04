import { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";

export const useProducts = () => {
  const client = axiosClient();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const { data } = await client.get("/products?type=");
    setProducts(data);
    return data;
  };

  const getProductById = async (id: string) => {
    const { data } = await client.get(`/products/${id}`);
    setProduct(data);
    return data;
  };

  return {
    product,
    getProductById,
    products,
  };
};
