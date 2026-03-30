import { useEffect, useMemo, useState } from "react";
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
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductsTable = ({
  category,
  itemVariant,
  setItemVariant,
  products,
  loading = false,
  pageIndex = 0,
  pageSize = 10,
  pageCount = 0,
  totalItems = 0,
  onPaginationChange,
  viewMode: externalViewMode = "cards",
}: {
  category: Category | null;
  products?: Item[];
  itemVariant?: Item | null;
  setItemVariant?: React.Dispatch<React.SetStateAction<Item | null>>;
  loading?: boolean;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  totalItems?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  viewMode?: "cards" | "table";
}) => {
  const [pageInputValue, setPageInputValue] = useState<string>("");

  const currentViewMode = externalViewMode;

  const mappedData = products || [];

  const { attributes } = category || {};

  const navigate = useNavigate();
  const location = useLocation();
  const { setType, setVariant } = useItemContext();

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
          return <div>{product.sku || "-"}</div>;
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
              "-";

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

  // Consider URL as "no image" when empty or a known placeholder so we show our own placeholder
  const isPlaceholderOrEmptyUrl = (url: string | null | undefined): boolean => {
    if (url == null || typeof url !== "string") return true;
    const u = url.trim();
    if (u === "") return true;
    const lower = u.toLowerCase();
    if (lower.includes("placeholder") || lower.includes("default.png") || lower.includes("no-image")) return true;
    return false;
  };

  const getProductImageUrl = (product: Item): string | null => {
    let url: string | null = null;
    if (product.images && product.images.length > 0) {
      url = product.images[0].url ?? null;
    } else if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
      url = product.variants[0].images[0].url ?? null;
    }
    return isPlaceholderOrEmptyUrl(url) ? null : url;
  };

  // Format references for display
  const formatReferences = (product: Item): string[] => {
    if (!product.references) return [];
    return product.references.map((ref: string | { referenceNumber?: string }) => {
      if (typeof ref === 'string') return ref;
      return (ref as { referenceNumber?: string }).referenceNumber || '';
    }).filter(Boolean) as string[];
  };

  return (
    <div className="mt-0 relative">
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
                    if (loading) {
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
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {(() => {
              if (loading) {
                return (
                  <>
                    {Array.from({ length: pageSize }).map((_, index) => (
                      <ProductCardSkeleton key={`skeleton-${index}`} />
                    ))}
                  </>
                );
              }

              if (mappedData.length > 0) {
                return currentPageItems.map((row) => {
                  const product: Item = row.original;
                  const imageUrl = getProductImageUrl(product);
                  const references = formatReferences(product);
                  const isSelected = itemVariant && product.id === itemVariant.id;

                  return (
                    <Card
                      key={product.id}
                      className={`cursor-pointer hover:shadow-lg transition-shadow overflow-hidden flex flex-col ${isSelected ? 'ring-2 ring-naranja' : ''
                        }`}
                      onClick={() => handleClick(row)}
                    >
                      <div className="w-full aspect-square bg-white flex items-center justify-center p-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex flex-col items-center justify-center text-gray-400 w-full h-full">
                                    <svg class="w-16 h-16 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400 w-full h-full">
                            <svg className="w-16 h-16 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4 bg-gray-50">
                        <div className="mb-2">
                          <span className="text-xs text-gray-600 font-medium">No. Parte: </span>
                          <span className="text-sm font-semibold text-naranja">{product.sku || '-'}</span>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>

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

              return (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No se encontraron resultados.
                </div>
              );
            })()}
          </div>
        )}
        {!loading && mappedData.length > 0 && (
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