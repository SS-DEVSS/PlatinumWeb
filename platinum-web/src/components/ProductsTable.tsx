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
import { Attribute, Variant } from "../models/item";
import { useItemContext } from "../context/Item-context";

const ProductsTable = ({
  category,
  data,
  itemVariant,
  setItemVariant,
}: {
  category: Category | null;
  data?: Variant[] | null;
  itemVariant?: Variant | null;
  setItemVariant?: React.Dispatch<React.SetStateAction<Variant | null>>;
}) => {
  const [mappedData, setMappedData] = useState<Variant[]>([]);
  const { variantAttributes, products, kits } = category || {};

  const location = useLocation();
  const navigate = useNavigate();
  const { setType } = useItemContext();

  useEffect(() => {
    const flattenVariants = (items: any, type: string) => {
      return items.flatMap((item: any) => {
        const variants =
          type === "product" ? item.productVariants : item.kitVariants;
        return variants.map((variant: Variant) => ({
          id: variant.id,
          idParent: type === "product" ? variant.idProduct : variant.idKit,
          sku: variant.sku,
          name: variant.name,
          type,
          attributes: variant.variantAttributes.map((attribute: Attribute) => ({
            id: attribute.id,
            valueString: attribute.valueString,
            valueNumber: attribute.valueNumber,
            valueBoolean: attribute.valueBoolean,
            valueDate: attribute.valueDate,
            idVariantAttribute: attribute.idVariantAttribute,
          })),
        }));
      });
    };

    if (
      location.pathname.includes("product") ||
      location.pathname.includes("kit")
    ) {
      setMappedData(data || []);
    } else {
      const mappedProducts = products
        ? flattenVariants(products, "product")
        : [];
      const mappedKits = kits ? flattenVariants(kits, "kit") : [];

      setMappedData([...mappedProducts, ...mappedKits]);
    }
  }, [products, kits, data, location]);

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
    ];

    const dynamicColumns =
      variantAttributes?.map((attribute) => ({
        accessorKey: attribute.id,
        header: attribute.name,
        cell: ({ row }: { row: any }) => {
          const attributes = location.pathname.includes("producto" || "kit")
            ? row.original.variantAttributes
            : row.original.attributes || [];
          const value = attributes.find(
            (attr: Attribute) => attr.idVariantAttribute === attribute.id
          );
          return (
            <div>
              {value?.valueString ||
                value?.valueNumber ||
                value?.valueBoolean?.toString() ||
                value?.valueDate ||
                ""}
            </div>
          );
        },
      })) || [];
    return [...initialColumns, ...dynamicColumns];
  }, [variantAttributes]);

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
    console.log("row item", row.original.id);
    console.log("from props", itemVariant?.id);
    if (location.pathname.includes("producto" || "kit")) {
      setItemVariant(row.original);
      return;
    }
    const type = row.getValue("type");
    if (type === "kit") {
      setType("kit");
      navigate(`/kit/${row.original.idParent}`);
    } else {
      setType("product");
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
                console.log;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleClick(row)}
                    className={`cursor-pointer hover:bg-gray-100 odd:bg-[#f5f5f5] even:bg-white`}
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
