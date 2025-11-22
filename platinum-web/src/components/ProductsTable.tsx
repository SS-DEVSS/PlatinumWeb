import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
// import { useProducts } from "../hooks/useProducts";

const ProductsTable = ({
  category,
  data,
  itemVariant,
  setItemVariant,
  filtroInfo,
  filtroTipo,
  onLoadingChange,
  products, // Receive products as prop
  loading = false, // Add loading prop
}: {
  category: Category | null;
  data?: Item[] | null; // Used for details page
  products?: Item[]; // Used for main catalog
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
}) => {
  const [mappedData, setMappedData] = useState<Item[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState<boolean>(false);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const isFirstLoad = useRef(true);
  const lastProcessedProductsRef = useRef<string>('');
  const isProcessingRef = useRef(false);

  // Keep ref updated
  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  const { attributes } = category || {};
  // const { products } = useProducts(); // Remove internal fetch

  const location = useLocation();
  const navigate = useNavigate();
  const { setType, setVariant, setValuesAttributes } = useItemContext();

  const isInDetailsPage = useMemo(
    () =>
      location.pathname.includes("producto") ||
      location.pathname.includes("kit"),
    [location]
  );

  const handleClick = (row: any) => {
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
        cell: ({ row }: { row: any }) => {
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        cell: ({ row }: { row: any }) => {
          const product: Item = row.original;
          return <div>{product.sku || "N/A"}</div>;
        },
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }: { row: any }) => {
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
          const visibleInCatalog = (attribute as any).visibleInCatalog;

          // Include if:
          // 1. Not "descripción" AND
          // 2. visibleInCatalog is not explicitly false (undefined/null/true are all OK)
          return nameLower !== "descripción" && visibleInCatalog !== false;
        })
        .map((attribute: Attribute) => ({
          accessorKey: attribute.id,
          header: attribute.displayName || attribute.name,
          cell: ({ row }: { row: any }) => {
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
  }, [attributes, location]);

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
    state: {
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
    onPaginationChange: (updater: unknown) => {
      if (typeof updater === 'function') {
        const newPagination = updater(table.getState().pagination);
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      } else if (typeof updater === 'object' && updater !== null && 'pageIndex' in updater) {
        setPageIndex((updater as { pageIndex: number }).pageIndex);
        if ('pageSize' in updater) {
          setPageSize((updater as { pageSize: number }).pageSize);
        }
      }
    },
    manualPagination: false,
  });

  // Process and set data - FIXED VERSION
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
    if (hasDataToProcess && onLoadingChangeRef.current) {
      onLoadingChangeRef.current(true);
    }

    setIsDataLoaded(false);
    setIsProcessingComplete(false);
    setShowNoResults(false);

    // Only reset to first page if it's not the first load or if data source has changed
    if (!isFirstLoad.current) {
      table.setPageIndex(0);
      setPageIndex(0);
    }
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
      if (onLoadingChangeRef.current) {
        setTimeout(() => {
          onLoadingChangeRef.current?.(false);
          isProcessingRef.current = false;
        }, 150);
      } else {
        isProcessingRef.current = false;
      }
    } else {
      // Make sure products is not undefined or empty before proceeding
      if (!products || products.length === 0) {
        setMappedData([]);
        setIsDataLoaded(true);
        setIsProcessingComplete(true);

        timer = setTimeout(() => setShowNoResults(true), 200);

        // Notify parent that processing is complete (even if no products)
        if (onLoadingChangeRef.current) {
          setTimeout(() => {
            onLoadingChangeRef.current?.(false);
            isProcessingRef.current = false;
          }, 150);
        } else {
          isProcessingRef.current = false;
        }
        return () => clearTimeout(timer);
      }

      // First filter products by category if a category is provided
      let filteredProducts = products;
      if (category && category.id) {
        filteredProducts = products.filter((product: Item) =>
          product.category && product.category.id === category.id
        );
      }

      // Handle filtering based on filter type
      if (filtroTipo === "Referencia" && filtroInfo?.referencia && filtroInfo.referencia.trim() !== "") {
        // Filter by reference if provided (maintain category filtering)
        filteredProducts = filteredProducts.filter((product: Item) =>
          product.references?.some((ref) => {
            // Handle both old format (string) and new format (Reference object)
            const refValue = typeof ref === 'string' ? ref : ref.referenceNumber;
            return refValue?.toLowerCase().includes(filtroInfo.referencia.toLowerCase());
          })
        );
      }
      else if (filtroTipo === "NumParte" && filtroInfo?.numParte && filtroInfo.numParte.trim() !== "") {
        // Filter by product SKU if provided (maintain category filtering)
        filteredProducts = filteredProducts.filter((product: Item) =>
          product.sku?.toLowerCase().includes(filtroInfo.numParte.toLowerCase())
        );
      }
      else if (filtroTipo === "Vehiculo" && filtroInfo?.vehiculo?.selectedFilters && filtroInfo.vehiculo.selectedFilters.length > 0) {
        // Filter based on application attributes (vehicle filtering)
        const usingApplicationAttributes = category?.attributes?.application && category.attributes.application.length > 0;

        if (usingApplicationAttributes) {
          // Filter using application attributes (vehicle filtering)
          // A product matches if ANY of its applications matches ALL the selected filters
          filteredProducts = filteredProducts.filter((product: Item) => {
            if (!product.applications || product.applications.length === 0) return false;

            // Check if any application matches all filters
            return product.applications.some(application => {
              return filtroInfo.vehiculo!.selectedFilters!.every(filter => {
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
        // Note: If no application attributes, we can't filter by vehicle
      }

      setMappedData(filteredProducts);
      // Set both states at the same time - no timeout needed
      setIsDataLoaded(true);
      setIsProcessingComplete(true);

      // Handle "No Results" state with a delay to prevent flash
      if (filteredProducts.length === 0) {
        // Only set timeout if not currently loading
        if (!loading) {
          timer = setTimeout(() => setShowNoResults(true), 200);
        }
      } else {
        setShowNoResults(false);
      }
    }

    // Notify parent that processing is complete (after state updates)
    // Use setTimeout to ensure React has processed the state updates
    if (onLoadingChangeRef.current) {
      setTimeout(() => {
        onLoadingChangeRef.current?.(false);
        isProcessingRef.current = false;
      }, 150);
    } else {
      isProcessingRef.current = false;
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    products,
    data,
    location,
    filtroTipo,
    filtroInfo?.referencia,
    filtroInfo?.numParte,
    filtroInfo?.vehiculo?.selectedFilters,
    category
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
  }, [products, isDataLoaded, category]);


  // Reset showNoResults when loading starts
  useEffect(() => {
    if (loading) {
      setShowNoResults(false);
    }
  }, [loading]);

  // Calculate page info
  const totalPages = table.getPageCount();
  const currentPageItems = table.getRowModel().rows || [];
  const currentPageIndex = table.getState().pagination.pageIndex;
  const startItem = currentPageIndex * pageSize + 1;
  const endItem = Math.min((currentPageIndex + 1) * pageSize, mappedData.length);

  return (
    <div className="mt-6">
      <>
        <Card className="border overflow-hidden">
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
              Mostrando {startItem} - {endItem} de {mappedData.length} resultados
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
                  setPageSize(newPageSize);
                  table.setPageSize(newPageSize);
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