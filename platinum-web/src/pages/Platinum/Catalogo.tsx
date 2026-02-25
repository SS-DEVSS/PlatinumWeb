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
import { useState, useEffect, useMemo, useRef, useDeferredValue } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useProductsByCategory } from "../../hooks/useProductsByCategory";
import { useSubcategoriesByCategory } from "../../hooks/useSubcategoriesByCategory";
import { ProductsResponse } from "../../services/products.api";
import FilterSection from "../../components/FilterSection";
import ProductsTable from "../../components/ProductsTable";
import CatalogCard from "../../components/CatalogCard";
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
import { AlertCircle, ArrowLeft, ChevronDown, ChevronRight, Filter, Search } from "lucide-react";
import { Brand } from "../../models/brand";
import { Subcategory } from "../../models/subcategory";
import { fetchSubcategoriesByCategory } from "../../services/subcategories.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

type FiltroTipo = "NumParte" | "Vehiculo" | "Referencia";
type CatalogViewLevel = "categories" | "subcategories" | "products";

/** Flatten tree of subcategories so all levels (root, children, grandchildren, ...) appear in one list. */
function flattenSubcategoryTree(nodes: Subcategory[]): Subcategory[] {
  const result: Subcategory[] = [];
  function visit(node: Subcategory) {
    result.push(node);
    (node.children || []).forEach(visit);
  }
  nodes.forEach(visit);
  return result;
}

type DrillLevel =
  | { type: "category"; category: Category }
  | { type: "subcategory"; category: Category; node: Subcategory };

const matchSearch = (query: string, name: string) =>
  !query.trim() || name.toLowerCase().includes(query.trim().toLowerCase());

type SearchHit = { category: Category; subcategoryId: string | null; label: string };

function flattenSearchHits(
  categories: Category[],
  treeByCategory: Record<string, Subcategory[]>
): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const cat of categories) {
    if (!cat.id) continue;
    hits.push({ category: cat, subcategoryId: null, label: cat.name ?? "" });
    const tree = treeByCategory[cat.id] ?? [];
    const walk = (nodes: Subcategory[], path: string[]) => {
      for (const node of nodes) {
        const currentPath = [...path, node.name];
        const label = [cat.name, ...currentPath].join(" › ");
        hits.push({ category: cat, subcategoryId: node.id, label });
        if (node.children?.length) walk(node.children, currentPath);
      }
    };
    walk(tree, []);
  }
  return hits;
}

