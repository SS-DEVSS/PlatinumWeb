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
import { useMemo, useState } from "react";
import { Category } from "../models/category";
import { useProducts } from "../hooks/useProducts";

const ProductsTable = ({ data }: { data: Category | null }) => {
  const { products } = useProducts();
  const { variantAttributes } = data || {};

  const productVariants_data = useMemo(() => {
    if (!products) return [];
    return products.flatMap((product) => product.productVariants || []);
  }, [products]);

  // console.log(productVariants_data);

  // Define table columns
  const columns = useMemo(() => {
    // Basic SKU column
    const initialColumns = [
      {
        accessorKey: "sku",
        header: () => <div>SKU</div>,
        cell: ({ row }: { row: any }) => <div>{row.getValue("sku")}</div>,
      },
    ];

    // Dynamic columns based on variantAttributes
    const dynamicColumns =
      variantAttributes?.map((attribute) => ({
        accessorKey: attribute.name,
        header: attribute.name,
        cell: ({ row }: { row: any }) => {
          // Find the value associated with the variant attribute
          const variantAttribute = row.original.variantAttributes.find(
            (attr: any) => attr.idVariantAttribute === attribute.id
          );

          // Display the appropriate value based on its type
          const value =
            variantAttribute?.valueString ||
            variantAttribute?.valueNumber ||
            "";
          return <div>{value}</div>;
        },
      })) || [];

    return [...initialColumns, ...dynamicColumns];
  }, [variantAttributes]);

  // Table state management
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Setting up table with React Table
  const table = useReactTable({
    data: productVariants_data,
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
  const handleRowClick = (id: string) => {
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
