import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState, useEffect, useMemo, useRef } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useProductsByCategory } from "../../hooks/useProductsByCategory";
import FilterSection from "../../components/FilterSection";
import ProductsTable from "../../components/ProductsTable";
import SkeletonCatalog from "../../skeletons/SkeletonCatalog";
import SkeletonProductsTable from "../../skeletons/SkeletonProductsTable";
import { Category } from "../../models/category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { AlertCircle, Filter, Search, LayoutGrid, Table2 } from "lucide-react";

/* ----------------------------------
CACHE INVALIDATION
 *import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Clear all products
queryClient.invalidateQueries({ queryKey: ["products"] });

// Clear single product
queryClient.invalidateQueries({ queryKey: ["product", productId] });
 * ---------------------------------- */

import { Brand } from "../../models/brand";

type formState = {
  filtroTipo: "NumParte" | "Vehiculo" | "Referencia";
  filtro: {
    referencia: string;
    numParte: string;
    vehiculo: {
      selectedFilters?: Array<{ attributeId: string, value: string }>;
    };
  };
  categoria: Category | null;
  marca: string | null;
};

const Catalogo = () => {
  const {
    loading: loadingBrands,
    brands: brandsMap,
  } = useBrands();

  const brands = useMemo(
    () => Object.values(brandsMap || {}),
    [brandsMap]
  );

  // ✅ STATE FIRST
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // pagination / filters (you were already using these implicitly)
  const [page] = useState(1);
  const [pageSize] = useState(10);
  const [search] = useState("");
  const [filters] = useState<Record<string, any> | undefined>(undefined);

  // ✅ THEN React Query hook
  const { data, isLoading } = useProductsByCategory(
    selectedCategory?.id,
    page,
    pageSize,
    search,
    filters
  );

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  /* ----------------------------------
   * Initialize brand + category once
   * ---------------------------------- */
  useEffect(() => {
    if (!selectedBrand && brands.length > 0) {
      const brand = brands[0];
      setSelectedBrand(brand);
      setSelectedCategory(brand.categories?.[0] || null);
    }
  }, [brands, selectedBrand]);

  /* ----------------------------------
   * Handlers
   * ---------------------------------- */
  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId) || null;
    setSelectedBrand(brand);
    setSelectedCategory(brand?.categories?.[0] || null);
  };

  const handleCategoryChange = (categoryId: string) => {
    if (!selectedBrand?.categories) return;

    const category =
      selectedBrand.categories.find((c) => c.id === categoryId) || null;

    setSelectedCategory(category);
  };

  return (
    <PlatinumLayout>
      <h1>Catálogo</h1>

      <div>Brand: {selectedBrand?.name}</div>
      <div>Category: {selectedCategory?.name}</div>
      <div>Products: {products.length}</div>

      {/* -------- Brand Select -------- */}
      <Select
        value={selectedBrand?.id}
        onValueChange={handleBrandChange}
        disabled={loadingBrands}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a brand" />
        </SelectTrigger>

        <SelectContent>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* -------- Category Select -------- */}
      <Select
        value={selectedCategory?.id}
        onValueChange={handleCategoryChange}
        disabled={!selectedBrand}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>

        <SelectContent>
          {selectedBrand?.categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* -------- Products -------- */}
      <div>
        <h2>Products</h2>

        {isLoading && (
          <div>Loading products...</div>
        )}

        {!isLoading && products.map((product) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </PlatinumLayout>
  );
};

export default Catalogo;