const Catalogo = () => {
  const { loading: loadingBrands, brands: brandsMap, error: brandsError } = useBrands();
  const { getCategoryById, getCategoryFilters, error: categoriesError } = useCategories();

  const brands = useMemo(
    () => Object.values(brandsMap || {}),
    [brandsMap]
  );

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [viewLevel, setViewLevel] = useState<CatalogViewLevel>("categories");
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
  const [viewMode] = useState<"cards" | "table">("cards");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeVehicleFilters, setActiveVehicleFilters] = useState<
    Array<{ attributeId: string; attributeName: string; value: string }>
  >([]);

  const [debouncedNumParte, setDebouncedNumParte] = useState("");
  const [debouncedReferencia, setDebouncedReferencia] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");

  const [subcategoryTreeByCategory, setSubcategoryTreeByCategory] = useState<
    Record<string, Subcategory[]>
  >({});
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterMenuSearch, setFilterMenuSearch] = useState("");
  const filterMenuSearchDeferred = useDeferredValue(filterMenuSearch);
  const [drillStack, setDrillStack] = useState<DrillLevel[]>([]);

  const fetchingCategoryRef = useRef<string | null>(null);
  const fetchingFiltersRef = useRef<string | null>(null);
  const hasRestoredSelectionsRef = useRef(false);

  const searchQuery = useMemo(() => {
    if (viewLevel === "products") return debouncedProductSearch;
    if (filtroTipo === "NumParte") return debouncedNumParte;
    if (filtroTipo === "Referencia") return debouncedReferencia;
    return "";
  }, [viewLevel, debouncedProductSearch, filtroTipo, debouncedNumParte, debouncedReferencia]);

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

  const { data: subcategoriesData, isLoading: loadingSubcategories } = useSubcategoriesByCategory(
    viewLevel === "subcategories" ? selectedCategory?.id : undefined
  );
  const subcategoriesTree = subcategoriesData ?? [];
  const subcategoriesFlat = useMemo(
    () => flattenSubcategoryTree(subcategoriesTree),
    [subcategoriesTree]
  );

  const { data, isLoading, error: productsError } = useProductsByCategory(
    viewLevel === "products" ? selectedCategory?.id : undefined,
    page,
    pageSize,
    searchQuery,
    filtersDict,
    viewLevel === "products" ? selectedSubcategoryId : undefined
  );

  const products = (data as ProductsResponse | undefined)?.products ?? [];
  const totalItems = (data as ProductsResponse | undefined)?.total ?? 0;
  const totalPages = (data as ProductsResponse | undefined)?.totalPages ?? 1;

  const availableCategories = useMemo(() => {
    return selectedBrand?.categories || [];
  }, [selectedBrand]);

  useEffect(() => {
    if (brands.length > 0 && !selectedBrand) {
      const savedMarca = localStorage.getItem("catalogo-selected-marca");
      const brandToSelect = savedMarca && brandsMap[savedMarca]
        ? brandsMap[savedMarca]
        : brands[0];

      if (brandToSelect) {
        setSelectedBrand(brandToSelect);
        localStorage.setItem("catalogo-selected-marca", brandToSelect.id);
        setViewLevel("categories");
        hasRestoredSelectionsRef.current = true;
      }
    }
  }, [brands, brandsMap, selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedCategory && viewLevel !== "categories") {
      const availableCategories = selectedBrand.categories || [];
      const categoryExists = availableCategories.some(
        (c) => c.id === selectedCategory.id
      );

      if (!categoryExists && availableCategories.length > 0) {
        setSelectedCategory(availableCategories[0]);
        setSelectedSubcategoryId(null);
        setViewLevel("subcategories");
        localStorage.setItem("catalogo-selected-categoria", availableCategories[0].id);
      }
    }
  }, [selectedBrand, selectedCategory, viewLevel]);

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
    const timer = setTimeout(() => setDebouncedProductSearch(productSearch), 500);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Cargar árbol de subcategorías por categoría para el dropdown (vista productos)
  useEffect(() => {
    const categories = selectedBrand?.categories ?? [];
    if (categories.length === 0) return;

    let isCancelled = false;
    const controller = new AbortController();

    Promise.all(
      categories.map((cat) =>
        cat.id
          ? fetchSubcategoriesByCategory(cat.id, controller.signal).then((tree) => [cat.id!, tree] as const)
          : Promise.resolve(null)
      )
    )
      .then((results) => {
        if (isCancelled) return;
        const map: Record<string, Subcategory[]> = {};
        results.forEach((r) => {
          if (r) map[r[0]] = r[1];
        });
        setSubcategoryTreeByCategory(map);
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [selectedBrand?.id, selectedBrand?.categories]);

  useEffect(() => {
    if (filtroTipo !== "Vehiculo" || filtro.vehiculo.selectedFilters.length === 0) {
      setPage(1);
    }
  }, [filtroTipo, filtro.vehiculo.selectedFilters, searchQuery]);

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId) || null;
    setSelectedBrand(brand);
    setSelectedCategory(null);
    setSelectedSubcategoryId(null);
    setViewLevel("categories");
    if (brand) {
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
    setSelectedSubcategoryId(null);
    setViewLevel("subcategories");
    if (category) {
      localStorage.setItem("catalogo-selected-categoria", categoryId);
    }
    setFiltro((prev) => ({
      ...prev,
      vehiculo: { selectedFilters: [] },
    }));
    setPage(1);
  };

  const handleCategoryCardClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategoryId(null);
    setViewLevel("subcategories");
    localStorage.setItem("catalogo-selected-categoria", category.id);
    setPage(1);
  };

  const handleSubcategoryCardClick = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    setViewLevel("products");
    setPage(1);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategoryId(null);
    setViewLevel("categories");
    setPage(1);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategoryId(null);
    setViewLevel("subcategories");
    setPage(1);
  };

  const selectCategoryAndSubcategory = (cat: Category | null, subId: string | null) => {
    setSelectedCategory(cat);
    setSelectedSubcategoryId(subId);
    if (cat) {
      localStorage.setItem("catalogo-selected-categoria", cat.id);
      setViewLevel("products");
    } else {
      setViewLevel("categories");
    }
    setPage(1);
    setFilterMenuOpen(false);
  };

  const goBack = () => setDrillStack((prev) => prev.slice(0, -1));
  const drillIntoCategory = (cat: Category) =>
    setDrillStack((prev) => [...prev, { type: "category", category: cat }]);
  const drillIntoSubcategory = (cat: Category, node: Subcategory) =>
    setDrillStack((prev) => [...prev, { type: "subcategory", category: cat, node }]);

  const handleFilterOpenChange = (open: boolean) => {
    setFilterMenuOpen(open);
    if (!open) {
      setDrillStack([]);
      setFilterMenuSearch("");
    }
  };

  const searchQueryFilter = filterMenuSearchDeferred.trim().toLowerCase();
  const globalSearchHits =
    searchQueryFilter.length > 0
      ? flattenSearchHits(availableCategories, subcategoryTreeByCategory).filter((hit) =>
          hit.label.toLowerCase().includes(searchQueryFilter)
        )
      : [];
  const showGlobalSearch = searchQueryFilter.length > 0;

  const getSelectedFilterLabel = () => {
    if (!selectedCategory) return "Todas las categorías";
    if (!selectedSubcategoryId) return selectedCategory.name ?? "";

    const tree = selectedCategory.id ? subcategoryTreeByCategory[selectedCategory.id] : undefined;
    if (!tree?.length) return selectedCategory.name ?? "";

    const findPath = (
      nodes: Subcategory[],
      targetId: string,
      path: string[] = []
    ): string[] | null => {
      for (const node of nodes) {
        const currentPath = [...path, node.name];
        if (node.id === targetId) return currentPath;
        if (node.children?.length) {
          const found = findPath(node.children, targetId, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    const path = findPath(tree, selectedSubcategoryId);
    if (!path) return selectedCategory.name ?? "";
    return `${selectedCategory.name} › ${path.join(" › ")}`;
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
            {/* <div className="flex items-center gap-2">
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
            </div> */}
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
            {/* <div className="flex items-center gap-2">
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
            </div> */}
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
          {(viewLevel === "subcategories" || viewLevel === "products") && (
            <div className="flex flex-col w-full sm:w-auto flex-1 sm:flex-none">
              <Label className="font-semibold text-xs sm:text-sm mb-1.5 text-white">
                Categoría:
              </Label>
              <DropdownMenu open={filterMenuOpen} onOpenChange={handleFilterOpenChange} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[220px] md:w-[260px] justify-between h-9 sm:h-10 bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                  >
                    <span className="truncate text-left">
                      {getSelectedFilterLabel()}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[280px] p-0"
                  align="start"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  modal={false}
                >
                  <div
                    className="p-2 border-b"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar categoría o subcategoría..."
                        value={filterMenuSearch}
                        onChange={(e) => setFilterMenuSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        onKeyUp={(e) => e.stopPropagation()}
                        className="h-9 pl-8"
                      />
                    </div>
                  </div>
                  {drillStack.length > 0 && !showGlobalSearch && (
                    <div className="px-3 py-2 bg-primary/10 border-b border-primary/20">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Estás en
                      </p>
                      <p
                        className="text-sm font-semibold truncate"
                        title={drillStack
                          .map((d) => (d.type === "category" ? d.category.name : d.node.name))
                          .join(" › ")}
                      >
                        {drillStack
                          .map((d) => (d.type === "category" ? d.category.name : d.node.name))
                          .join(" › ")}
                      </p>
                    </div>
                  )}
                  <div className="max-h-[300px] overflow-y-auto py-1">
                    {showGlobalSearch ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => selectCategoryAndSubcategory(null, null)}
                        >
                          Todas las categorías
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {globalSearchHits.length === 0 ? (
                          <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                            No hay coincidencias
                          </div>
                        ) : (
                          globalSearchHits.map((hit) => (
                            <DropdownMenuItem
                              key={`${hit.category.id ?? ""}-${hit.subcategoryId ?? "all"}`}
                              onClick={() =>
                                selectCategoryAndSubcategory(
                                  hit.category,
                                  hit.subcategoryId
                                )
                              }
                            >
                              {hit.label}
                            </DropdownMenuItem>
                          ))
                        )}
                      </>
                    ) : (
                      <>
                        {drillStack.length > 0 && (
                          <>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              onClick={goBack}
                              className="text-muted-foreground"
                            >
                              ← Volver
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {drillStack.length === 0 && (
                          <>
                            <DropdownMenuItem
                              onClick={() => selectCategoryAndSubcategory(null, null)}
                            >
                              Todas las categorías
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {availableCategories
                              .filter((cat) =>
                                matchSearch(filterMenuSearchDeferred, cat.name ?? "")
                              )
                              .map((cat) => {
                                if (!cat.id) return null;
                                const tree = subcategoryTreeByCategory[cat.id];
                                const hasChildren = tree && tree.length > 0;
                                return (
                                  <DropdownMenuItem
                                    key={cat.id}
                                    onSelect={(e) => {
                                      if (hasChildren) e.preventDefault();
                                    }}
                                    onClick={() =>
                                      hasChildren
                                        ? drillIntoCategory(cat)
                                        : selectCategoryAndSubcategory(cat, null)
                                    }
                                    className="flex items-center justify-between"
                                  >
                                    <span>{cat.name}</span>
                                    {hasChildren && <ChevronRight className="h-4 w-4" />}
                                  </DropdownMenuItem>
                                );
                              })}
                          </>
                        )}
                        {drillStack.length > 0 &&
                          (() => {
                            const top = drillStack[drillStack.length - 1];
                            if (top.type === "category") {
                              const catId = top.category.id ?? "";
                              const nodes = subcategoryTreeByCategory[catId] ?? [];
                              return (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      selectCategoryAndSubcategory(top.category, null)
                                    }
                                  >
                                    Todas las subcategorías
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {nodes
                                    .filter((n) =>
                                      matchSearch(filterMenuSearchDeferred, n.name)
                                    )
                                    .map((node) => {
                                      const hasChildren =
                                        node.children && node.children.length > 0;
                                      return (
                                        <DropdownMenuItem
                                          key={node.id}
                                          onSelect={(e) => {
                                            if (hasChildren) e.preventDefault();
                                          }}
                                          onClick={() =>
                                            hasChildren
                                              ? drillIntoSubcategory(top.category, node)
                                              : selectCategoryAndSubcategory(
                                                  top.category,
                                                  node.id
                                                )
                                          }
                                          className="flex items-center justify-between"
                                        >
                                          <span>{node.name}</span>
                                          {hasChildren && (
                                            <ChevronRight className="h-4 w-4" />
                                          )}
                                        </DropdownMenuItem>
                                      );
                                    })}
                                </>
                              );
                            }
                            const nodes = top.node.children ?? [];
                            return (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    selectCategoryAndSubcategory(
                                      top.category,
                                      top.node.id
                                    )
                                  }
                                >
                                  {top.node.name}
                                </DropdownMenuItem>
                                {nodes.length > 0 && <DropdownMenuSeparator />}
                                {nodes
                                  .filter((n) =>
                                    matchSearch(filterMenuSearchDeferred, n.name)
                                  )
                                  .map((node) => {
                                    const hasChildren =
                                      node.children && node.children.length > 0;
                                    return (
                                      <DropdownMenuItem
                                        key={node.id}
                                        onSelect={(e) => {
                                          if (hasChildren) e.preventDefault();
                                        }}
                                        onClick={() =>
                                          hasChildren
                                            ? drillIntoSubcategory(top.category, node)
                                            : selectCategoryAndSubcategory(
                                                top.category,
                                                node.id
                                              )
                                        }
                                        className="flex items-center justify-between"
                                      >
                                        <span>{node.name}</span>
                                        {hasChildren && (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </DropdownMenuItem>
                                    );
                                  })}
                              </>
                            );
                          })()}
                      </>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {viewLevel === "products" && (
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
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8 bg-[#E4E4E4]">
        {viewLevel === "categories" && selectedBrand && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Seleccione una categoría
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableCategories.map((category) => (
                <CatalogCard
                  key={category.id}
                  title={category.name}
                  imageUrl={category.imgUrl}
                  onClick={() => handleCategoryCardClick(category)}
                />
              ))}
            </div>
            {availableCategories.length === 0 && (
              <p className="text-gray-600 text-center py-8">
                No hay categorías disponibles para esta marca.
              </p>
            )}
          </div>
        )}

        {viewLevel === "subcategories" && selectedCategory && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToCategories}
              className="mb-4 text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Todas las categorías
            </Button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedCategory.name}
            </h3>
            {loadingSubcategories ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg border bg-white overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <CatalogCard
                  key="all"
                  title="Todos los productos"
                  countLabel="ver todos"
                  onClick={() => handleSubcategoryCardClick(null)}
                />
                {subcategoriesFlat.map((sub) => (
                  <CatalogCard
                    key={sub.id}
                    title={sub.name}
                    count={sub.productCount}
                    countLabel="artículos"
                    onClick={() => handleSubcategoryCardClick(sub.id)}
                  />
                ))}
              </div>
            )}
            {!loadingSubcategories && subcategoriesFlat.length === 0 && (
              <p className="text-gray-600 text-center py-4">
                No hay subcategorías. Use &quot;Todos los productos&quot; para ver el listado.
              </p>
            )}
          </div>
        )}

        {viewLevel === "products" && (
          <>
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

            <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSubcategories}
                className="text-gray-700 hover:text-gray-900 flex items-center gap-2 self-start"
              >
                <ArrowLeft className="h-4 w-4" />
                {selectedCategory?.name ?? "Subcategorías"}
              </Button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar por número de parte, referencia o nombre..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9 h-10 bg-white border-gray-200"
                />
              </div>
            </div>

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
                  viewMode={viewMode}
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
          </>
        )}
      </section>
    </PlatinumLayout>
  );
};

export default Catalogo;
