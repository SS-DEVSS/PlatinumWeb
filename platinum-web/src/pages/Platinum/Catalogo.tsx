import PlatinumLayout from "../../Layouts/PlatinumLayout";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState, useEffect, useMemo, useRef } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useProductsByCategory } from "../../hooks/useProductsByCategory";
import { useSubcategoriesMap } from "../../hooks/useSubcategoriesMap";
import { ProductsResponse } from "../../services/products.api";
import FilterSection from "../../components/FilterSection";
import { CategoryHierarchyFilter } from "../../components/CategoryHierarchyFilter";
import ProductsTable from "../../components/ProductsTable";
import CatalogCard from "../../components/CatalogCard";
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
import { AlertCircle, ArrowUpDown, ChevronDown, ChevronRight, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  CATALOG_SORT_OPTIONS,
  type CatalogProductSort,
} from "../../models/catalogSort";
import { Brand } from "../../models/brand";
import { Subcategory } from "../../models/subcategory";
import {
  collectSubcategoryIdsWithDescendants,
  findSubcategoryInTree,
} from "../../utils/subcategoryPath";
import { getCategoryFilterLabel } from "../../utils/categoryHierarchyFilter";
type CatalogViewLevel = "categories" | "subcategories" | "products";

/** Path of nodes from root to the node with targetId (inclusive). Uses tree traversal. */
function findSubcategoryPathInTree(
  nodes: Subcategory[],
  targetId: string,
  path: Subcategory[] = []
): Subcategory[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];
    if (node.id === targetId) return currentPath;
    if (node.children?.length) {
      const found = findSubcategoryPathInTree(node.children, targetId, currentPath);
      if (found) return found;
    }
  }
  return null;
}

/** Flatten a tree to a list, assigning parentId from traversal. Root-level subcategories get parentId null. */
function flattenTreeWithParents(
  nodes: Subcategory[],
  parentId: string | null = null
): Subcategory[] {
  const result: Subcategory[] = [];
  for (const node of nodes) {
    result.push({ ...node, parentId });
    if (node.children?.length) {
      result.push(...flattenTreeWithParents(node.children, node.id));
    }
  }
  return result;
}

/** Build path from target to root using the parentId chain (no dependency on nested structure). */
function findSubcategoryPathByParentId(
  tree: Subcategory[],
  targetId: string
): Subcategory[] | null {
  const flat = flattenTreeWithParents(tree);
  const byId = new Map(flat.map((n) => [n.id, n]));
  const path: Subcategory[] = [];
  let cur = byId.get(targetId) ?? null;
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId ? byId.get(cur.parentId) ?? null : null;
  }
  return path.length > 0 ? path : null;
}

