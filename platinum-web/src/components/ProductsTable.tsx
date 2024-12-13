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
import { Category } from "../models/category";
import { AttributeValue, Item, Variant } from "../models/item";
import { useItemContext } from "../context/Item-context";
import { useProducts } from "../hooks/useProducts";

const ProductsTable = ({
  category,
  data,
  itemVariant,
  setItemVariant,
  filtroInfo,
}: {
  category: Category | null;
  data?: Variant[] | null;
  itemVariant?: Variant | null;
  setItemVariant?: React.Dispatch<React.SetStateAction<Variant | null>>;
  filtroInfo?: {
    numParte: string;
    referencia: string;
  };
}) => {
  const [mappedData, setMappedData] = useState<Variant[]>([]);
  const { attributes } = category || {};
  const { products } = useProducts();

  const location = useLocation();
  const navigate = useNavigate();
  const { setType } = useItemContext();

  const flattenVariants = (items: Item[]) => {
    console.log(items);
    if (items.length) {
      return items.flatMap((item: Item) => {
        const type = item.type;
        const variants = item.variants;
        return variants?.map((variant: Variant) => ({
          id: variant.id,
          idParent: variant.idProduct,
          sku: variant.sku,
          name: variant.name,
          type: type,
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
  };

  const isInDetailsPage = useMemo(
    () =>
      location.pathname.includes("producto") ||
      location.pathname.includes("kit"),
    [location]
  );

  useEffect(() => {
    if (isInDetailsPage && data) {
      setMappedData(data ?? []);
    } else {
      let filteredProducts = products;

      if (filtroInfo?.referencia) {
        filteredProducts = products.filter((product: Item) =>
          product.references.some((code: any) =>
            code?.includes(filtroInfo?.referencia)
          )
        );
      } else if (filtroInfo?.numParte) {
        const flattenedVariants = flattenVariants(products);
        const filteredVariants = flattenedVariants.filter((variant: any) =>
          variant.sku?.includes(filtroInfo?.numParte)
        );
        setMappedData(filteredVariants ?? []);
        return;
      }

      const flattenedData = flattenVariants(filteredProducts);
      setMappedData(flattenedData ?? []);
    }
  }, [products, data, location, filtroInfo?.referencia, filtroInfo?.numParte]);

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
        cell: ({ row }: { row: any }) => (
          // Algo aqui esta raro
          <div>{row.getValue("type") === "SINGLE" ? "Componente" : "Kit"}</div>
        ),
      },
    ];

    const dynamicColumns =
      attributes?.variant?.map((attribute) => ({
        accessorKey: attribute.id,
        header: attribute.name,
        cell: ({ row }: { row: any }) => {
          const attributeValues = row.original?.attributeValues || [];

          const value = attributeValues.find(
            (attrValue: AttributeValue) =>
              attrValue.idAttribute === attribute.id
          );
          return (
            <div>
              {value?.valueString ||
                value?.valueNumber ||
                value?.valueBoolean?.toString() ||
                value?.valueDate ||
                "N/A"}
            </div>
          );
        },
      })) || [];

    return [...initialColumns, ...dynamicColumns];
    // return [...initialColumns];
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

  const handleClick = (row: any) => {
    if (
      location.pathname.includes("producto") ||
      location.pathname.includes("kit")
    ) {
      if (setItemVariant) {
        setItemVariant(row.original);
      }
      return;
    }
    const type = row.getValue("type");
    if (type === "KIT") {
      setType("KIT");
      navigate(`/kit/${row.original.idParent}`);
    } else {
      setType("SINGLE");
      navigate(`/producto/${row.original.idParent}`);
    }
  };

  return (
    <div className="mt-6">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const isLastRow = index - 1 === table.getRowModel().rows.length;
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
                  No existen resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
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
    </div>
  );
};

export default ProductsTable;
