import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
import { Product, ProductSkeleton } from "../models/product";
import { Card } from "./ui/card";
// import { useCategories } from "../hooks/useCategories";

const ProductsTable = (data: any) => {
  // const { category } = useCategories();
  const columns: ColumnDef<ProductSkeleton>[] = [
    {
      accessorKey: "image",
      header: "Imagen",
      cell: ({ row }) => (
        <img className="w-20" src={`/src/assets/${row.getValue("image")}`} />
      ),
    },
    {
      accessorKey: "sku",
      header: () => <div>SKU</div>,
      cell: ({ row }) => <div>{row.getValue("sku")}</div>,
    },
    // {
    //   accessorKey: "brand",
    //   header: () => <div>Marca</div>,
    //   cell: ({ row }) => <div>{row.getValue("brand")}</div>,
    // },
    // {
    //   accessorKey: "model",
    //   header: () => <div>Modelo</div>,
    //   cell: ({ row }) => <div>{row.getValue("model")}</div>,
    // },
    // {
    //   accessorKey: "engine",
    //   header: () => <div>Motor</div>,
    //   cell: ({ row }) => <div>{row.getValue("engine")}</div>,
    // },
    // {
    //   accessorKey: "year",
    //   header: () => <div>Año</div>,
    //   cell: ({ row }) => <div>{row.getValue("year")}</div>,
    // },
    // {
    //   accessorKey: "diameter",
    //   header: () => <div>Diametro</div>,
    //   cell: ({ row }) => <div>{row.getValue("diameter")}</div>,
    // },
  ];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  console.log(data);

  const table = useReactTable<ProductSkeleton>({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const navigate = useNavigate();
  const handleRowClick = (id: Product["id"]) => {
    navigate(`/producto/${id}`);
  };

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
        <div className="space-x-2">
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
    </div>
  );
};

export default ProductsTable;
