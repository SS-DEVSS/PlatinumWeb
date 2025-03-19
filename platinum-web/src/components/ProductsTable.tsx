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
import { AttributeValue, Item, Variant } from "../models/item";
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
  data?: Variant[] | null;
  itemVariant?: Variant | null;
  setItemVariant?: React.Dispatch<React.SetStateAction<Variant | null>>;
  filtroInfo?: {
    numParte: string;
    referencia: string;
    vehiculo?: {
      selectedFilters?: Array<{ attributeId: string, value: string }>;
    }
  };
  filtroTipo?: "NumParte" | "Vehiculo" | "Referencia";
}) => {
  const [mappedData, setMappedData] = useState<Variant[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const isFirstLoad = useRef(true);

  const { attributes } = category || {};
  const { products, getProductById } = useProducts();

  const location = useLocation();
  const navigate = useNavigate();
  const { setType, setVariant, setValuesAttributes } = useItemContext();

  const isInDetailsPage = useMemo(
    () =>
      location.pathname.includes("producto") ||
      location.pathname.includes("kit"),
    [location]
  );

  const flattenVariants = (items: Item[]) => {
    if (items?.length) {
      return items.flatMap((item: Item) => {
        const type = item.type;
        const variants = item.variants;
        return variants?.map((variant: Variant) => ({
          id: variant.id,
          idParent: variant.idProduct,
          sku: variant.sku,
          name: variant.name,
          type: type,
          productAttributeValues: item.attributeValues,
          attributeValues: variant.attributeValues.map(
            (attribute: AttributeValue) => ({
              id: attribute.id,
              valueString: attribute.valueString,
              valueNumber: attribute.valueNumber,
              valueBoolean: attribute.valueBoolean,
              valueDate: attribute.valueDate,
              idAttribute: attribute.idAttribute,
            })
          ),
        }));
      });
    }
    return [];
  };

  const fetchDataProduct = async (item: string) => {
    try {
      const data = await getProductById(item);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (row: any) => {
    if (
      location.pathname.includes("producto") ||
      location.pathname.includes("kit")
    ) {
      if (setItemVariant) {
        setItemVariant(row.original);
      }
      return;
    } else {
      setVariant(row.original.id);
    }
    const type = row.getValue("type");
    if (type === "KIT") {
      setType("KIT");
      navigate(`/kit/${row.original.idParent}`);
    } else {
      setType("SINGLE");
      navigate(`/producto/${row.original.idParent}`);
    }
    localStorage.setItem("type", type);
  };

  const columns = useMemo(() => {
    const initialColumns = [
      {
        accessorKey: "sku",
        header: "Sku",
        cell: ({ row }: { row: any }) => <div>{row.getValue("sku")}</div>,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }: { row: any }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }: { row: any }) => {
          return (
            <div>
              {row.getValue("type") === "SINGLE" ? "Componente" : "Kit"}
            </div>
          );
        },
      },
    ];

    const getColumns = (attributeType: string) => {
      const getAttributeValues = (row: any, attribute: any) => {
        const attributeValues =
          attributeType === "product"
            ? row.original?.productAttributeValues
            : row.original?.attributeValues || [];

        return attributeValues.find(
          (attrValue: AttributeValue) => attrValue.idAttribute === attribute.id
        );
      };

      const getDisplayValue = (value: AttributeValue | undefined) =>
        value?.valueString ||
        value?.valueNumber ||
        value?.valueBoolean?.toString() ||
        value?.valueDate?.toDateString() ||
        "N/A";

      return (
        attributes?.[attributeType]?.map((attribute: any) => ({
          accessorKey: attribute.id,
          header: attribute.name,
          cell: ({ row }: { row: any }) => {
            const value = getAttributeValues(row, attribute);
            return <div>{getDisplayValue(value)}</div>;
          },
        })) || []
      );
    };

    // Only include variant attributes columns
    const dynamicColumnsVariant = getColumns("variant");

    return [
      ...initialColumns,
      ...dynamicColumnsVariant,
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
    onPaginationChange: (updater) => {
      const newPagination = updater(table.getState().pagination);
      setCurrentPage(newPagination.pageIndex);
    },
    state: {
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    },
    pageCount: Math.ceil((mappedData?.length || 0) / pageSize),
    manualPagination: false,
  });

  // Process and set data
  useEffect(() => {
    setIsDataLoaded(false);
    setIsProcessingComplete(false);

    // Only reset to first page if it's not the first load or if data source has changed
    if (!isFirstLoad.current) {
      setCurrentPage(0);
    }
    isFirstLoad.current = false;

    if (isInDetailsPage && data) {
      setMappedData(data);
      setIsDataLoaded(true);
      setIsProcessingComplete(true);
    } else {
      // Make sure products is not undefined or empty before proceeding
      if (!products || products.length === 0) {
        setMappedData([]);
        setIsDataLoaded(true);
        setIsProcessingComplete(true);
        return;
      }

      let filteredProducts = products;
      let filteredVariants = [];

      // Handle filtering based on filter type
      if (filtroTipo === "Referencia" && filtroInfo?.referencia) {
        // Filter by reference if provided
        filteredProducts = products.filter((product: Item) =>
          product.references?.some((code: any) =>
            code?.toLowerCase().includes(filtroInfo.referencia.toLowerCase())
          )
        );
        filteredVariants = flattenVariants(filteredProducts);
      }
      else if (filtroTipo === "NumParte" && filtroInfo?.numParte) {
        // Filter by part number if provided
        const allVariants = flattenVariants(products);
        filteredVariants = allVariants.filter((variant: any) =>
          variant.sku?.toLowerCase().includes(filtroInfo.numParte.toLowerCase())
        );
      }
      else if (filtroTipo === "Vehiculo" && filtroInfo?.vehiculo?.selectedFilters?.length > 0) {
        // Filter based on the selected vehicle filters
        const allVariants = flattenVariants(products);
        filteredVariants = allVariants.filter((variant: any) => {
          return filtroInfo.vehiculo.selectedFilters.every(filter => {
            return variant.attributeValues.some(attr =>
              attr.idAttribute === filter.attributeId &&
              attr.valueString === filter.value
            );
          });
        });
      }
      else {
        // No filter applied, show all products
        filteredVariants = flattenVariants(filteredProducts);
      }

      console.log("Filtered variants count:", filteredVariants.length);
      setMappedData(filteredVariants);
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
    filtroInfo?.vehiculo?.selectedFilters
  ]);

  useEffect(() => {
    if (!isDataLoaded) return;

    const getVariantValues = (id: string) => {
      return mappedData
        .filter((variant: Variant) =>
          variant.attributeValues.some((attribute: AttributeValue) => {
            return attribute.idAttribute.includes(id);
          })
        )
        .map((variant: Variant) =>
          variant.attributeValues.filter((attribute) =>
            attribute.idAttribute.includes(id)
          )
        );
    };

    const attributeIdList = category?.attributes?.variant?.map(
      (attribute: Attribute) => attribute.id
    );

    const valuesMapped = attributeIdList?.map((attributeId: string) => {
      const values = getVariantValues(attributeId);
      return {
        attributeId,
        values,
      };
    });

    setValuesAttributes(valuesMapped);
  }, [mappedData, isDataLoaded]);

  // Calculate page info
  const totalPages = Math.ceil((mappedData?.length || 0) / pageSize);
  const currentPageItems = table.getRowModel().rows || [];
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, mappedData.length);

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
              {!isProcessingComplete ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Cargando resultados...
                  </TableCell>
                </TableRow>
              ) : mappedData.length > 0 ? (
                currentPageItems.map((row, index) => {
                  const isLastRow =
                    index === currentPageItems.length - 1;
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => handleClick(row)}
                      className={`cursor-pointer hover:bg-orange-200 odd:bg-[#f5f5f5] even:bg-white`}
                      style={{
                        backgroundColor:
                          row.original.id === itemVariant?.id ? "#d87e2e" : "",
                        borderBottomLeftRadius: isLastRow
                          ? "12px !important"
                          : "0",
                        borderBottomRightRadius: isLastRow
                          ? "12px !important"
                          : "0",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No existen resultados
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