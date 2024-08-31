import { useEffect, useState } from "react";
import { ProductSkeleton } from "../models/product";

const productsSample: ProductSkeleton[] = [
  {
    id: "m5gr84i9",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
  {
    id: "m5gr84i8",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
  {
    id: "m5gr84i7",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
  {
    id: "m5gr84i6",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
  {
    id: "m5gr84i5",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
  {
    id: "m5gr84i4",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
  {
    id: "m5gr84i3",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
  {
    id: "m5gr84i2",
    image: "kit_sample.png",
    sku: "GM09-215CVL-02",
    brand: "Chevrolet",
    model: "Nueva Generación",
    engine: "V8 8.1LTS 340HP",
    year: "2001 - 2007",
    diameter: 297,
  },
];

export const useProducts = () => {
  const [products, setProducts] = useState<ProductSkeleton[]>([]);
  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts(productsSample);
  }, []);

  const handleDeleteProduct = () => {};
  const handleUpdateProduct = () => {};

  return {
    products,
    handleDeleteProduct,
    handleUpdateProduct,
  };
};
