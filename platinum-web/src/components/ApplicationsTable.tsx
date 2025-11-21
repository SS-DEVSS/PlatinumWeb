import {
  flexRender,
  getCoreRowModel,
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
import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import { Attribute, Category } from "../models/category";
import { AttributeValue } from "../models/item";
import { Application } from "../models/application";

type ApplicationsTableProps = {
  category: Category | null;
  applications: Application[];
};

const ApplicationsTable = ({ category, applications }: ApplicationsTableProps) => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { attributes } = category || {};

  const columns = useMemo(() => {
    const initialColumns = [
      {
        accessorKey: "origin",
        header: "Origen",
        cell: ({ row }: { row: { original: Application } }) => {
          const application: Application = row.original;
          const value = application.origin || "N/A";
          const displayValue = String(value).length > 30 ? `${String(value).substring(0, 30)}...` : value;
          return (
            <div
              className="truncate max-w-[200px]"
              title={String(value)}
            >
              {displayValue}
            </div>
          );
        },
      },
    ];

    // Get application attribute columns
    const getApplicationAttributeColumns = () => {
      if (!attributes?.application || attributes.application.length === 0) return [];

      // Sort attributes by order field (ascending) - Modelo should be first (order: 1)
      const sortedAttributes = [...attributes.application].sort((a, b) => (a.order || 0) - (b.order || 0));

      return sortedAttributes.map((attribute: Attribute) => ({
        accessorKey: attribute.id,
        header: attribute.name,
        cell: ({ row }: { row: { original: Application } }) => {
          const application: Application = row.original;
          const attrValue = application.attributeValues.find(
            (av: AttributeValue) => av.idAttribute === attribute.id
          );

          const fullValue =
            attrValue?.valueString ||
            attrValue?.valueNumber?.toString() ||
            attrValue?.valueBoolean?.toString() ||
            attrValue?.valueDate?.toString() ||
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

    const dynamicColumns = getApplicationAttributeColumns();

    return [
      ...initialColumns,
      ...dynamicColumns,
    ];
  }, [attributes]);

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updater: unknown) => {
      if (typeof updater === 'function') {
        const newPagination = updater(table.getState().pagination);
        setCurrentPage(newPagination.pageIndex);
      } else if (typeof updater === 'object' && updater !== null && 'pageIndex' in updater) {
        setCurrentPage((updater as { pageIndex: number }).pageIndex);
      }
    },
    state: {
      pagination: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    },
  });

  const totalPages = table.getPageCount();

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay aplicaciones disponibles para este producto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-[#333333] text-white first:rounded-tl-lg last:rounded-tr-lg">
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
                const isLastRow = index === table.getRowModel().rows.length - 1;
                return (
                  <TableRow
                    key={row.id}
                    className={`hover:bg-orange-200 odd:bg-[#f5f5f5] even:bg-white`}
                    style={{
                      borderBottomLeftRadius: isLastRow ? "12px !important" : "0",
                      borderBottomRightRadius: isLastRow ? "12px !important" : "0",
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
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              Mostrando{" "}
              <strong>
                {table.getState().pagination.pageIndex * pageSize + 1} -{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * pageSize,
                  applications.length
                )}
              </strong>{" "}
              de <strong>{applications.length}</strong> resultados
            </span>
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
    </div>
  );
};

export default ApplicationsTable;

