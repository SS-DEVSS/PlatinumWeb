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
import { useEffect, useMemo, useState } from "react";
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
  // Add a new state to track when data processing is complete
  const [isProcessingComplete, setIsProcessingComplete] = useState<boolean>(false);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ row }: { row: any }) => <div>{row.getValue("sku")}</div>,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ row }: { row: any }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "type",
        header: "Tipo",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const dynamicColumnsProduct = !isInDetailsPage ? getColumns("product") : [];
    const dynamicColumnsVariant = getColumns("variant");

    return [
      ...initialColumns,
      ...dynamicColumnsProduct,
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
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  // Process and set data
  useEffect(() => {
    setIsDataLoaded(false);
    setIsProcessingComplete(false); // Reset processing state

    if (isInDetailsPage && data) {
      setMappedData(data);
      setIsDataLoaded(true);
      setIsProcessingComplete(true); // Mark processing as complete
    } else {
      // Make sure products is not undefined or empty before proceeding
      if (!products || products.length === 0) {
        setMappedData([]);
        setIsDataLoaded(true);
        setIsProcessingComplete(true); // Mark processing as complete
        return;
      }

      let filteredProducts = products;
      let filteredVariants = [];

      // Handle filtering based on filter type
      if (filtroTipo === "Referencia" && filtroInfo?.referencia) {
        // Filter by reference if provided
        filteredProducts = products.filter((product: Item) =>
          product.references?.some((code: any) =>
            code?.includes(filtroInfo.referencia)
          )
        );
        filteredVariants = flattenVariants(filteredProducts);
      }
      else if (filtroTipo === "NumParte" && filtroInfo?.numParte) {
        // Filter by part number if provided
        const allVariants = flattenVariants(products);
        filteredVariants = allVariants.filter((variant: any) =>
          variant.sku?.includes(filtroInfo.numParte)
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

      setMappedData(filteredVariants ?? []);
      setIsDataLoaded(true);
      setIsProcessingComplete(true); // Mark processing as complete
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
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => {
                  const isLastRow =
                    index - 1 === table.getRowModel().rows.length;
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
        {isProcessingComplete && mappedData?.length > 10 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}
      </>
    </div>
  );
};

export default ProductsTable;