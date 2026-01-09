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
import { ProductsResponse } from "../../services/products.api";
import FilterSection from "../../components/FilterSection";
import ProductsTable from "../../components/ProductsTable";
import SkeletonCatalog from "../../skeletons/SkeletonCatalog";
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
import { Brand } from "../../models/brand";

type FiltroTipo = "NumParte" | "Vehiculo" | "Referencia";

const Catalogo = () => {
  const { loading: loadingBrands, brands: brandsMap, error: brandsError } = useBrands();
  const { getCategoryById, getCategoryFilters, error: categoriesError } = useCategories();

  const brands = useMemo(
    () => Object.values(brandsMap || {}),
    [brandsMap]
  );

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]> | undefined>(undefined);

  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("NumParte");
  const [filtro, setFiltro] = useState({
    numParte: "",
    referencia: "",
    vehiculo: {
      selectedFilters: [] as Array<{ attributeId: string; value: string }>,
    },
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeVehicleFilters, setActiveVehicleFilters] = useState<
    Array<{ attributeId: string; attributeName: string; value: string }>
  >([]);

  const [debouncedNumParte, setDebouncedNumParte] = useState("");
  const [debouncedReferencia, setDebouncedReferencia] = useState("");

  const fetchingCategoryRef = useRef<string | null>(null);
  const fetchingFiltersRef = useRef<string | null>(null);
  const hasRestoredSelectionsRef = useRef(false);

  const searchQuery = useMemo(() => {
    if (filtroTipo === "NumParte") {
      return debouncedNumParte;
    } else if (filtroTipo === "Referencia") {
      return debouncedReferencia;
    }
    return "";
  }, [filtroTipo, debouncedNumParte, debouncedReferencia]);

  const filtersDict = useMemo(() => {
    if (filtroTipo === "Vehiculo" && filtro.vehiculo.selectedFilters.length > 0) {
      const dict: Record<string, string> = {};
      filtro.vehiculo.selectedFilters.forEach((f) => {
        dict[f.attributeId] = f.value;
      });
      return dict;
    }
    return undefined;
  }, [filtroTipo, filtro.vehiculo.selectedFilters]);

  const { data, isLoading, error: productsError } = useProductsByCategory(
    selectedCategory?.id,
    page,
    pageSize,
    searchQuery,
    filtersDict
  );

  const products = (data as ProductsResponse | undefined)?.products ?? [];
  const totalItems = (data as ProductsResponse | undefined)?.total ?? 0;
  const totalPages = (data as ProductsResponse | undefined)?.totalPages ?? 1;

  useEffect(() => {
    if (brands.length > 0 && !selectedBrand) {
      const savedMarca = localStorage.getItem("catalogo-selected-marca");
      const brandToSelect = savedMarca && brandsMap[savedMarca]
        ? brandsMap[savedMarca]
        : brands[0];

      if (brandToSelect) {
        setSelectedBrand(brandToSelect);
        const savedCategoriaId = localStorage.getItem("catalogo-selected-categoria");
        const categoryToSelect = savedCategoriaId && brandToSelect.categories
          ? brandToSelect.categories.find((c) => c.id === savedCategoriaId)
          : brandToSelect.categories?.[0] || null;

        if (categoryToSelect) {
          setSelectedCategory(categoryToSelect);
          localStorage.setItem("catalogo-selected-categoria", categoryToSelect.id);
        }
        localStorage.setItem("catalogo-selected-marca", brandToSelect.id);
        hasRestoredSelectionsRef.current = true;
      }
    }
  }, [brands, brandsMap, selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedCategory) {
      const availableCategories = selectedBrand.categories || [];
      const categoryExists = availableCategories.some(
        (c) => c.id === selectedCategory.id
      );

      if (!categoryExists && availableCategories.length > 0) {
        setSelectedCategory(availableCategories[0]);
        localStorage.setItem("catalogo-selected-categoria", availableCategories[0].id);
      }
    }
  }, [selectedBrand, selectedCategory]);

  useEffect(() => {
    if (!selectedCategory?.id) {
      setCategoryData(null);
      setFilterOptions(undefined);
      return;
    }

    const categoryId = selectedCategory.id;
    if (fetchingCategoryRef.current === categoryId) return;

    fetchingCategoryRef.current = categoryId;
    const controller = new AbortController();

    getCategoryById(categoryId)
      .then((category) => {
        if (controller.signal.aborted) return;
        if (category) {
          setCategoryData(category);
        }
        return getCategoryFilters(categoryId, undefined, controller.signal);
      })
      .then((options) => {
        if (controller.signal.aborted) return;
        if (options) {
          setFilterOptions(options);
        }
        fetchingCategoryRef.current = null;
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        fetchingCategoryRef.current = null;
        console.error("Error fetching category data");
      });

    return () => {
      controller.abort();
      if (fetchingCategoryRef.current === categoryId) {
        fetchingCategoryRef.current = null;
      }
    };
  }, [selectedCategory?.id, getCategoryById, getCategoryFilters]);

  useEffect(() => {
    if (
      filtroTipo === "Vehiculo" &&
      selectedCategory?.id &&
      filtro.vehiculo.selectedFilters.length > 0
    ) {
      const categoryId = selectedCategory.id;
      if (fetchingFiltersRef.current === categoryId) return;

      fetchingFiltersRef.current = categoryId;
      const controller = new AbortController();

      const filtersDict: Record<string, string> = {};
      filtro.vehiculo.selectedFilters.forEach((f) => {
        filtersDict[f.attributeId] = f.value;
      });

      getCategoryFilters(categoryId, filtersDict, controller.signal)
        .then((options) => {
          if (controller.signal.aborted) return;
          if (options) {
            setFilterOptions(options);
          }
          fetchingFiltersRef.current = null;
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          fetchingFiltersRef.current = null;
        });

      return () => {
        controller.abort();
        if (fetchingFiltersRef.current === categoryId) {
          fetchingFiltersRef.current = null;
        }
      };
    } else if (filtroTipo === "Vehiculo" && selectedCategory?.id && filtro.vehiculo.selectedFilters.length === 0) {
      const categoryId = selectedCategory.id;
      const controller = new AbortController();

      getCategoryFilters(categoryId, undefined, controller.signal)
        .then((options) => {
          if (controller.signal.aborted) return;
          if (options) {
            setFilterOptions(options);
          }
        })
        .catch(() => { });

      return () => controller.abort();
    }
  }, [filtroTipo, selectedCategory?.id, filtro.vehiculo.selectedFilters, getCategoryFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNumParte(filtro.numParte);
    }, 500);
    return () => clearTimeout(timer);
  }, [filtro.numParte]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedReferencia(filtro.referencia);
    }, 500);
    return () => clearTimeout(timer);
  }, [filtro.referencia]);

  useEffect(() => {
    if (filtroTipo !== "Vehiculo" || filtro.vehiculo.selectedFilters.length === 0) {
      setPage(1);
    }
  }, [filtroTipo, filtro.vehiculo.selectedFilters, searchQuery]);

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId) || null;
    setSelectedBrand(brand);
    if (brand) {
      const category = brand.categories?.[0] || null;
      setSelectedCategory(category);
      if (category) {
        localStorage.setItem("catalogo-selected-categoria", category.id);
      }
      localStorage.setItem("catalogo-selected-marca", brandId);
    }
    setFiltro({
      numParte: "",
      referencia: "",
      vehiculo: { selectedFilters: [] },
    });
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    if (!selectedBrand?.categories) return;
    const category = selectedBrand.categories.find((c) => c.id === categoryId) || null;
    setSelectedCategory(category);
    if (category) {
      localStorage.setItem("catalogo-selected-categoria", categoryId);
    }
    setFiltro((prev) => ({
      ...prev,
      vehiculo: { selectedFilters: [] },
    }));
    setPage(1);
  };

  const handleFilterTypeChange = (type: FiltroTipo) => {
    setFiltroTipo(type);
    setFiltro({
      numParte: "",
      referencia: "",
      vehiculo: { selectedFilters: [] },
    });
    setPage(1);
  };

  const handleVehicleFilterChange = (filters: Array<{ attributeId: string; value: string }>) => {
    setFiltro((prev) => ({
      ...prev,
      vehiculo: {
        selectedFilters: filters,
      },
    }));
    setPage(1);
  };

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPage(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  const translateErrorMessage = (message: string | Error | null | undefined): string => {
    if (!message) return "Ocurrió un error inesperado";

    const messageStr =
      typeof message === "string" ? message : message?.message || "Ocurrió un error inesperado";

    if (messageStr.toLowerCase().includes("network error") || messageStr.toLowerCase().includes("failed to fetch")) {
      return "Error de Red";
    }
    if (messageStr.toLowerCase().includes("timeout")) {
      return "Tiempo de espera agotado";
    }
    if (messageStr.toLowerCase().includes("unauthorized") || messageStr.toLowerCase().includes("401")) {
      return "No autorizado";
    }
    if (messageStr.toLowerCase().includes("forbidden") || messageStr.toLowerCase().includes("403")) {
      return "Acceso prohibido";
    }
    if (messageStr.toLowerCase().includes("not found") || messageStr.toLowerCase().includes("404")) {
      return "No encontrado";
    }
    if (messageStr.toLowerCase().includes("server error") || messageStr.toLowerCase().includes("500")) {
      return "Error del servidor";
    }

    return messageStr;
  };

  const hasError = brandsError || categoriesError || productsError;
  const errorMessage = brandsError || categoriesError || productsError;
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  useEffect(() => {
    if (hasError) {
      setIsErrorDialogOpen(true);
    }
  }, [hasError]);

  const getFilterComponent = () => {
    switch (filtroTipo) {
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
                  value={filtro.numParte}
                  onChange={(e) =>
                    setFiltro((prev) => ({
                      ...prev,
                      numParte: e.target.value,
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
                  value={filtro.referencia}
                  onChange={(e) =>
                    setFiltro((prev) => ({
                      ...prev,
                      referencia: e.target.value,
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
        const categoryForFilters = categoryData || selectedCategory;
        return (
          <FilterSection
            category={categoryForFilters}
            filtroInfo={filtro}
            onFilterChange={handleVehicleFilterChange}
            filterOptions={filterOptions}
            onActiveFiltersChange={setActiveVehicleFilters}
          />
        );
      }
    }
  };

  const availableCategories = useMemo(() => {
    return selectedBrand?.categories || [];
  }, [selectedBrand]);

  if (loadingBrands) {
    return (
      <PlatinumLayout>
        <SkeletonCatalog />
      </PlatinumLayout>
    );
  }

  return (
    <PlatinumLayout>
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

      <section className="bg-hero-catalog bg-cover px-4 sm:px-8 md:px-12 lg:px-20 flex flex-wrap xl:flex-nowrap justify-between items-center py-10">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl pt-6 pb-4 sm:pb-5 md:pb-6 text-white w-full xl:w-auto">
          Catálogo Electrónico
        </h2>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 flex-wrap items-end">
          <div className="flex flex-col flex-wrap w-full sm:w-auto flex-1 sm:flex-none">
            <Label className="font-semibold text-xs sm:text-sm mb-1.5 text-white">
              Línea de producto:
            </Label>
            <Select onValueChange={handleBrandChange} value={selectedBrand?.id || ""}>
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
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
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
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
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
              value={selectedCategory?.id || ""}
              disabled={availableCategories.length === 0}
            >
              <SelectTrigger className="h-9 sm:h-10 w-full sm:w-[200px] md:w-[220px]">
                {selectedCategory ? (
                  <div className="flex items-center gap-2">
                    {selectedCategory.imgUrl ? (
                      <img
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                        src={selectedCategory.imgUrl}
                        alt={selectedCategory.name}
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-200 rounded">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm truncate">{selectedCategory.name}</span>
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
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
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
                onClick={() => handleFilterTypeChange("NumParte")}
                className={
                  filtroTipo === "NumParte"
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
                onClick={() => handleFilterTypeChange("Referencia")}
                className={
                  filtroTipo === "Referencia"
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
                onClick={() => handleFilterTypeChange("Vehiculo")}
                className={
                  filtroTipo === "Vehiculo"
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
        {filtroTipo === "Vehiculo" && (
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

        <div className="flex gap-6">
          {filtroTipo === "Vehiculo" && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Filtros</h3>
                {getFilterComponent()}
              </div>
            </aside>
          )}

          <main className="flex-1 min-w-0">
            {filtroTipo !== "Vehiculo" && <div className="mb-6">{getFilterComponent()}</div>}

            <ProductsTable
              category={categoryData}
              products={products}
              loading={isLoading}
              pageIndex={page - 1}
              pageSize={pageSize}
              pageCount={totalPages}
              totalItems={totalItems}
              onPaginationChange={handlePaginationChange}
              hideViewToggle={filtroTipo !== "Vehiculo"}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </main>
        </div>

        {filtroTipo === "Vehiculo" && (
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
    </PlatinumLayout>
  );
};

export default Catalogo;
