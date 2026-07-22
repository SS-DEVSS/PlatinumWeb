import { useEffect, useState } from "react";
import CardProduct from "./CardProduct";
import { FeaturedProductCardSkeletons } from "./ProductCardSkeleton";
import {
  fetchFeaturedProducts,
  FeaturedProduct,
} from "../services/products.api";
import { getDisplayImageUrl } from "../utils/imagePlaceholder";

const FEATURED_GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-2 nav:grid-cols-3 gap-5 px-6 sm:px-5 xl:px-24 2xl:px-40 items-stretch";

const FeaturedProductsSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFeaturedProducts();
        setFeaturedProducts(response.products);
      } catch (err: unknown) {
        console.error("Error loading featured products:", err);
        setError("Error al cargar nuevas integraciones");
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="pb-12" aria-busy="true" aria-label="Cargando nuevas integraciones">
        <h1 className="py-6 lg:py-9">Nuevas Integraciones</h1>
        <section className={FEATURED_GRID_CLASS}>
          <FeaturedProductCardSkeletons count={3} />
        </section>
      </div>
    );
  }

  if (error || featuredProducts.length === 0) {
    return null;
  }

  const formatApplicationText = (product: FeaturedProduct): string[] => {
    const texto: string[] = [];
    const app = product.featuredApplication;

    if (!app || !app.attributeValues || app.attributeValues.length === 0) {
      return texto;
    }

    // Filter attributes that have values, then sort by attribute order and take first 5
    const sortedAttributes = [...app.attributeValues]
      .filter((av) => {
        // Only include attributes that have a non-null value
        return (
          av.valueString ||
          (av.valueNumber !== null && av.valueNumber !== undefined) ||
          (av.valueBoolean !== null && av.valueBoolean !== undefined) ||
          av.valueDate
        );
      })
      .sort((a, b) => {
        // Sort by attribute order, with attributes without order going to the end
        const orderA = a.attribute?.order ?? 9999;
        const orderB = b.attribute?.order ?? 9999;
        return orderA - orderB;
      })
      .slice(0, 5); // Take first 5

    sortedAttributes.forEach((attr) => {
      let value: string | null = null;

      // Handle date values - extract year only
      if (attr.valueDate) {
        const date = new Date(attr.valueDate);
        if (!isNaN(date.getTime())) {
          value = date.getFullYear().toString();
        }
      } else if (attr.valueString) {
        value = String(attr.valueString);
      } else if (attr.valueNumber !== null && attr.valueNumber !== undefined) {
        value = String(attr.valueNumber);
      } else if (
        attr.valueBoolean !== null &&
        attr.valueBoolean !== undefined
      ) {
        value = String(attr.valueBoolean);
      }

      if (value) {
        // Display the value as-is, without custom formatting
        texto.push(value);
      }
    });

    return texto;
  };

  const getProductImage = (product: FeaturedProduct): string => {
    let url: string | null = null;
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      if (image.url) {
        url = image.url;
      } else if (image.path) {
        url = image.path.startsWith("http")
          ? image.path
          : `https://${import.meta.env.VITE_S3_BUCKET || "platinum-driveline-bucket"}.s3.${import.meta.env.VITE_AWS_REGION || "us-east-1"}.amazonaws.com/${image.path}`;
      }
    }
    return getDisplayImageUrl(url);
  };

  const getProductLink = (product: FeaturedProduct): string => {
    const productType = product.type || "SINGLE";
    if (productType === "KIT") {
      return `/kit/${product.id}`;
    }
    return `/producto/${product.id}`;
  };

  return (
    <div className="pb-12">
      <h1 className="py-6 lg:py-9">Nuevas Integraciones</h1>
      <section className={FEATURED_GRID_CLASS}>
        {featuredProducts.map((product) => (
          <CardProduct
            key={product.id}
            image={getProductImage(product)}
            title={product.sku}
            texto={formatApplicationText(product)}
            href={getProductLink(product)}
          />
        ))}
      </section>
    </div>
  );
};

export default FeaturedProductsSection;
