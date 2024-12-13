import { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";

export const useProducts = () => {
  const client = axiosClient();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await client.get("/products?type=");
      setProducts(data.products);
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
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
    loading,
  };
};
