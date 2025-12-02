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
import { Card } from "./ui/card";
import { Attribute, Category } from "../models/category";
import { AttributeValue, Item } from "../models/item";
import { useItemContext } from "../context/Item-context";

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
}) => {
  const [mappedData, setMappedData] = useState<Item[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState<boolean>(false);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);

  const onLoadingChangeRef = useRef(onLoadingChange);
  const isFirstLoad = useRef(true);
  const lastProcessedProductsRef = useRef<string>('');
  const isProcessingRef = useRef(false);

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
          // Get first image from first variant if available
          const firstImage = product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0
            ? product.variants[0].images[0].url
            : null;

          return (
            <div className="flex items-center justify-center w-16 h-16">
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
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
    // Create a hash of current products + filters to detect actual changes
    const productsHash = JSON.stringify({
      productIds: products?.map(p => p.id) || [],
      categoryId: category?.id || '',
      filtroTipo,
      referencia: filtroInfo?.referencia || '',
      numParte: filtroInfo?.numParte || '',
      vehiculoFilters: filtroInfo?.vehiculo?.selectedFilters || []
    });

    // Skip if we're already processing the same data
    if (lastProcessedProductsRef.current === productsHash) {
      return;
    }

    // Mark as processing and store hash
    lastProcessedProductsRef.current = productsHash;
    isProcessingRef.current = true;

    // Only set loading if we have data to process (not on initial empty state)
    const hasDataToProcess = (products && products.length > 0) || (isInDetailsPage && data);

    // Remove modifying parent's loading state from here
    // if (hasDataToProcess && onLoadingChangeRef.current) {
    //   onLoadingChangeRef.current(true);
    // }

    setIsDataLoaded(false);
    setIsProcessingComplete(false);
    setShowNoResults(false);

    // Only reset to first page if it's not the first load or if data source has changed
    // Note: With server-side pagination, the parent controls pageIndex, so we don't reset it here.
    // But we might want to notify parent to reset if filters changed? 
    // The parent (Catalogo) should handle reset when filters change.

    isFirstLoad.current = false;

    let timer: NodeJS.Timeout;

    if (isInDetailsPage && data) {
      // In detail page, use provided data (compatibility variants)
      setMappedData(data);
      setIsDataLoaded(true);
      setIsProcessingComplete(true);

      if (data.length === 0) {
        timer = setTimeout(() => setShowNoResults(true), 200);
      } else {
        setShowNoResults(false);
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
    } else {
      // Make sure products is not undefined or empty before proceeding
      if (!products) {
        setMappedData([]);
        setIsDataLoaded(true);
        setIsProcessingComplete(true);

        // if (onLoadingChangeRef.current) {
        //   setTimeout(() => {
        //     onLoadingChangeRef.current?.(false);
        //     isProcessingRef.current = false;
        //   }, 150);
        // } else {
        isProcessingRef.current = false;
        // }
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

      setMappedData(filteredProducts);
      setIsDataLoaded(true);
      setIsProcessingComplete(true);

      if (filteredProducts.length === 0) {
        if (!loading) {
          timer = setTimeout(() => setShowNoResults(true), 200);
        }
      } else {
        setShowNoResults(false);
      }
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
      if (timer) clearTimeout(timer);
    };
  }, [
    products,
    data,
    isInDetailsPage,
    filtroTipo,
    filtroInfo, // Added filtroInfo
    category,
    loading
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


  // Reset showNoResults when loading starts
  useEffect(() => {
    if (loading) {
      setShowNoResults(false);
    }
  }, [loading]);

  // Calculate page info
  const totalPages = pageCount;
  const currentPageItems = table.getRowModel().rows || [];
  const currentPageIndex = pageIndex;
  const startItem = currentPageIndex * pageSize + 1;
  // If server side totalItems is provided, use it. Otherwise estimate.
  const endItem = Math.min((currentPageIndex + 1) * pageSize, totalItems || (currentPageIndex * pageSize + mappedData.length));

  return (
    <div className="mt-6 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-naranja"></div>
            <span className="mt-2 text-sm text-gray-600 font-medium">Cargando...</span>
          </div>
        </div>
      )}

      <>
        <Card className={`border overflow-hidden ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
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
              {isProcessingComplete && mappedData.length > 0 ? (
                currentPageItems.map((row, index) => {
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
                })
              ) : isProcessingComplete && showNoResults ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
        {isProcessingComplete && mappedData.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Mostrando {startItem} - {endItem} de {totalItems} resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                &lt;&lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                &lt;
              </Button>
              <span className="text-sm">
                Página{" "}
                <strong>
                  {table.getState().pagination.pageIndex + 1} de {totalPages || 1}
                </strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                &gt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!table.getCanNextPage()}
              >
                &gt;&gt;
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
                className="border rounded px-2 py-1 text-sm"
              >
                {[10, 20, 30, 50].map(pageSize => (
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