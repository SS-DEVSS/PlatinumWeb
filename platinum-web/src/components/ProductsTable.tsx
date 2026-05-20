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
import { useItemContext } from "../context/use-item-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
          // Filter out "Descripci?n" and attributes that are explicitly set to not visible in catalog
          const nameLower = attribute.name.toLowerCase();
          const visibleInCatalog = (attribute as Attribute & { visibleInCatalog?: boolean }).visibleInCatalog;

          // Include if:
          // 1. Not "descripci?n" AND
          // 2. visibleInCatalog is not explicitly false (undefined/null/true are all OK)
          return nameLower !== "descripciùn" && visibleInCatalog !== false;
        })
        .map((attribute: Attribute) => ({
          accessorKey: attribute.id,
          header: attribute.displayName || attribute.name,
          cell: ({ row }: { row: Row<Item> }) => {
            const product: Item = row.original;
            const attrValue = product.attributeValues.find(
              (av: AttributeValue) => av.idAttribute === attribute.id
            );

            const rawValue =
              attrValue?.valueString ??
              (attrValue?.valueNumber != null ? String(attrValue.valueNumber) : undefined) ??
              (attrValue?.valueBoolean != null ? String(attrValue.valueBoolean) : undefined) ??
              (attrValue?.valueDate ? attrValue.valueDate.toDateString() : undefined);

            if (rawValue == null || String(rawValue).trim() === "") {
              return <div />;
            }

            const valueStr = String(rawValue);
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

  const formatReferences = (product: Item): string[] => {
    if (!product.references) return [];
    return product.references.map((ref: string | { referenceNumber?: string; reference_number?: string }) => {
      if (typeof ref === "string") return ref;
      return ref.referenceNumber ?? ref.reference_number ?? "";
    }).filter(Boolean) as string[];
  };

  const formatReferencesLabel = (references: string[]): string => {
    if (references.length === 0) return "";
    const shown = references.slice(0, 3);
    const remaining = references.length - shown.length;
    const base = shown.join(" | ");
    return remaining > 0 ? `${base} y ${remaining}+` : base;
  };

  const getAttributeDisplayValue = (
    product: Item,
    attribute: Attribute
  ): string | null => {
    const attrValue = product.attributeValues.find(
      (av: AttributeValue) => av.idAttribute === attribute.id
    );
    const rawValue =
      attrValue?.valueString ??
      (attrValue?.valueNumber != null ? String(attrValue.valueNumber) : undefined) ??
      (attrValue?.valueBoolean != null ? String(attrValue.valueBoolean) : undefined) ??
      (attrValue?.valueDate ? String(attrValue.valueDate) : undefined);

    if (rawValue == null || String(rawValue).trim() === "") return null;
    return String(rawValue);
  };

  const catalogGridAttributes = useMemo(() => {
    if (!attributes?.product?.length) return [];
    return [...attributes.product]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .filter((attribute: Attribute) => {
        const nameLower = attribute.name.toLowerCase();
        return nameLower !== "descripciùn" && attribute.visibleInCatalog !== false;
      });
  }, [attributes?.product]);

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
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch ${loading ? "opacity-50 pointer-events-none" : ""}`}
          >
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
                  const referencesLabel = formatReferencesLabel(references);
                  const isSelected = itemVariant && product.id === itemVariant.id;
                  const visibleCatalogAttributes = catalogGridAttributes
                    .map((attribute) => ({
                      attribute,
                      value: getAttributeDisplayValue(product, attribute),
                    }))
                    .filter((row) => row.value != null);

                  return (
                    <Card
                      key={product.id}
                      className={`flex h-full min-h-[168px] flex-row cursor-pointer overflow-hidden border border-gray-300 transition-shadow hover:shadow-lg ${isSelected ? "ring-2 ring-naranja" : ""}`}
                      onClick={() => handleClick(row)}
                    >
                      <div className="relative flex w-[38%] min-w-[120px] max-w-[180px] shrink-0 self-stretch overflow-hidden border-r border-gray-200 bg-white">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.sku || product.name}
                            className="h-full min-h-[140px] w-full flex-1 object-contain bg-white p-2"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div
                            className="flex min-h-[140px] flex-1 items-center justify-center bg-white text-gray-400"
                            aria-hidden
                          >
                            <svg
                              className="h-12 w-12 shrink-0 text-gray-300"
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
                      </div>

                      <CardContent className="flex h-full min-h-0 flex-1 flex-col p-3 text-sm">
                        <div className="shrink-0 space-y-1 border-b border-gray-200 pb-2">
                          <p className="text-xs font-medium text-gray-800">
                            No. Parte Platinum:
                          </p>
                          <p className="text-lg font-bold text-naranja break-all">
                            {product.sku || "-"}
                          </p>
                          <div className="min-h-[2.75rem] pt-0.5">
                            <p className="text-xs font-medium text-gray-800">
                              Referencias:
                            </p>
                            <p className="line-clamp-2 text-sm text-gray-600 break-words">
                              {referencesLabel || "\u00A0"}
                            </p>
                          </div>
                        </div>

                        {visibleCatalogAttributes.length > 0 && (
                          <div className="mt-auto divide-y divide-gray-200">
                            {visibleCatalogAttributes.map(({ attribute, value }) => (
                              <div
                                key={attribute.id}
                                className="flex items-start justify-between gap-2 py-1"
                              >
                                <span className="shrink-0 font-medium text-gray-800 text-xs">
                                  {attribute.displayName || attribute.name}:
                                </span>
                                <span className="text-right text-gray-700 break-words text-xs">
                                  {value}
                                </span>
                              </div>
                            ))}
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
          <div className="mt-6 w-full min-w-0 space-y-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 sm:px-4">
            <p className="text-center text-xs font-medium text-gray-700 sm:text-left sm:text-sm">
              Mostrando <span className="font-semibold text-gray-900">{startItem}</span> -{" "}
              <span className="font-semibold text-gray-900">{endItem}</span> de{" "}
              <span className="font-semibold text-gray-900">{totalItems}</span> resultados
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-2 sm:gap-y-2">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-9 shrink-0 px-3 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm sm:px-4">
                  <span className="whitespace-nowrap text-xs text-gray-700 sm:text-sm">
                    {"P\u00e1gina"}{" "}
                    <strong className="font-semibold text-gray-900">
                      {table.getState().pagination.pageIndex + 1}
                    </strong>{" "}
                    de{" "}
                    <strong className="font-semibold text-gray-900">{totalPages || 1}</strong>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-9 shrink-0 px-3 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="shrink-0 whitespace-nowrap text-xs text-gray-700 sm:text-sm">Ir a:</span>
                <Input
                  type="number"
                  min={1}
                  max={totalPages || 1}
                  value={pageInputValue}
                  onChange={(e) => setPageInputValue(e.target.value)}
                  onKeyDown={handlePageInputKeyDown}
                  onBlur={handlePageNavigation}
                  className="h-9 w-14 shrink-0 px-1 text-center text-xs border-gray-300 sm:w-20 sm:px-2 sm:text-sm"
                  placeholder={"P\u00e1g"}
                />
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newPageSize = Number(e.target.value);
                    if (onPaginationChange) {
                      onPaginationChange(0, newPageSize);
                    }
                  }}
                  className="h-9 min-w-0 flex-1 cursor-pointer rounded-md border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 shadow-sm hover:border-gray-400 sm:flex-none sm:px-3 sm:pr-8 sm:text-sm"
                >
                  {[30, 45, 60].map((size) => (
                    <option key={size} value={size}>
                      Mostrar {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default ProductsTable;