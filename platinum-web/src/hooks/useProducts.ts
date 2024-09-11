import { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";

export const useProducts = () => {
  const client = axiosClient();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client.get("/products").then((response) => setProducts(response.data));
  }, []);

  const getProductById = (id: string) => {
    client.get(`/products/${id}`).then((response) => {
      setProduct(response.data);
    });
  };

  return {
    product,
    getProductById,
    products,
  };
};
