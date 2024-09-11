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
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useEffect, useMemo, useState } from "react";

const ProductsTable = ({ data }) => {
  const [mappedData, setMappedData] = useState([]);
  const { variantAttributes, products, kits } = data || {};

  useEffect(() => {
    const flattenVariants = (items, type) => {
      return items.flatMap((item) => {
        const variants =
          type === "product" ? item.productVariants : item.kitVariants;
        return variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          name: variant.name,
          type,
          attributes:
            type === "product"
              ? variant.productVariantVariantAttributes.map((attribute) => ({
                  id: attribute.id,
                  valueString: attribute.valueS,
                  valueNumber: attribute.valueN,
                  valueBoolean: attribute.valueB,
                  valueDate: attribute.valueD,
                  id_var: attribute.id_var,
                }))
              : variant.kitVariantVariantAttributes.map((attribute) => ({
                  id: attribute.id,
                  valueString: attribute.valueString,
                  valueNumber: attribute.valueNumber,
                  valueBoolean: attribute.valueBoolean,
                  valueDate: attribute.valueDate,
                  id_var: attribute.id_variant_attribu,
                })),
        }));
      });
    };

    const mappedProducts = products ? flattenVariants(products, "product") : [];
    const mappedKits = kits ? flattenVariants(kits, "kit") : [];

    // Combine both arrays into a single mapped data array
    setMappedData([...mappedProducts, ...mappedKits]);
  }, [products, kits]);

  const columns = useMemo(() => {
    const initialColumns = [
      {
        accessorKey: "sku",
        header: "Sku",
        cell: ({ row }) => <div>{row.getValue("sku")}</div>,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => <div>{row.getValue("type")}</div>,
      },
    ];

    const dynamicColumns =
      variantAttributes?.map((attribute) => ({
        accessorKey: attribute.id,
        header: attribute.name,
        cell: ({ row }) => {
          const value = row.original.attributes.find(
            (attr) => attr.id_var === attribute.id
          );
          console.log(value);
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

  // Setting up table with React Table
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

  const navigate = useNavigate();

  // Handle row click navigation
  const handleRowClick = (id) => {
    navigate(`/producto/${id}`);
  };

  // Render the table
  return (
    <div className="mt-6">
      <Card className="border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="bg-[#333333] text-[#C4C4C4]"
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original.id)}
                  className="cursor-pointer hover:bg-gray-100"
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
              ))
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
