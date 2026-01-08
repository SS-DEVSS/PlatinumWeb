import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  PaginationState,
  Updater
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Attribute, Category } from "../models/category";
import { AttributeValue, Item } from "../models/item";
import { useItemContext } from "../context/Item-context";
import { LayoutGrid, Table2, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductsTable = ({
  category,
  data,
  itemVariant,
  setItemVariant,
  filtroInfo,
  filtroTipo,
  onLoadingChange,
  products,
  loading = false,
  // Pagination props
  pageIndex = 0,
  pageSize = 10,
  pageCount = 0,
  totalItems = 0,
  onPaginationChange,
  hideViewToggle = false,
  viewMode: externalViewMode,
  setViewMode: externalSetViewMode,
}: {
  category: Category | null;
  data?: Item[] | null;
  products?: Item[];
  itemVariant?: Item | null;
  setItemVariant?: React.Dispatch<React.SetStateAction<Item | null>>;
  filtroInfo?: {
    numParte: string;
    referencia: string;
    vehiculo?: {
      selectedFilters?: Array<{ attributeId: string, value: string }>;
    }
  };
  filtroTipo?: "NumParte" | "Vehiculo" | "Referencia";
  onLoadingChange?: (isLoading: boolean) => void;
  loading?: boolean;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  totalItems?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  hideViewToggle?: boolean;
  viewMode?: "cards" | "table";
  setViewMode?: (mode: "cards" | "table") => void;
}) => {
  const [mappedData, setMappedData] = useState<Item[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState<boolean>(false);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [internalViewMode, setInternalViewMode] = useState<"table" | "cards">("cards");
  const [pageInputValue, setPageInputValue] = useState<string>("");

  // Track if we've ever received products with data (to distinguish initial empty state from "loaded but empty")
  const hasEverReceivedDataRef = useRef<boolean>(false);
  // Track last category ID to detect category changes
  const lastCategoryIdRef = useRef<string | null>(null);
  // Track if category changed in this effect run (preserve across the effect)
  const categoryChangedInThisRunRef = useRef<boolean>(false);

  // Use external viewMode if provided, otherwise use internal
  const currentViewMode = externalViewMode ?? internalViewMode;
  const handleViewModeChange = externalSetViewMode ?? setInternalViewMode;

  const onLoadingChangeRef = useRef(onLoadingChange);
  const isFirstLoad = useRef(true);
  const lastProcessedProductsRef = useRef<string>('');
  const isProcessingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previousLoadingRef = useRef<boolean | undefined>(undefined);

  // Keep ref updated
  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  const { attributes } = category || {};

  const location = useLocation();
  const navigate = useNavigate();
  const { setType, setVariant, setValuesAttributes } = useItemContext();

  const isInDetailsPage = useMemo(
    () =>
      location.pathname.includes("producto") ||
      location.pathname.includes("kit"),
    [location]
  );

  const handleClick = (row: Row<Item>) => {
    const product: Item = row.original;

    if (
      location.pathname.includes("producto") ||
      location.pathname.includes("kit")
    ) {
      if (setItemVariant) {
        setItemVariant(product);
      }
      return;
    } else {
      setVariant(product.id);
    }

    const type = product.type;
    if (type === "KIT") {
      setType("KIT");
      navigate(`/kit/${product.id}`);
    } else {
      setType("SINGLE");
      navigate(`/producto/${product.id}`);
    }
    localStorage.setItem("type", type);
  };

  const columns = useMemo(() => {
    const initialColumns = [
      {
        accessorKey: "image",
        header: "Imagen",
        cell: ({ row }: { row: Row<Item> }) => {
          const product: Item = row.original;
          // Get first image from product images, fallback to variant images
          const firstImage = product.images && product.images.length > 0
            ? product.images[0].url
            : (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0
              ? product.variants[0].images[0].url
              : null);

          return (
            <div className="flex items-center justify-center w-16 h-16">
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="flex flex-col items-center justify-center text-gray-400 w-12 h-12">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 w-12 h-12">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }: { row: Row<Item> }) => {
          const product: Item = row.original;
          return <div>{product.sku || "N/A"}</div>;
        },
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }: { row: Row<Item> }) => {
          const product: Item = row.original;
          return <div>{product.name}</div>;
        },
      },
    ];

    // Get product attribute columns
    const getProductAttributeColumns = () => {
      if (!attributes?.product || attributes.product.length === 0) return [];

      // Sort attributes by order field (ascending) before filtering
      const sortedAttributes = [...attributes.product].sort((a, b) => (a.order || 0) - (b.order || 0));

      return sortedAttributes
        .filter((attribute: Attribute) => {
          // Filter out "Descripción" and attributes that are explicitly set to not visible in catalog
          const nameLower = attribute.name.toLowerCase();
          const visibleInCatalog = (attribute as Attribute & { visibleInCatalog?: boolean }).visibleInCatalog;

          // Include if:
          // 1. Not "descripción" AND
          // 2. visibleInCatalog is not explicitly false (undefined/null/true are all OK)
          return nameLower !== "descripción" && visibleInCatalog !== false;
        })
        .map((attribute: Attribute) => ({
          accessorKey: attribute.id,
          header: attribute.displayName || attribute.name,
          cell: ({ row }: { row: Row<Item> }) => {
            const product: Item = row.original;
            const attrValue = product.attributeValues.find(
              (av: AttributeValue) => av.idAttribute === attribute.id
            );

            const fullValue =
              attrValue?.valueString ||
              attrValue?.valueNumber?.toString() ||
              attrValue?.valueBoolean?.toString() ||
              attrValue?.valueDate?.toDateString() ||
              "N/A";

            const valueStr = String(fullValue);
            const displayValue = valueStr.length > 30 ? `${valueStr.substring(0, 30)}...` : valueStr;

            return (
              <div
                className="truncate max-w-[200px]"
                title={valueStr}
              >
                {displayValue}
              </div>
            );
          },
        }));
    };

    const dynamicColumns = getProductAttributeColumns();

    return [
      ...initialColumns,
      ...dynamicColumns,
    ];
  }, [attributes]);

  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: mappedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    pageCount: pageCount, // Server-side page count
    state: {
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true, // Enable server-side pagination
    onPaginationChange: (updater: Updater<PaginationState>) => {
      // Calculate new values
      let newPageIndex = pageIndex;
      let newPageSize = pageSize;

      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        newPageIndex = newState.pageIndex;
        newPageSize = newState.pageSize;
      } else {
        newPageIndex = updater.pageIndex;
        newPageSize = updater.pageSize;
      }

      // Notify parent
      if (onPaginationChange) {
        onPaginationChange(newPageIndex, newPageSize);
      }
    },
  });

  // Process and set data
  useEffect(() => {
    const currentCategoryId = category?.id || null;
    const categoryChanged = lastCategoryIdRef.current !== null && lastCategoryIdRef.current !== currentCategoryId;

    // If category changed, reset hasEverReceivedDataRef for the new category
    if (categoryChanged) {
      hasEverReceivedDataRef.current = false;
      categoryChangedInThisRunRef.current = true; // Preserve this flag for the completion check
      lastCategoryIdRef.current = currentCategoryId;
    } else {
      categoryChangedInThisRunRef.current = false; // Reset flag if category didn't change
      if (lastCategoryIdRef.current === null) {
        // First time setting category
        lastCategoryIdRef.current = currentCategoryId;
      }
    }

    // Create a hash of current products + filters + pageIndex to detect actual changes
    const productsHash = JSON.stringify({
      productIds: products?.map(p => p.id) || [],
      categoryId: category?.id || '',
      pageIndex, // Include pageIndex in hash to detect pagination changes
      filtroTipo,
      referencia: filtroInfo?.referencia || '',
      numParte: filtroInfo?.numParte || '',
      vehiculoFilters: filtroInfo?.vehiculo?.selectedFilters || []
    });

    // Detect category change from hash comparison (more reliable than ref comparison)
    // This catches cases where the category changes but the ref-based detection didn't catch it
    let categoryChangedFromHash = false;
    if (lastProcessedProductsRef.current) {
      try {
        const lastHash = JSON.parse(lastProcessedProductsRef.current);
        const currentHash = JSON.parse(productsHash);
        categoryChangedFromHash = lastHash.categoryId !== currentHash.categoryId && lastHash.categoryId !== '';
      } catch {
        // If parsing fails, fall back to ref-based detection
        categoryChangedFromHash = categoryChanged;
      }
    }

    // Use hash-based detection if available, otherwise use ref-based
    // Hash-based detection is more reliable because it compares the actual categoryId in the hash
    const finalCategoryChanged = categoryChangedFromHash || categoryChanged;
    if (finalCategoryChanged) {
      // Always set the flag if category changed (either method detected it)
      if (!categoryChangedInThisRunRef.current) {
        hasEverReceivedDataRef.current = false;
        categoryChangedInThisRunRef.current = true;
        // Update ref to current category
        if (categoryChangedFromHash || categoryChanged) {
          lastCategoryIdRef.current = currentCategoryId;
        }
      }
    } else {
      // Reset flag if category didn't change
      categoryChangedInThisRunRef.current = false;
    }

    // Skip if we're already processing the same data
    if (lastProcessedProductsRef.current === productsHash) {
      // Still need to check if we should show no results if processing is complete and data is empty
      if (isProcessingComplete && mappedData.length === 0 && !showNoResults) {
        setShowNoResults(true);
      }
      // IMPORTANT: If loading is false and we have data, ensure processing is complete
      if (!loading && mappedData.length > 0 && !isProcessingComplete) {
        setIsProcessingComplete(true);
        setShowNoResults(false);
      }
      return;
    }

    // Mark as processing and store hash
    // Store the OLD hash before updating, so we can check if data actually changed
    lastProcessedProductsRef.current = productsHash;
    isProcessingRef.current = true;

    setIsDataLoaded(false);
    setIsProcessingComplete(false);
    setShowNoResults(false);

    // Don't reset hasEverReceivedDataRef - we want to remember if we've seen data before
    // This helps distinguish "initial empty state" from "loaded but empty after filtering"

    // Only reset to first page if it's not the first load or if data source has changed
    // Note: With server-side pagination, the parent controls pageIndex, so we don't reset it here.
    // But we might want to notify parent to reset if filters changed? 
    // The parent (Catalogo) should handle reset when filters change.

    isFirstLoad.current = false;

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isInDetailsPage && data) {
      // In detail page, use provided data (compatibility variants)
      setMappedData(data);
      setIsDataLoaded(true);
      setIsProcessingComplete(true);

      if (data.length === 0) {
        setShowNoResults(true);
      } else {
        setShowNoResults(false);
      }

      isProcessingRef.current = false;
    } else {
      // Make sure products is not undefined before proceeding
      if (products === undefined || products === null) {
        // Don't mark as complete if products is undefined - data hasn't loaded yet
        isProcessingRef.current = false;
        return;
      }

      // Since we are doing server-side pagination, 'products' contains only the current page's items.
      // We don't need to do complex filtering here anymore for basic view, 
      // BUT for 'Vehiculo' filter which is client-side, we might still need to filter the *current page*.
      // However, if the user expects 'Vehiculo' filter to work across ALL products, we have a problem.
      // For now, we assume the parent passes the correct filtered/paginated products.

      let filteredProducts = products;

      // Apply client-side filtering for 'Vehiculo' on the current page
      // This is a limitation of current backend, but better than no filter or slow load.
      if (filtroTipo === "Vehiculo" && filtroInfo?.vehiculo?.selectedFilters && filtroInfo.vehiculo.selectedFilters.length > 0) {
        const usingApplicationAttributes = category?.attributes?.application && category.attributes.application.length > 0;

        if (usingApplicationAttributes) {
          filteredProducts = filteredProducts.filter((product: Item) => {
            if (!product.applications || product.applications.length === 0) return false;

            return product.applications.some(application => {
              return filtroInfo!.vehiculo!.selectedFilters!.every(filter => {
                const attrValue = application.attributeValues.find(av => av.idAttribute === filter.attributeId);
                const value = attrValue?.valueString ||
                  attrValue?.valueNumber?.toString() ||
                  attrValue?.valueBoolean?.toString() ||
                  attrValue?.valueDate?.toString();
                return value === filter.value;
              });
            });
          });
        }
      }

      // Track if we've ever received data (products with length > 0)
      if (filteredProducts.length > 0) {
        hasEverReceivedDataRef.current = true;
      }

      setMappedData(filteredProducts);
      setIsDataLoaded(true);

      // Track loading transition: true -> false means data just finished loading
      const loadingJustFinished = previousLoadingRef.current === true && loading === false;

      // Check if this hash has actual product data (not just empty array)
      const hashHasProducts = (products?.length || 0) > 0;

      // Only mark as processing complete if:
      // 1. We have data (filteredProducts.length > 0), OR
      // 2. Loading just finished (transitioned from true to false) - this means a load completed, OR
      // 3. We've received data before (hasEverReceivedDataRef) - means we've seen data for this category/page before, OR
      // 4. Category changed in this run AND loading is false - when category changes, if loading is false, the data we have is the final state, OR
      // 5. Loading is false AND we've processed the data - if parent says loading is done, we should mark complete
      //    (either empty or populated, but it's what we got for that category)
      // IMPORTANT: If loading is false, it means the fetch completed (even if empty), so we should mark complete
      const categoryChangedInThisRun = categoryChangedInThisRunRef.current;
      const shouldMarkComplete = (
        filteredProducts.length > 0 ||
        loadingJustFinished ||
        hasEverReceivedDataRef.current ||
        (categoryChangedInThisRun && !loading) || // Category changed and loading is done = valid final state
        !loading // If loading is false, the fetch is complete (even if empty)
      );

      // Update previous loading ref after checking transition
      previousLoadingRef.current = loading;

      if (shouldMarkComplete) {
        setIsProcessingComplete(true);

        if (filteredProducts.length === 0) {
          setShowNoResults(true);
        } else {
          setShowNoResults(false);
        }
      } else {
        // Keep isProcessingComplete as false while loading or if this is initial empty state
        setIsProcessingComplete(false);
        setShowNoResults(false);
      }

      isProcessingRef.current = false;
    }

    // Notify parent that processing is complete
    // if (onLoadingChangeRef.current) {
    //   setTimeout(() => {
    //     onLoadingChangeRef.current?.(false);
    //     isProcessingRef.current = false;
    //   }, 150);
    // } else {
    isProcessingRef.current = false;
    // }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    products,
    data,
    isInDetailsPage,
    filtroTipo,
    filtroInfo,
    category,
    loading,
    pageIndex,
    // isDataLoaded, isProcessingComplete, mappedData.length, and showNoResults are intentionally excluded
    // to prevent infinite loops since they are set within this effect
  ]);

  useEffect(() => {
    if (!isDataLoaded || !products || products.length === 0) return;

    // Use application attributes for hierarchical filtering
    const filterAttributes = category?.attributes?.application || [];

    if (!filterAttributes || filterAttributes.length === 0) {
      setValuesAttributes([]);
      return;
    }

    // Extract attribute values from applications for hierarchical filtering
    const getAttributeValues = (attributeId: string) => {
      // Get values from applications
      const allApplications = products.flatMap((product: Item) =>
        product.applications || []
      );

      return allApplications
        .filter((application) =>
          application.attributeValues.some((attribute: AttributeValue) => {
            return attribute.idAttribute === attributeId;
          })
        )
        .map((application) =>
          application.attributeValues.filter((attribute) =>
            attribute.idAttribute === attributeId
          )
        );
    };

    const attributeIdList = filterAttributes.map(
      (attribute: Attribute) => attribute.id
    );

    const valuesMapped = attributeIdList.map((attributeId: string) => {
      const values = getAttributeValues(attributeId);
      return {
        attributeId,
        values,
      };
    });

    setValuesAttributes(valuesMapped);
  }, [products, isDataLoaded, category, setValuesAttributes]); // Added setValuesAttributes


  // Reset showNoResults when loading starts and fix state when loading stops
  useEffect(() => {
    if (loading) {
      setShowNoResults(false);
      previousLoadingRef.current = loading;
    } else {
      // Update previous loading ref
      previousLoadingRef.current = loading;

      // When loading is false and processing is not complete, we should mark it complete
      // This handles both transitions (loadingJustFinished) and cases where loading was already false
      if (!isProcessingComplete) {
        if (mappedData.length > 0) {
          setIsProcessingComplete(true);
          setShowNoResults(false);
          hasEverReceivedDataRef.current = true;

        } else if (hasEverReceivedDataRef.current) {
          setIsProcessingComplete(true);
          setShowNoResults(true);
        } else if (products && products.length === 0) {
          // Loading is false and empty products array = valid empty state (fetch completed with no results)
          setIsProcessingComplete(true);
          setShowNoResults(true);
        }
      }
    }
  }, [loading, pageIndex, category?.id, isProcessingComplete, mappedData.length, products]);

  // Calculate page info
  const totalPages = pageCount;
  const currentPageItems = table.getRowModel().rows || [];
  const currentPageIndex = pageIndex;
  const startItem = currentPageIndex * pageSize + 1;
  // If server side totalItems is provided, use it. Otherwise estimate.
  const endItem = Math.min((currentPageIndex + 1) * pageSize, totalItems || (currentPageIndex * pageSize + mappedData.length));

  // Sync page input value with current page
  useEffect(() => {
    setPageInputValue(String(currentPageIndex + 1));
  }, [currentPageIndex]);

  // Handle page navigation
  const handlePageNavigation = () => {
    const pageNum = parseInt(pageInputValue);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      if (onPaginationChange) {
        onPaginationChange(pageNum - 1, pageSize); // Convert to 0-indexed
      }
    } else {
      // Reset to current page if invalid
      setPageInputValue(String(currentPageIndex + 1));
    }
  };

  // Handle Enter key press
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageNavigation();
    }
  };

  // Get image URL for a product
  const getProductImageUrl = (product: Item): string | null => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    } else if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
      return product.variants[0].images[0].url;
    }
    return null;
  };

  // Format references for display
  const formatReferences = (product: Item): string[] => {
    if (!product.references) return [];
    return product.references.map((ref: string | { referenceNumber?: string }) => {
      if (typeof ref === 'string') return ref;
      return (ref as { referenceNumber?: string }).referenceNumber || '';
    }).filter(Boolean) as string[];
  };

  // if (loading) {
  //   return (
  //     <div className="mt-6 relative">
  //       <div className="flex flex-col items-center justify-center h-full">
  //         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-naranja"></div>
  //         <span className="mt-2 text-sm text-gray-600 font-medium">Cargando...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="mt-6 relative">
      {/* View Toggle - Only show if not hidden */}
      {!hideViewToggle && (
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant={currentViewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("cards")}
              className="flex items-center gap-1 sm:gap-2"
              title="Vista de tarjetas"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Tarjetas</span>
            </Button>
            <Button
              variant={currentViewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("table")}
              className="flex items-center gap-1 sm:gap-2"
              title="Vista de tabla"
            >
              <Table2 className="h-4 w-4" />
              <span className="hidden sm:inline">Tabla</span>
            </Button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {/* {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-naranja"></div>
            <span className="mt-2 text-sm text-gray-600 font-medium">Cargando...</span>
          </div>
        </div>
      )} */}

      <>
        {currentViewMode === "table" ? (
          <Card className={`border overflow-hidden ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          className="bg-[#333333] text-[#C4C4C4] first:rounded-tl-lg last:rounded-tr-lg"
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {(() => {
                    // 1. Check if loading (prop OR processing not complete)
                    if (loading || !isProcessingComplete) {
                      // Show multiple skeleton rows for table view
                      return Array.from({ length: pageSize }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          {columns.map((_, colIndex) => (
                            <TableCell key={`skeleton-${index}-${colIndex}`} className="py-0.5" style={{ height: '60px' }}>
                              <div className="animate-pulse">
                                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ));
                    }

                    // 2. Check if there's data - show data
                    if (mappedData.length > 0) {
                      return currentPageItems.map((row, index) => {
                        const isLastRow = index === currentPageItems.length - 1;
                        return (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            onClick={() => handleClick(row)}
                            className={`cursor-pointer hover:bg-orange-200 odd:bg-[#f5f5f5] even:bg-white`}
                            style={{
                              backgroundColor:
                                itemVariant && row.original.id === itemVariant.id ? "#d87e2e" : "",
                              borderBottomLeftRadius: isLastRow
                                ? "12px !important"
                                : "0",
                              borderBottomRightRadius: isLastRow
                                ? "12px !important"
                                : "0",
                            }}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="py-0.5" style={{ height: '60px' }}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      });
                    }

                    // 3. No data and processing complete - show empty message
                    return (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="text-center">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    );
                  })()}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          /* Card Grid View */
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {(() => {
              // 1. Check if loading (prop OR processing not complete)
              if (loading || !isProcessingComplete) {
                return (
                  <>
                    {Array.from({ length: pageSize }).map((_, index) => (
                      <ProductCardSkeleton key={`skeleton-${index}`} />
                    ))}
                  </>
                );
              }

              // 2. Check if there's data - show data
              if (mappedData.length > 0) {
                return currentPageItems.map((row) => {
                  const product: Item = row.original;
                  const imageUrl = getProductImageUrl(product);
                  const references = formatReferences(product);
                  const isSelected = itemVariant && product.id === itemVariant.id;

                  return (
                    <Card
                      key={product.id}
                      className={`cursor-pointer hover:shadow-lg transition-shadow overflow-hidden ${isSelected ? 'ring-2 ring-naranja' : ''
                        }`}
                      onClick={() => handleClick(row)}
                    >
                      {/* Product Image */}
                      <div className="w-full aspect-square bg-white flex items-center justify-center p-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                <div class="flex flex-col items-center justify-center text-gray-400">
                                  <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              `;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <CardContent className="p-4 bg-gray-50">
                        {/* SKU */}
                        <div className="mb-2">
                          <span className="text-xs text-gray-600 font-medium">No. Parte: </span>
                          <span className="text-sm font-semibold text-naranja">{product.sku || 'N/A'}</span>
                        </div>

                        {/* Product Name */}
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>

                        {/* References */}
                        {references.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-600 font-medium">Referencias: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {references.slice(0, 2).map((ref: string, index: number) => (
                                <span key={index} className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded">
                                  {ref}
                                </span>
                              ))}
                              {references.length > 2 && (
                                <span className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded">
                                  +{references.length - 2} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                });
              }

              // 3. No data and processing complete - show empty message
              return (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {showNoResults ? 'No se encontraron resultados.' : 'Cargando...'}
                </div>
              );
            })()}
          </div>
        )}
        {isProcessingComplete && mappedData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:space-x-4 py-4 sm:py-6 bg-gray-50 rounded-lg px-3 sm:px-4 border border-gray-200 mt-6">
            <div className="text-xs sm:text-sm font-medium text-gray-700 text-center sm:text-left">
              Mostrando <span className="font-semibold text-gray-900">{startItem}</span> - <span className="font-semibold text-gray-900">{endItem}</span> de <span className="font-semibold text-gray-900">{totalItems}</span> resultados
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="h-9 px-3 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-9 px-3 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  Página{" "}
                  <strong className="text-gray-900 font-semibold">
                    {table.getState().pagination.pageIndex + 1}
                  </strong>{" "}
                  de{" "}
                  <strong className="text-gray-900 font-semibold">
                    {totalPages || 1}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap hidden sm:inline">Ir a:</span>
                <Input
                  type="number"
                  min={1}
                  max={totalPages || 1}
                  value={pageInputValue}
                  onChange={(e) => setPageInputValue(e.target.value)}
                  onKeyDown={handlePageInputKeyDown}
                  onBlur={handlePageNavigation}
                  className="h-9 w-16 sm:w-20 px-2 text-xs sm:text-sm text-center border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Pág"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-9 px-3 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!table.getCanNextPage()}
                className="h-9 px-3 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
              <select
                value={pageSize}
                onChange={e => {
                  const newPageSize = Number(e.target.value);
                  // table.setPageSize(newPageSize); // controlled via prop update
                  if (onPaginationChange) {
                    onPaginationChange(0, newPageSize); // Reset to first page
                  }
                }}
                className="h-9 px-2 sm:px-3 pr-6 sm:pr-8 text-xs sm:text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow cursor-pointer font-medium text-gray-700"
              >
                {[8, 12, 16, 20, 24].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Mostrar {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default ProductsTable;