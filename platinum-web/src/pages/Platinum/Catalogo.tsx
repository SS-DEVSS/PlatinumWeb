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
import { useProducts, checkProductsCache } from "../../hooks/useProducts";
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
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // State for server-side filter options
  const [filterOptions, setFilterOptions] = useState<Record<string, (string | number | boolean | Date)[]> | undefined>(undefined);

  // State for mobile filter drawer
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // State for active vehicle filters (for mobile display)
  const [activeVehicleFilters, setActiveVehicleFilters] = useState<Array<{ attributeId: string, attributeName: string, value: string }>>([]);

  // State for view mode (cards/table)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Ref to track if category is being fetched to prevent duplicate fetches
  const fetchingCategoryRef = useRef<string | null>(null);
  // Ref to track the last successfully loaded category ID to prevent refetching
  const loadedCategoryIdRef = useRef<string | null>(null);
  // Ref to track the last products query to prevent duplicate product fetches
  const lastProductsQueryRef = useRef<string>('');

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

    if (!form.categoria) {
      fetchingCategoryRef.current = null;
      return;
    }

    const categoryId = form.categoria.id;
    const currentCategoryId = category?.id || loadedCategoryIdRef.current;

    // Only fetch category if it's different from what we've loaded, and not already fetching
    if (currentCategoryId !== categoryId && fetchingCategoryRef.current !== categoryId) {
      fetchingCategoryRef.current = categoryId;
      setProductsError(null);
      // Reset filter options only when category actually changes
      setFilterOptions(undefined);

      getCategoryById(categoryId)
        .then(() => {
          // Initial fetch of filters (no filters applied) for the base dropdowns
          if (controller.signal.aborted) {
            fetchingCategoryRef.current = null;
            return;
          }
          loadedCategoryIdRef.current = categoryId; // Mark as loaded
          return getCategoryFilters(categoryId, undefined, controller.signal);
        })
        .then((options) => {
          if (controller.signal.aborted) {
            fetchingCategoryRef.current = null;
            return;
          }
          if (options) {
            setFilterOptions(options);
          }
          fetchingCategoryRef.current = null;
        })
        .catch((err: Error) => {
          fetchingCategoryRef.current = null;
          if (controller.signal.aborted) return;
          if (err.name !== 'CanceledError' && (err as any).code !== "ERR_CANCELED") {
            setProductsError(`Error al cargar categoría: ${err.message || 'Ocurrió un error inesperado'}`);
          }
        });
    } else {
      // Ensure ref is set even if category state was reset
      if (currentCategoryId === categoryId && !loadedCategoryIdRef.current) {
        loadedCategoryIdRef.current = categoryId;
      }
    }

    return () => {
      if (fetchingCategoryRef.current === categoryId) {
        fetchingCategoryRef.current = null;
      }
      controller.abort();
    };
  }, [form.categoria?.id, category, getCategoryById, getCategoryFilters]); // Added category

  // Fetch filtered options when vehicle filters change
  useEffect(() => {
    const controller = new AbortController();

    // Use category from form
    const currentCategory = form.categoria;
    if (!currentCategory || form.filtroTipo !== "Vehiculo") {
      return;
    }

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
        .catch(() => {
          // Silent fail
        });
    } else {
      // If filters cleared, re-fetch base options
      getCategoryFilters(categoryId, undefined, controller.signal)
        .then((options) => {
          if (controller.signal.aborted) return;
          if (options) setFilterOptions(options);
        })
        .catch(() => {
          // Silent fail
        });
    }

    return () => controller.abort();
  }, [form.categoria, selectedFiltersHash, form.filtroTipo, getCategoryFilters]);

  // Fetch products when category, filters, or pagination changes
  useEffect(() => {
    const controller = new AbortController();

    const currentCategory = form.categoria;
    if (!currentCategory) {
      lastProductsQueryRef.current = ''; // Reset on no category
      return;
    }

    const categoryId = currentCategory.id;

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

    // Create a unique query key to prevent duplicate fetches
    const queryKey = `${categoryId}_${page}_${pageSize}_${searchQuery}_${selectedFiltersHash}`;

    // Skip if this is the same query we just processed (prevents duplicate runs in same render cycle)
    if (lastProductsQueryRef.current === queryKey) {
      return () => controller.abort();
    }

    lastProductsQueryRef.current = queryKey;

    // Check cache synchronously first
    const cachedData = checkProductsCache(categoryId, page, pageSize, searchQuery, filters);
    if (cachedData) {
      // Cache hit - set data immediately without loading state
      setTotalPages(cachedData.totalPages);
      setTotalItems(cachedData.total);
      setInitialLoad(true);
      setLoadingProducts(false);
      // Still call getProductsByCategory to update hook's products state (will use cache internally and return immediately)
      getProductsByCategory(categoryId, page, pageSize, searchQuery, filters, controller.signal)
        .catch(() => {
          // Ignore errors if aborted
        });
      return () => controller.abort();
    }

    // No cache - show loading and fetch
    setLoadingProducts(true);

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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="flex-1">
              <Label className="font-semibold text-sm sm:text-base mb-2 sm:mb-0 sm:hidden block">
                Número de Parte:
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número de parte (SKU)"
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
                  className="bg-white h-10 sm:h-12 text-sm sm:text-base pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-1 sm:gap-2 h-10 sm:h-12"
                title="Vista de tarjetas"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Tarjetas</span>
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-1 sm:gap-2 h-10 sm:h-12"
                title="Vista de tabla"
              >
                <Table2 className="h-4 w-4" />
                <span className="hidden sm:inline">Tabla</span>
              </Button>
            </div>
          </div>
        );
      case "Referencia":
        return (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="flex-1">
              <Label className="font-semibold text-sm sm:text-base mb-2 sm:mb-0 sm:hidden block">
                Referencia:
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por referencia"
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
                  className="bg-white h-10 sm:h-12 text-sm sm:text-base pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-1 sm:gap-2 h-10 sm:h-12"
                title="Vista de tarjetas"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Tarjetas</span>
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-1 sm:gap-2 h-10 sm:h-12"
                title="Vista de tabla"
              >
                <Table2 className="h-4 w-4" />
                <span className="hidden sm:inline">Tabla</span>
              </Button>
            </div>
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
            onActiveFiltersChange={setActiveVehicleFilters}
          />
        );
      }
    }
  };

  // Find the current selected brand object
  const selectedBrand = form.marca ? brandsMap[form.marca] : null;

  // Helper function to translate error messages to Spanish
  const translateErrorMessage = (message: string | Error | null | undefined): string => {
    if (!message) return 'Ocurrió un error inesperado';

    const messageStr = typeof message === 'string' ? message : message?.message || 'Ocurrió un error inesperado';

    // Translate common error messages
    if (messageStr.toLowerCase().includes('network error') || messageStr.toLowerCase().includes('failed to fetch')) {
      return 'Error de Red';
    }
    if (messageStr.toLowerCase().includes('timeout')) {
      return 'Tiempo de espera agotado';
    }
    if (messageStr.toLowerCase().includes('unauthorized') || messageStr.toLowerCase().includes('401')) {
      return 'No autorizado';
    }
    if (messageStr.toLowerCase().includes('forbidden') || messageStr.toLowerCase().includes('403')) {
      return 'Acceso prohibido';
    }
    if (messageStr.toLowerCase().includes('not found') || messageStr.toLowerCase().includes('404')) {
      return 'No encontrado';
    }
    if (messageStr.toLowerCase().includes('server error') || messageStr.toLowerCase().includes('500')) {
      return 'Error del servidor';
    }

    return messageStr;
  };

  // Determine if we have any errors to display
  const hasError = brandsError || categoriesError || productsError;
  const errorMessage = brandsError || categoriesError || productsError;
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  // Open error dialog when error occurs
  useEffect(() => {
    if (hasError) {
      setIsErrorDialogOpen(true);
    }
  }, [hasError]);

  return (
    <PlatinumLayout>
      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-red-600">
                Error
              </DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription className="pt-4 text-base">
            {translateErrorMessage(errorMessage)}
          </DialogDescription>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setIsErrorDialogOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loadingCategories || loadingBrands ? (
        <SkeletonCatalog />
      ) : (
        <>
          <section className="bg-hero-catalog bg-cover px-4 sm:px-8 md:px-12 lg:px-20 flex flex-wrap xl:flex-nowrap justify-between items-center py-10">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl pt-6 pb-4 sm:pb-5 md:pb-6 text-white w-full xl:w-auto">
              Catálogo Electrónico
            </h2>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 flex-wrap items-end">
              <div className="flex flex-col flex-wrap w-full sm:w-auto flex-1 sm:flex-none">
                <Label className="font-semibold text-xs sm:text-sm mb-1.5 text-white">
                  Marca:
                </Label>
                <Select onValueChange={handleBrandChange} value={form.marca || ''}>
                  <SelectTrigger className="h-9 sm:h-10 w-full sm:w-[200px] md:w-[220px]">
                    {selectedBrand ? (
                      <div className="flex items-center gap-2">
                        {selectedBrand.logoImgUrl ? (
                          <img
                            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                            src={selectedBrand.logoImgUrl}
                            alt={selectedBrand.name}
                          />
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-200 rounded">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <span className="text-sm truncate">{selectedBrand.name}</span>
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
              <div className="flex flex-col w-full sm:w-auto flex-1 sm:flex-none">
                <Label className="font-semibold text-xs sm:text-sm mb-1.5 text-white">
                  Categoría:
                </Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={form.categoria?.id || ''}
                  disabled={availableCategories.length === 0}
                >
                  <SelectTrigger className="h-9 sm:h-10 w-full sm:w-[200px] md:w-[220px]">
                    {form.categoria ? (
                      <div className="flex items-center gap-2">
                        {form.categoria.imgUrl ? (
                          <img
                            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                            src={form.categoria.imgUrl}
                            alt={form.categoria.name}
                          />
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-200 rounded">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <span className="text-sm truncate">{form.categoria.name}</span>
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
              <div className="flex flex-col w-full sm:w-auto flex-1 sm:flex-none">
                <Label className="font-semibold text-xs sm:text-sm mb-1.5 text-white">
                  Filtrar Por:
                </Label>
                <div className="flex flex-wrap gap-1.5 rounded-lg bg-white p-1.5 items-center">
                  <Button
                    type="button"
                    size={"sm"}
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
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white text-xs h-8 px-2 sm:px-3"
                        : "text-black text-xs h-8 px-2 sm:px-3"
                    }
                  >
                    Número de Parte
                  </Button>
                  <Button
                    type="button"
                    size={"sm"}
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
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white text-xs h-8 px-2 sm:px-3"
                        : "text-black text-xs h-8 px-2 sm:px-3"
                    }
                  >
                    Referencia
                  </Button>
                  <Button
                    type="button"
                    size={"sm"}
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
                        ? "bg-gris_oscuro text-white hover:bg-gris_oscuro hover:text-white text-xs h-8 px-2 sm:px-3"
                        : "text-black text-xs h-8 px-2 sm:px-3"
                    }
                  >
                    Vehículo
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8 bg-[#E4E4E4]">
            {/* Mobile: Filter Toggle Button and Active Filters */}
            {form.filtroTipo === "Vehiculo" && (
              <div className="lg:hidden mb-4 space-y-3">
                <Button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  variant="outline"
                  className="w-full sm:w-auto justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                    {activeVehicleFilters.length > 0 && (
                      <span className="bg-naranja text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                        {activeVehicleFilters.length}
                      </span>
                    )}
                  </div>
                </Button>

                {/* Active Filter Chips */}
                {activeVehicleFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeVehicleFilters.map((filter) => (
                      <div
                        key={filter.attributeId}
                        className="flex items-center gap-1.5 bg-naranja text-white px-3 py-1.5 rounded-full text-xs"
                      >
                        <span className="font-medium">{filter.attributeName}:</span>
                        <span>{filter.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Desktop: Sidebar Layout, Mobile: Full Width */}
            <div className="flex gap-6">
              {/* Desktop Sidebar - Only for Vehicle filters */}
              {form.filtroTipo === "Vehiculo" && (
                <aside className="hidden lg:block w-80 flex-shrink-0">
                  <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Filtros</h3>
                    {getFilterComponent()}
                  </div>
                </aside>
              )}

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {/* NumParte/Referencia filters with inline view toggle */}
                {form.filtroTipo !== "Vehiculo" && (
                  <div className="mb-6">
                    {getFilterComponent()}
                  </div>
                )}

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
                    hideViewToggle={form.filtroTipo !== "Vehiculo"}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                )}
              </main>
            </div>

            {/* Mobile Filter Drawer */}
            {form.filtroTipo === "Vehiculo" && (
              <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
                <SheetContent side="left" className="w-80 sm:w-96 p-0">
                  <div className="p-4 border-b">
                    <SheetHeader>
                      <SheetTitle className="text-lg font-semibold">Filtros</SheetTitle>
                    </SheetHeader>
                  </div>
                  <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                    {getFilterComponent()}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </section>
        </>
      )
      }
    </PlatinumLayout >
  );
};

export default Catalogo;