const Catalogo = () => {
  const { loading: loadingBrands, brands: brandsMap, error: brandsError } = useBrands();
  const {
    getCategoryById,
    getCategoryFilters,
    peekCategoryFilters,
    error: categoriesError,
  } = useCategories();

  const brands = useMemo(
    () => Object.values(brandsMap || {}),
    [brandsMap]
  );

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [drillParentSubcategoryId, setDrillParentSubcategoryId] = useState<string | null>(null);
  const [viewLevel, setViewLevel] = useState<CatalogViewLevel>("categories");
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]> | undefined>(undefined);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(false);

  const [filtro, setFiltro] = useState({
    searchText: "",
    vehiculo: {
      selectedFilters: [] as Array<{ attributeId: string; value: string }>,
    },
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [catalogSort, setCatalogSort] = useState<CatalogProductSort>("sku_asc");
  const [viewMode] = useState<"cards" | "table">("cards");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const [activeVehicleFilters, setActiveVehicleFilters] = useState<
    Array<{ attributeId: string; attributeName: string; value: string }>
  >([]);
  const [vehicleFiltersResetKey, setVehicleFiltersResetKey] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  /** Cache breadcrumb paths by subcategoryId so levels are not lost across re-renders. */
  const [breadcrumbPathCache, setBreadcrumbPathCache] = useState<Record<string, Subcategory[]>>({});

  const fetchingCategoryRef = useRef<string | null>(null);
  const fetchingFiltersRef = useRef<string | null>(null);
  const hasRestoredSelectionsRef = useRef(false);

  const searchQuery = debouncedSearch;

  const filtersDict = useMemo(() => {
    if (filtro.vehiculo.selectedFilters.length > 0) {
      const dict: Record<string, string> = {};
      filtro.vehiculo.selectedFilters.forEach((f) => {
        dict[f.attributeId] = f.value;
      });
      return dict;
    }
    return undefined;
  }, [filtro.vehiculo.selectedFilters]);

  const availableCategories = useMemo(() => {
    const list = selectedBrand?.categories || [];
    return [...list].sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? "", undefined, { sensitivity: "base" })
    );
  }, [selectedBrand]);

  const categoryIdsForSubcategories = useMemo(
    () =>
      availableCategories
        .map((category) => category.id)
        .filter((id): id is string => Boolean(id)),
    [availableCategories]
  );

  const { map: subcategoriesByCategoryId } = useSubcategoriesMap(categoryIdsForSubcategories);

  const subcategoriesTree = useMemo<Subcategory[]>(
    () => (selectedCategory?.id ? subcategoriesByCategoryId.get(selectedCategory.id) ?? [] : []),
    [selectedCategory?.id, subcategoriesByCategoryId]
  );

  /** Tree used for breadcrumb path: ONLY hook data so the structure is always consistent. */
  const treeForBreadcrumbPath = useMemo<Subcategory[]>(
    () => (subcategoriesTree.length > 0 ? subcategoriesTree : []),
    [subcategoriesTree]
  );
  const drillParentSubcategory = useMemo(
    () =>
      drillParentSubcategoryId
        ? findSubcategoryInTree(subcategoriesTree, drillParentSubcategoryId)
        : null,
    [subcategoriesTree, drillParentSubcategoryId]
  );

  /** Path computed from the tree for the current subcategory (products view). */
  const computedBreadcrumbPath = useMemo((): Subcategory[] | null => {
    if (viewLevel !== "products" || !selectedSubcategoryId || treeForBreadcrumbPath.length === 0)
      return null;
    const byParent =
      findSubcategoryPathByParentId(treeForBreadcrumbPath, selectedSubcategoryId);
    const byTree = findSubcategoryPathInTree(treeForBreadcrumbPath, selectedSubcategoryId);
    return byParent ?? byTree;
  }, [viewLevel, selectedSubcategoryId, treeForBreadcrumbPath]);

  /** Cache the path when we have a complete one; never replace it with a shorter path. */
  useEffect(() => {
    if (
      viewLevel !== "products" ||
      !selectedSubcategoryId ||
      !computedBreadcrumbPath?.length
    )
      return;
    setBreadcrumbPathCache((prev) => {
      const cached = prev[selectedSubcategoryId];
      if (cached && cached.length >= computedBreadcrumbPath.length) return prev;
      return { ...prev, [selectedSubcategoryId]: computedBreadcrumbPath };
    });
  }, [viewLevel, selectedSubcategoryId, computedBreadcrumbPath]);

  const showProducts = viewLevel === "subcategories" || viewLevel === "products";

  const subcategoryFilterForProducts = useMemo((): string | string[] | null => {
    if (!showProducts || !selectedSubcategoryId) return null;
    const node = findSubcategoryInTree(subcategoriesTree, selectedSubcategoryId);
    if (!node) return selectedSubcategoryId;
    const ids = collectSubcategoryIdsWithDescendants(node);
    if (ids.length === 0) return selectedSubcategoryId;
    if (ids.length === 1) return ids[0];
    return ids;
  }, [showProducts, selectedSubcategoryId, subcategoriesTree]);

  const { data, isLoading, error: productsError } = useProductsByCategory(
    showProducts ? selectedCategory?.id : undefined,
    page,
    pageSize,
    searchQuery,
    filtersDict,
    subcategoryFilterForProducts,
    catalogSort
  );

  const products = (data as ProductsResponse | undefined)?.products ?? [];
  const totalItems = (data as ProductsResponse | undefined)?.total ?? 0;
  const totalPages = (data as ProductsResponse | undefined)?.totalPages ?? 1;

  const selectedCategoryFilterLabel = useMemo(
    () =>
      getCategoryFilterLabel(
        selectedCategory,
        selectedSubcategoryId,
        subcategoriesByCategoryId
      ),
    [selectedCategory, selectedSubcategoryId, subcategoriesByCategoryId]
  );

  // Restore catalog state (brand, category, level, subcategories) on mount.
  useEffect(() => {
    if (brands.length > 0 && !selectedBrand && !hasRestoredSelectionsRef.current) {
      const savedStateRaw = localStorage.getItem("catalogo-last-state");
      let restoredFromLastState = false;

      if (savedStateRaw) {
        try {
          const parsed = JSON.parse(savedStateRaw) as {
            brandId: string | null;
            categoryId: string | null;
            viewLevel: CatalogViewLevel;
            selectedSubcategoryId: string | null;
            drillParentSubcategoryId: string | null;
          };

          const brandFromState =
            parsed.brandId && brandsMap[parsed.brandId]
              ? brandsMap[parsed.brandId]
              : null;

          if (brandFromState) {
            setSelectedBrand(brandFromState);
            localStorage.setItem("catalogo-selected-marca", brandFromState.id);

            const categoryFromState =
              parsed.categoryId &&
              brandFromState.categories?.find((c) => c.id === parsed.categoryId);

            if (categoryFromState) {
              setSelectedCategory(categoryFromState);
              localStorage.setItem("catalogo-selected-categoria", categoryFromState.id);
              setViewLevel(parsed.viewLevel ?? "subcategories");
              setSelectedSubcategoryId(parsed.selectedSubcategoryId ?? null);
              setDrillParentSubcategoryId(parsed.drillParentSubcategoryId ?? null);
            } else {
              setViewLevel("categories");
            }

            hasRestoredSelectionsRef.current = true;
            restoredFromLastState = true;
          }
        } catch {
          // Si falla el parseo, seguimos con el flujo normal.
        }
      }

      // Fallback: lógica anterior basada solo en marca guardada.
      if (!restoredFromLastState) {
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
    }
  }, [brands, brandsMap, selectedBrand]);

  // Persist the last catalog state so it can be restored when returning from product detail.
  useEffect(() => {
    const snapshot = {
      brandId: selectedBrand?.id ?? null,
      categoryId: selectedCategory?.id ?? null,
      viewLevel,
      selectedSubcategoryId,
      drillParentSubcategoryId,
    };
    localStorage.setItem("catalogo-last-state", JSON.stringify(snapshot));
  }, [
    selectedBrand?.id,
    selectedCategory?.id,
    viewLevel,
    selectedSubcategoryId,
    drillParentSubcategoryId,
  ]);

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
      setLoadingFilterOptions(false);
      return;
    }

    const categoryId = selectedCategory.id;

    // Hydrate from cache synchronously so a remount/return-from-detail shows options instantly.
    const cachedOptions = peekCategoryFilters(categoryId);
    if (cachedOptions) {
      setFilterOptions(cachedOptions);
      setLoadingFilterOptions(false);
    }

    if (fetchingCategoryRef.current === categoryId) return;

    fetchingCategoryRef.current = categoryId;
    const controller = new AbortController();
    if (!cachedOptions) setLoadingFilterOptions(true);

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
        setLoadingFilterOptions(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        fetchingCategoryRef.current = null;
        setLoadingFilterOptions(false);
        console.error("Error fetching category data");
      });

    return () => {
      controller.abort();
      if (fetchingCategoryRef.current === categoryId) {
        fetchingCategoryRef.current = null;
      }
    };
  }, [selectedCategory?.id, getCategoryById, getCategoryFilters, peekCategoryFilters]);

  useEffect(() => {
    if (!selectedCategory?.id) return;
    const categoryId = selectedCategory.id;
    const hasFilters = filtro.vehiculo.selectedFilters.length > 0;

    const filtersDict: Record<string, string> | undefined = hasFilters
      ? filtro.vehiculo.selectedFilters.reduce<Record<string, string>>((acc, f) => {
          acc[f.attributeId] = f.value;
          return acc;
        }, {})
      : undefined;

    const cached = peekCategoryFilters(categoryId, filtersDict);
    if (cached) {
      setFilterOptions(cached);
      setLoadingFilterOptions(false);
      if (hasFilters) fetchingFiltersRef.current = null;
      return;
    }

    if (hasFilters) {
      if (fetchingFiltersRef.current === categoryId) return;
      fetchingFiltersRef.current = categoryId;
    }

    const controller = new AbortController();
    setLoadingFilterOptions(true);

    getCategoryFilters(categoryId, filtersDict, controller.signal)
      .then((options) => {
        if (controller.signal.aborted) return;
        if (options) {
          setFilterOptions(options);
        }
        if (hasFilters) fetchingFiltersRef.current = null;
        setLoadingFilterOptions(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        if (hasFilters) fetchingFiltersRef.current = null;
        setLoadingFilterOptions(false);
      });

    return () => {
      controller.abort();
      if (hasFilters && fetchingFiltersRef.current === categoryId) {
        fetchingFiltersRef.current = null;
      }
    };
  }, [
    selectedCategory?.id,
    filtro.vehiculo.selectedFilters,
    getCategoryFilters,
    peekCategoryFilters,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filtro.searchText.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [filtro.searchText]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateScreen = () => setIsLargeScreen(mediaQuery.matches);
    updateScreen();
    mediaQuery.addEventListener("change", updateScreen);
    return () => mediaQuery.removeEventListener("change", updateScreen);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filtro.vehiculo.selectedFilters, searchQuery, selectedSubcategoryId]);

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
      searchText: "",
      vehiculo: { selectedFilters: [] },
    });
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setFiltro({
      searchText: "",
      vehiculo: { selectedFilters: [] },
    });
    setSelectedSubcategoryId(null);
    setDrillParentSubcategoryId(null);
    setVehicleFiltersResetKey((k) => k + 1);
    setPage(1);
  };

  const clearSubcategoryFilter = () => {
    setSelectedSubcategoryId(null);
    setDrillParentSubcategoryId(null);
    if (selectedCategory) {
      setViewLevel("subcategories");
    }
    setPage(1);
    setIsFilterDrawerOpen(false);
  };

  const hasActiveCatalogFilters =
    filtro.searchText.trim() !== "" ||
    filtro.vehiculo.selectedFilters.length > 0 ||
    selectedSubcategoryId !== null;

  const handleCategoryCardClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategoryId(null);
    setDrillParentSubcategoryId(null);
    setBreadcrumbPathCache({});
    setViewLevel("subcategories");
    localStorage.setItem("catalogo-selected-categoria", category.id);
    setPage(1);
  };

  const handleBackFromDrill = () => {
    setDrillParentSubcategoryId(null);
    setPage(1);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategoryId(null);
    setDrillParentSubcategoryId(null);
    setBreadcrumbPathCache({});
    setViewLevel("categories");
    setPage(1);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategoryId(null);
    setDrillParentSubcategoryId(null);
    setViewLevel("subcategories");
    setPage(1);
  };

  const selectCategoryAndSubcategory = (cat: Category | null, subId: string | null) => {
    setSelectedCategory(cat);
    setSelectedSubcategoryId(subId);
    setDrillParentSubcategoryId(null);
    if (cat) {
      localStorage.setItem("catalogo-selected-categoria", cat.id);
      setViewLevel(subId ? "products" : "subcategories");
    } else {
      setViewLevel("categories");
    }
    setPage(1);
  };

  type BreadcrumbItem = { key: string; label: string; onClick?: () => void };
  const catalogBreadcrumb = useMemo((): BreadcrumbItem[] => {
    if (!selectedCategory) return [];
    const catId = selectedCategory.id ?? "";
    if (viewLevel === "subcategories") {
      const items: BreadcrumbItem[] = [
        { key: "breadcrumb-root", label: "Todas las categorías", onClick: handleBackToCategories },
        {
          key: `breadcrumb-cat-${catId}`,
          label: selectedCategory.name ?? "",
          onClick: drillParentSubcategoryId ? handleBackFromDrill : undefined,
        },
      ];

      let drillPath: Subcategory[] | null = null;
      if (drillParentSubcategoryId && treeForBreadcrumbPath.length > 0) {
        drillPath =
          findSubcategoryPathByParentId(treeForBreadcrumbPath, drillParentSubcategoryId) ??
          findSubcategoryPathInTree(treeForBreadcrumbPath, drillParentSubcategoryId);
      }

      if (drillPath?.length) {
        drillPath.forEach((node, i) => {
          const isLast = i === drillPath!.length - 1;
          items.push({
            key: `breadcrumb-sub-${node.id}`,
            label: node.name,
            onClick: isLast
              ? undefined
              : () => {
                setDrillParentSubcategoryId(node.id);
                setSelectedSubcategoryId(null);
                setPage(1);
              },
          });
        });
      } else if (drillParentSubcategoryId && drillParentSubcategory) {
        // Fallback a comportamiento anterior si por alguna razón no obtenemos un path completo
        items.push({ key: `breadcrumb-sub-${drillParentSubcategoryId}`, label: drillParentSubcategory.name });
      }

      return items;
    }
    if (viewLevel === "products" && selectedSubcategoryId) {
      // Preferir path en caché (evita que un re-render con árbol distinto quite niveles); si no hay o es más corto, usar el calculado.
      const pathNodes =
        breadcrumbPathCache[selectedSubcategoryId] ?? computedBreadcrumbPath ?? null;
      const items: BreadcrumbItem[] = [
        { key: "breadcrumb-root", label: "Todas las categorías", onClick: handleBackToCategories },
        { key: `breadcrumb-cat-${catId}`, label: selectedCategory.name ?? "", onClick: handleBackToSubcategories },
      ];
      if (pathNodes?.length) {
        pathNodes.forEach((node, i) => {
          const isLast = i === pathNodes.length - 1;
          items.push({
            key: `breadcrumb-sub-${node.id}`,
            label: node.name,
            onClick: isLast
              ? undefined
              : () => {
                const pathUpToHere = pathNodes.slice(0, i + 1);
                setBreadcrumbPathCache((prev) => ({ ...prev, [node.id]: pathUpToHere }));
                if (node.children?.length) {
                  setViewLevel("subcategories");
                  setDrillParentSubcategoryId(node.id);
                  setSelectedSubcategoryId(null);
                  setPage(1);
                } else {
                  setSelectedSubcategoryId(node.id);
                  setPage(1);
                }
              },
          });
        });
      }
      return items;
    }
    if (viewLevel === "products") {
      return [
        { key: "breadcrumb-root", label: "Todas las categorías", onClick: handleBackToCategories },
        { key: `breadcrumb-cat-${catId}`, label: selectedCategory.name ?? "", onClick: handleBackToSubcategories },
      ];
    }
    return [];
  }, [
    viewLevel,
    selectedCategory,
    drillParentSubcategoryId,
    drillParentSubcategory,
    selectedSubcategoryId,
    breadcrumbPathCache,
    computedBreadcrumbPath,
    treeForBreadcrumbPath,
  ]);

  const handleVehicleFilterChange = (filters: Array<{ attributeId: string; value: string }>) => {
    setFiltro((prev) => ({
      ...prev,
      vehiculo: {
        selectedFilters: filters,
      },
    }));
    setPage(1);
    if (filters.length > 0) {
      setIsFilterDrawerOpen(false);
    }
  };

  const removeVehicleFilterPill = (attributeId: string) => {
    const index = filtro.vehiculo.selectedFilters.findIndex((f) => f.attributeId === attributeId);
    if (index === -1) return;
    const nextFilters = filtro.vehiculo.selectedFilters.slice(0, index);
    setFiltro((prev) => ({
      ...prev,
      vehiculo: { selectedFilters: nextFilters },
    }));
    setVehicleFiltersResetKey((k) => k + 1);
    setPage(1);
  };

  const clearSearchFilterPill = () => {
    setFiltro((prev) => ({ ...prev, searchText: "" }));
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

  const currentSortLabel =
    CATALOG_SORT_OPTIONS.find((option) => option.value === catalogSort)?.label ?? "SKU (A-Z)";

  const renderSidebarSearch = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Buscar por SKU o referencia"
        value={filtro.searchText}
        onChange={(e) =>
          setFiltro((prev) => ({
            ...prev,
            searchText: e.target.value,
          }))
        }
        className="bg-white h-10 text-sm pl-10"
      />
    </div>
  );

  const renderCatalogSortSelect = () => (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      <span className="text-gray-600">Ordenar por</span>
      <Select
        value={catalogSort}
        onValueChange={(value) => {
          setCatalogSort(value as CatalogProductSort);
          setPage(1);
        }}
      >
        <SelectTrigger className="h-auto w-auto gap-1 border-0 bg-transparent p-0 shadow-none focus:ring-0 focus:ring-offset-0 [&>svg:last-child]:hidden">
          <span className="font-medium text-gray-900">{currentSortLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            {CATALOG_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );

  const renderVehicleFilters = () => {
    const categoryForFilters = categoryData || selectedCategory;
    if (!categoryForFilters) {
      return (
        <p className="text-gray-500 text-sm">
          Seleccione una categoría para ver los filtros de vehículo.
        </p>
      );
    }
    return (
      <FilterSection
        key={`vehicle-filters-${vehicleFiltersResetKey}-${categoryForFilters.id}`}
        category={categoryForFilters}
        filtroInfo={{
          numParte: "",
          referencia: "",
          vehiculo: filtro.vehiculo,
        }}
        onFilterChange={handleVehicleFilterChange}
        filterOptions={filterOptions}
        loadingFilterOptions={loadingFilterOptions}
        onActiveFiltersChange={setActiveVehicleFilters}
      />
    );
  };

  const renderBrandSelect = () => (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs sm:text-sm mb-1.5 text-gray-700">Línea de producto</Label>
      <Select onValueChange={handleBrandChange} value={selectedBrand?.id || ""}>
        <SelectTrigger className="h-9 sm:h-10 w-full">
          {selectedBrand ? (
            <div className="flex items-center gap-2">
              {selectedBrand.logoImgUrl ? (
                <img className="w-6 h-6 object-contain" src={selectedBrand.logoImgUrl} alt={selectedBrand.name} />
              ) : null}
              <span className="text-sm truncate">{selectedBrand.name}</span>
            </div>
          ) : (
            <SelectValue placeholder="Seleccionar Marca" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );


  const renderCategoryFilter = () => (
    <div className="flex flex-col">
      <Label className="font-semibold text-xs sm:text-sm mb-1.5 text-gray-700">Categoría</Label>
      <CategoryHierarchyFilter
        categories={availableCategories}
        subcategoriesByCategoryId={subcategoriesByCategoryId}
        selectedCategory={selectedCategory}
        selectedSubcategoryId={selectedSubcategoryId}
        onSelect={selectCategoryAndSubcategory}
      />
    </div>
  );



  const renderClearFiltersButton = (options?: { className?: string; disabled?: boolean }) => (
    <Button
      type="button"
      variant="outline"
      onClick={handleClearAllFilters}
      disabled={options?.disabled ?? !hasActiveCatalogFilters}
      className={cn(
        "w-full border-gray-300 text-gray-800 hover:bg-gray-50 disabled:opacity-50",
        options?.className
      )}
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Limpiar filtros
    </Button>
  );

  const hasMobileActiveFilterPills =
    searchQuery.trim() !== "" ||
    activeVehicleFilters.length > 0 ||
    selectedSubcategoryId !== null;

  const renderMobileActiveFilterPills = () => {
    if (!showProducts || !hasMobileActiveFilterPills) return null;

    return (
      <div className="mb-3 flex flex-wrap gap-2 lg:hidden">
        {searchQuery.trim() !== "" && (
          <button
            type="button"
            onClick={clearSearchFilterPill}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
          >
            {searchQuery.trim()}
            <X className="h-3.5 w-3.5 shrink-0 text-gray-500" aria-hidden />
          </button>
        )}
        {activeVehicleFilters.map((filter) => (
          <button
            key={filter.attributeId}
            type="button"
            onClick={() => removeVehicleFilterPill(filter.attributeId)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
          >
            {filter.value}
            <X className="h-3.5 w-3.5 shrink-0 text-gray-500" aria-hidden />
          </button>
        ))}
        {selectedSubcategoryId && selectedCategoryFilterLabel !== selectedCategory?.name && (
          <button
            type="button"
            onClick={clearSubcategoryFilter}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
          >
            {selectedCategoryFilterLabel}
            <X className="h-3.5 w-3.5 shrink-0 text-gray-500" aria-hidden />
          </button>
        )}
      </div>
    );
  };

  const renderMobileCatalogToolbar = () => (
    <div className="mb-4 flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:hidden">
      <button
        type="button"
        onClick={() => setIsSortDrawerOpen(true)}
        className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50"
      >
        <ArrowUpDown className="h-5 w-5 shrink-0" aria-hidden />
        Ordenar
      </button>
      <div className="w-px shrink-0 bg-gray-200" aria-hidden />
      <button
        type="button"
        onClick={() => setIsFilterDrawerOpen(true)}
        className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50"
      >
        <SlidersHorizontal className="h-5 w-5 shrink-0" aria-hidden />
        Filtrar
        {activeVehicleFilters.length > 0 ? (
          <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white">
            {activeVehicleFilters.length}
          </span>
        ) : null}
      </button>
    </div>
  );

  const renderCatalogHeader = () => (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 lg:mb-4">
        {catalogBreadcrumb.length > 0 ? (
          <nav className="flex flex-wrap items-center gap-1 text-sm min-w-0" aria-label="Navegación">
            {catalogBreadcrumb.map((item, i) => (
              <span key={item.key} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />}
                {item.onClick ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={item.onClick}
                    className="h-auto py-1 px-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    {item.label}
                  </Button>
                ) : (
                  <span className="text-gray-900 font-semibold py-1 px-2">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <div className="min-w-0 flex-1" />
        )}
        {showProducts && (
          <div className="ml-auto hidden shrink-0 lg:block">{renderCatalogSortSelect()}</div>
        )}
      </div>
      {showProducts && renderMobileCatalogToolbar()}
      {renderMobileActiveFilterPills()}
    </>
  );

  const renderSidebarContent = (options?: { showVehicleFilters?: boolean }) => {
    const showVehicleFilters = options?.showVehicleFilters ?? true;

    return (
      <>
        {renderSidebarSearch()}
        {renderBrandSelect()}
        {selectedBrand && renderCategoryFilter()}
        {showVehicleFilters && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Filtros de vehículo</h3>
            {activeVehicleFilters.length > 0 && (
              <div className="mb-3">{renderClearFiltersButton({ disabled: false })}</div>
            )}
            {renderVehicleFilters()}
          </div>
        )}
        {showVehicleFilters && renderClearFiltersButton()}
      </>
    );
  };

  const renderCatalogSidebar = () => (
    <aside className="hidden lg:block w-80 flex-shrink-0">
      <div className="overflow-visible rounded-lg bg-white p-4 shadow-sm sticky top-4 space-y-4">
        {renderSidebarContent({ showVehicleFilters: isLargeScreen })}
      </div>
    </aside>
  );

  const renderSortDrawer = () => (
    <Sheet open={isSortDrawerOpen} onOpenChange={setIsSortDrawerOpen}>
      <SheetContent side="bottom" className="rounded-t-xl px-4 pb-8 pt-6">
        <SheetHeader className="mb-4 text-left">
          <SheetTitle>Ordenar por</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1">
          {CATALOG_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setCatalogSort(option.value);
                setPage(1);
                setIsSortDrawerOpen(false);
              }}
              className={cn(
                "rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                catalogSort === option.value
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-800 hover:bg-gray-50"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  const renderFilterDrawer = () => (
    <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
      <SheetContent side="left" className="w-80 sm:w-96 p-0">
        <div className="p-4 border-b">
          <SheetHeader><SheetTitle>Filtros</SheetTitle></SheetHeader>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] space-y-4">
          {renderSidebarContent({ showVehicleFilters: true })}
        </div>
      </SheetContent>
    </Sheet>
  );

  if (loadingBrands) {
    return (
      <PlatinumLayout>
        <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8 bg-[#E4E4E4]">
          <div className="min-h-[280px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-naranja border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Cargando catálogo...</p>
            </div>
          </div>
        </section>
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

      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8 bg-[#E4E4E4]">
        {viewLevel === "categories" && selectedBrand && (
          <div className="mb-6 max-w-6xl mx-auto">
            <div className="mb-6 text-center space-y-2">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mt-6">
                Seleccione una categoría
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Elija una categoría para ver los productos relacionados del catálogo.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {availableCategories.map((category) => (
                <div
                  key={category.id}
                  className="w-full max-w-xs sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <CatalogCard
                    title={category.name}
                    imageUrl={category.imgUrl}
                    onClick={() => handleCategoryCardClick(category)}
                  />
                </div>
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
          <div className="flex gap-6">
            {renderCatalogSidebar()}
            {renderFilterDrawer()}
            {renderSortDrawer()}
            <div className="flex-1 min-w-0">
              {renderCatalogHeader()}

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
            </div>
          </div>
        )}

        {viewLevel === "products" && selectedCategory && (
          <div className="flex gap-6">
            {renderCatalogSidebar()}
            {renderFilterDrawer()}
            {renderSortDrawer()}
            <div className="flex-1 min-w-0">
              {renderCatalogHeader()}

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
            </div>
          </div>
        )}
      </section>
    </PlatinumLayout>
  );
};

export default Catalogo;
