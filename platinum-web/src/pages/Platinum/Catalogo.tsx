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
import { useState, useEffect, useMemo } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useProducts } from "../../hooks/useProducts";
import FilterSection from "../../components/FilterSection";
import ProductsTable from "../../components/ProductsTable";
import SkeletonCatalog from "../../skeletons/SkeletonCatalog";
import SkeletonProductsTable from "../../skeletons/SkeletonProductsTable";
import { Category } from "../../models/category";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  const { loading: loadingBrands, brands: brandsMap, error: brandsError } = useBrands();
  const {
    loading: loadingCategories,
    category,
    getCategoryById,
    getCategoryFilters,
    error: categoriesError
  } = useCategories();
  const { getProductsByCategory, products: categoryProducts } = useProducts();

  // Convert brandsMap to array for rendering
  const brands = useMemo(() => Object.values(brandsMap || {}), [brandsMap]);

  // Adding loading state for products table
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  // Track if initial load has happened
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  // Add state to track product loading errors
  const [productsError, setProductsError] = useState<string | null>(null);

  // State to track available categories based on selected brand
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // State for server-side filter options
  const [filterOptions, setFilterOptions] = useState<Record<string, (string | number | boolean | Date)[]> | undefined>(undefined);

  const [form, setForm] = useState<formState>({
    filtroTipo: "NumParte",
    filtro: {
      referencia: "",
      numParte: "",
      vehiculo: {
        selectedFilters: []
      },
    },
    categoria: null,
    marca: null,
  });

  // Debounce search term changes to reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only set page to 1 if it's not already 1 to avoid redundant effect triggers
      setPage(prev => prev !== 1 ? 1 : prev);
    }, 500);
    return () => clearTimeout(timer);
  }, [form.filtro.numParte, form.filtro.referencia]);

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPage(newPageIndex + 1); // Convert 0-indexed to 1-indexed
    setPageSize(newPageSize);
  };

  // Update available categories when brand changes
  useEffect(() => {
    if (!brands || brands.length === 0 || !form.marca) return;

    const selectedBrand = brandsMap ? brandsMap[form.marca] : null;
    if (selectedBrand) {
      setAvailableCategories(selectedBrand.categories || []);

      // If brand has categories, select the first one
      if (selectedBrand.categories && selectedBrand.categories.length > 0) {
        setForm(prevForm => ({
          ...prevForm,
          categoria: selectedBrand.categories![0],
          // Reset vehicle filters when changing brand
          filtro: {
            ...prevForm.filtro,
            vehiculo: {
              selectedFilters: []
            }
          }
        }));
      } else {
        // If brand has no categories, clear category selection
        setForm(prevForm => ({
          ...prevForm,
          categoria: null
        }));
      }
    }
  }, [form.marca, brandsMap, brands]);

  // Handle initial brand selection
  useEffect(() => {
    if (brands && brands.length > 0 && !form.marca) {
      // Select first brand by default
      const firstBrand = brands[0];
      if (firstBrand) {
        setForm(prevForm => ({
          ...prevForm,
          marca: firstBrand.id
        }));
      }
    }
  }, [brands, form.marca]);

  const selectedFiltersHash = JSON.stringify(form.filtro.vehiculo.selectedFilters);

  // Fetch category data and filters when selected category changes
  useEffect(() => {
    const controller = new AbortController();

    if (!form.categoria) return;

    const categoryId = form.categoria.id;

    // Only fetch category if it's different from current or not loaded
    if (!category || category.id !== categoryId) {
      setProductsError(null);
      // Reset filter options only when category actually changes
      setFilterOptions(undefined);

      getCategoryById(categoryId)
        .then(() => {
          // Initial fetch of filters (no filters applied) for the base dropdowns
          if (controller.signal.aborted) return;
          return getCategoryFilters(categoryId, undefined, controller.signal);
        })
        .then((options) => {
          if (controller.signal.aborted) return;
          if (options) {
            setFilterOptions(options);
          }
        })
        .catch((err: Error) => {
          if (controller.signal.aborted) return;
          if (err.name !== 'CanceledError' && (err as any).code !== "ERR_CANCELED") {
            setProductsError(`Error al cargar categoría: ${err.message || 'Ocurrió un error inesperado'}`);
          }
        });
    }

    return () => controller.abort();
  }, [form.categoria?.id, category, getCategoryById, getCategoryFilters]); // Added category

  // Fetch filtered options when vehicle filters change
  useEffect(() => {
    const controller = new AbortController();

    // Use category from form
    const currentCategory = form.categoria;
    if (!currentCategory || form.filtroTipo !== "Vehiculo") return;

    const categoryId = currentCategory.id;
    const currentFilters = form.filtro.vehiculo.selectedFilters;

    if (currentFilters && currentFilters.length > 0) {
      // Convert to dictionary for backend
      const filtersDict: Record<string, any> = {};
      currentFilters.forEach(f => {
        filtersDict[f.attributeId] = f.value;
      });

      getCategoryFilters(categoryId, filtersDict, controller.signal)
        .then((options) => {
          if (controller.signal.aborted) return;
          if (options) {
            setFilterOptions(options);
          }
        })
        .catch(console.error);
    } else {
      // If filters cleared, re-fetch base options
      getCategoryFilters(categoryId, undefined, controller.signal)
        .then((options) => {
          if (controller.signal.aborted) return;
          if (options) setFilterOptions(options);
        })
        .catch(console.error);
    }

    return () => controller.abort();
  }, [form.categoria, selectedFiltersHash, form.filtroTipo, getCategoryFilters]);

  // Fetch products when category, filters, or pagination changes
  useEffect(() => {
    const controller = new AbortController();

    const currentCategory = form.categoria;
    if (!currentCategory) return;

    const categoryId = currentCategory.id;
    setLoadingProducts(true);

    // Determine search query
    let searchQuery = "";
    if (form.filtroTipo === "NumParte") {
      searchQuery = form.filtro.numParte;
    } else if (form.filtroTipo === "Referencia") {
      searchQuery = form.filtro.referencia;
    }

    // Prepare vehicle filters for server-side
    let filters: Record<string, string | number | boolean | Date> | undefined = undefined;
    if (form.filtroTipo === "Vehiculo" && form.filtro.vehiculo.selectedFilters && form.filtro.vehiculo.selectedFilters.length > 0) {
      filters = {};
      form.filtro.vehiculo.selectedFilters.forEach(f => {
        filters![f.attributeId] = f.value;
      });
    }

    getProductsByCategory(categoryId, page, pageSize, searchQuery, filters, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;

        if (result && 'totalPages' in result) {
          setTotalPages(result.totalPages);
          setTotalItems(result.total);
        }
        setInitialLoad(true);
        setLoadingProducts(false);
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;

        if (err.name !== 'CanceledError' && (err as any).code !== "ERR_CANCELED") {
          setProductsError(`Error al cargar productos: ${err.message || 'Ocurrió un error inesperado'}`);
        }
        setLoadingProducts(false);
      });

    return () => controller.abort();
  }, [
    form.categoria,
    page,
    pageSize,
    form.filtroTipo,
    form.filtro.numParte,
    form.filtro.referencia,
    selectedFiltersHash,
    getProductsByCategory
  ]);

  // ... (handlers)

  const handleBrandChange = (brandId: string) => {
    if (form.marca === brandId) return;

    setForm(prevForm => ({
      ...prevForm,
      marca: brandId,
      // Reset filters when changing brand
      filtro: {
        numParte: "",
        referencia: "",
        vehiculo: {
          selectedFilters: []
        }
      }
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = availableCategories.find(
      (category) => category.id === categoryId
    );

    if (selectedCategory && (!form.categoria || form.categoria.id !== categoryId)) {
      setForm((prevForm) => ({
        ...prevForm,
        categoria: selectedCategory,
        filtro: {
          ...prevForm.filtro,
          // Clear vehicle filters when category changes
          vehiculo: {
            selectedFilters: []
          }
        }
      }));

      // Explicitly trigger loading and fetch for category change
      setProductsError(null);
      setLoadingProducts(true);

      // Reset pagination
      setPage(1);

      getCategoryById(categoryId)
        .then(() => {
          return getCategoryFilters(categoryId);
        })
        .then((options) => {
          if (options) setFilterOptions(options);
          // Fetch products for this category
          return getProductsByCategory(categoryId);
        })
        .catch((err: Error) => {
          setProductsError(`Error al cargar categoría: ${err.message || 'Ocurrió un error inesperado'}`);
          setLoadingProducts(false);
        });
    }
  };

  // Removed unused handlers: handleReference, handleNumParte

  const handleVehicleFilterChange = (filters: Array<{ attributeId: string, value: string }>) => {
    setForm((prevform) => ({
      ...prevform,
      filtro: {
        ...prevform.filtro,
        vehiculo: {
          ...prevform.filtro.vehiculo,
          selectedFilters: filters
        }
      },
    }));
  };

  const getFilterComponent = () => {
    switch (form.filtroTipo) {
      case "NumParte":
        return (
          <div className="flex flex-col gap-4 mb-6">
            <Label className="font-semibold text-base">Número de Parte:</Label>
            <Input
              placeholder="Buscar por número de parte..."
              value={form.filtro.numParte}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  filtro: {
                    ...prevForm.filtro,
                    numParte: e.target.value,
                  },
                }))
              }
              className="bg-white h-12"
            />
          </div>
        );
      case "Referencia":
        return (
          <div className="flex flex-col gap-4 mb-6">
            <Label className="font-semibold text-base">Referencia:</Label>
            <Input
              placeholder="Buscar por referencia..."
              value={form.filtro.referencia}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  filtro: {
                    ...prevForm.filtro,
                    referencia: e.target.value,
                  },
                }))
              }
              className="bg-white h-12"
            />
          </div>
        );
      case "Vehiculo": {
        // Use the fetched category (with full attributes) if available, otherwise use form.categoria
        const categoryForFilters = category && category.attributes ? category : form.categoria;
        return (
          <FilterSection
            category={categoryForFilters}
            filtroInfo={form.filtro}
            onFilterChange={handleVehicleFilterChange}
            products={categoryProducts} // Pass products for filtering logic (legacy fallback)
            filterOptions={filterOptions} // Pass server-side filter options
          />
        );
      }
    }
  };

  // Find the current selected brand object
  const selectedBrand = form.marca ? brandsMap[form.marca] : null;

  // Determine if we have any errors to display
  const hasError = brandsError || categoriesError || productsError;
  const errorMessage = brandsError || categoriesError || productsError;

  return (
    <PlatinumLayout>
      {/* Error Alert */}
      {hasError && (
        <Alert variant="destructive" className="mx-20 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {typeof errorMessage === 'string' ? errorMessage : errorMessage?.message || 'Ocurrió un error'}
          </AlertDescription>
        </Alert>
      )}

      {loadingCategories || loadingBrands ? (
        <SkeletonCatalog />
      ) : (
        <>
          <section className="bg-hero-catalog bg-cover pl-20 pb-14">
            <h2 className="font-bold text-4xl pt-20 pb-10 text-white">
              Catálogo Electrónico
            </h2>
            <div className="flex gap-10 flex-wrap">
              <div className="flex flex-col flex-wrap">
                <Label className="font-semibold text-base mb-4 text-white">
                  Marca:
                </Label>
                <Select onValueChange={handleBrandChange} value={form.marca || ''}>
                  <SelectTrigger className="h-[52px] w-[250px]">
                    {selectedBrand ? (
                      <div className="flex items-center">
                        {selectedBrand.logoImgUrl ? (
                          <img
                            className="w-12 h-12 object-contain"
                            src={selectedBrand.logoImgUrl}
                            alt={selectedBrand.name}
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <span className="ml-2 mx-4">{selectedBrand.name}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccionar Marca" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Marcas</SelectLabel>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          <div className="flex items-center">
                            {brand.logoImgUrl ? (
                              <img
                                className="w-8 h-8 mr-2 object-contain"
                                src={brand.logoImgUrl}
                                alt={brand.name}
                              />
                            ) : (
                              <div className="w-8 h-8 mr-2 flex items-center justify-center bg-gray-200 rounded">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            {brand.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label className="font-semibold text-base mb-4 text-white">
                  Categoría:
                </Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={form.categoria?.id || ''}
                  disabled={availableCategories.length === 0}
                >
                  <SelectTrigger className="h-[52px] w-[250px]">
                    {form.categoria ? (
                      <div className="flex items-center">
                        {form.categoria.imgUrl ? (
                          <img
                            className="w-12 h-12 object-contain"
                            src={form.categoria.imgUrl}
                            alt={form.categoria.name}
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <span className="ml-2 mx-4">{form.categoria.name}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccionar Categoría" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorías</SelectLabel>
                      {availableCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            {category.imgUrl ? (
                              <img
                                className="w-8 h-8 mr-2 object-contain"
                                src={category.imgUrl}
                                alt={category.name}
                              />
                            ) : (
                              <div className="w-12 h-12 mr-2 flex items-center justify-center bg-gray-200 rounded">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <Label className="font-semibold text-base mb-4 text-white">
                  Filtrar Por:
                </Label>
                <div className="flex gap-2 rounded-lg bg-white p-2 items-center h-[52px]">
                  <Button
                    type="button"
                    size={"lg"}
                    variant={"ghost"}
                    onClick={(e) => {
                      e.preventDefault();
                      setForm((prevForm) => ({
                        ...prevForm,
                        filtroTipo: "NumParte",
                        filtro: {
                          ...prevForm.filtro,
                          referencia: "",
                          numParte: "",
                        },
                      }));
                    }}
                    className={
                      form.filtroTipo === "NumParte"
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                        : "text-black"
                    }
                  >
                    Número de Parte
                  </Button>
                  <Button
                    type="button"
                    size={"lg"}
                    variant={"ghost"}
                    onClick={(e) => {
                      e.preventDefault();
                      setForm((prevForm) => ({
                        ...prevForm,
                        filtroTipo: "Referencia",
                        filtro: {
                          ...prevForm.filtro,
                          referencia: "",
                          numParte: "",
                        },
                      }));
                    }}
                    className={
                      form.filtroTipo === "Referencia"
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                        : "text-black"
                    }
                  >
                    Referencia
                  </Button>
                  <Button
                    type="button"
                    size={"lg"}
                    variant={"ghost"}
                    onClick={(e) => {
                      e.preventDefault();
                      setForm((prevForm) => ({
                        ...prevForm,
                        filtroTipo: "Vehiculo",
                        filtro: {
                          ...prevForm.filtro,
                          referencia: "",
                          numParte: "",
                        },
                      }));
                    }}
                    className={
                      form.filtroTipo === "Vehiculo"
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white"
                        : "text-black"
                    }
                  >
                    Vehículo
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="px-20 py-8 bg-[#E4E4E4]">
            {getFilterComponent()}
            {loadingProducts && !initialLoad ? (
              <SkeletonProductsTable />
            ) : (
              <ProductsTable
                category={category}
                filtroInfo={form.filtro}
                filtroTipo={form.filtroTipo}
                onLoadingChange={setLoadingProducts}
                products={categoryProducts} // Pass fetched products
                loading={loadingProducts} // Pass loading state
                pageIndex={page - 1} // 0-indexed for table
                pageSize={pageSize}
                pageCount={totalPages}
                totalItems={totalItems}
                onPaginationChange={handlePaginationChange}
              />
            )}
          </section>
        </>
      )}
    </PlatinumLayout>
  );
};

export default Catalogo;