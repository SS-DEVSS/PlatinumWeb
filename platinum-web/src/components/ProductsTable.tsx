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
import { useEffect, useMemo, useState, useRef } from "react";
import { Attribute, Category } from "../models/category";
import { AttributeValue, Item } from "../models/item";
import { useItemContext } from "../context/Item-context";
import { useProducts } from "../hooks/useProducts";

const ProductsTable = ({
  category,
  data,
  itemVariant,
  setItemVariant,
  filtroInfo,
  filtroTipo,
}: {
  category: Category | null;
  data?: Item[] | null;
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
}) => {
  const [mappedData, setMappedData] = useState<Item[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const isFirstLoad = useRef(true);

  const { attributes } = category || {};
  const { products } = useProducts();

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

    // Debug: Log columns to verify they're being created
    console.log('[ProductsTable] Attribute columns:', dynamicColumns.length, dynamicColumns.map((col: any) => col.header));

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
    console.log(`[ProductsTable] useEffect triggered:`, {
      isInDetailsPage,
      hasData: !!data,
      dataLength: data?.length,
      hasProducts: !!products,
      productsLength: products?.length,
      categoryId: category?.id,
      filtroTipo,
      filtroInfo
    });

    setIsDataLoaded(false);
    setIsProcessingComplete(false);

    // Only reset to first page if it's not the first load or if data source has changed
    if (!isFirstLoad.current) {
      table.setPageIndex(0);
      setPageIndex(0);
    }
    isFirstLoad.current = false;

    if (isInDetailsPage && data) {
      // In detail page, use provided data (compatibility variants)
      console.log(`[ProductsTable] Using detail page data:`, data.length);
      setMappedData(data);
      setIsDataLoaded(true);
      setIsProcessingComplete(true);
    } else {
      // Make sure products is not undefined or empty before proceeding
      if (!products || products.length === 0) {
        console.log(`[ProductsTable] No products available`);
        setMappedData([]);
        setIsDataLoaded(true);
        setIsProcessingComplete(true);
        return;
      }

      console.log(`[ProductsTable] Starting with ${products.length} total products`);

      // First filter products by category if a category is provided
      let filteredProducts = products;
      if (category && category.id) {
        filteredProducts = products.filter((product: Item) =>
          product.category && product.category.id === category.id
        );
        console.log(`[ProductsTable] Category filter:`, {
          categoryId: category.id,
          categoryName: category.name,
          totalProducts: products.length,
          filteredProducts: filteredProducts.length,
          filteredProductIds: filteredProducts.map((p: Item) => p.id)
        });
      } else {
        console.log(`[ProductsTable] No category filter applied`);
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

      console.log(`[ProductsTable] Final products to display:`, {
        count: filteredProducts.length,
        productIds: filteredProducts.map((p: Item) => ({ id: p.id, name: p.name, sku: p.sku })),
        allProductIds: products.map((p: Item) => ({ id: p.id, name: p.name, sku: p.sku, categoryId: p.category?.id }))
      });
      setMappedData(filteredProducts);
      // Set both states at the same time - no timeout needed
      setIsDataLoaded(true);
      setIsProcessingComplete(true);
    }
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

  // Calculate page info
  const totalPages = table.getPageCount();
  const currentPageItems = table.getRowModel().rows || [];
  const currentPageIndex = table.getState().pagination.pageIndex;
  const startItem = currentPageIndex * pageSize + 1;
  const endItem = Math.min((currentPageIndex + 1) * pageSize, mappedData.length);

  // Debug pagination state
  useEffect(() => {
    console.log(`[ProductsTable] Pagination state:`, {
      mappedDataLength: mappedData.length,
      pageSize,
      pageIndex: currentPageIndex,
      totalPages,
      canPreviousPage: table.getCanPreviousPage(),
      canNextPage: table.getCanNextPage(),
      currentPageItemsCount: currentPageItems.length,
      startItem,
      endItem,
      tableState: table.getState().pagination
    });
  }, [mappedData.length, pageSize, currentPageIndex, totalPages, currentPageItems.length]);

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
                        <TableCell key={cell.id} className="py-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : isProcessingComplete && mappedData.length === 0 ? (
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