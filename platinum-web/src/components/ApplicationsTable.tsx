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
import { useMemo, useState, useRef, useEffect } from "react";
import { Attribute, Category } from "../models/category";
import { AttributeValue } from "../models/item";
import { Application } from "../models/application";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";

type ApplicationsTableProps = {
  category: Category | null;
  applications: Application[];
};

const ApplicationsTable = ({ category, applications }: ApplicationsTableProps) => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showLeftScroll, setShowLeftScroll] = useState<boolean>(false);
  const [showRightScroll, setShowRightScroll] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { attributes } = category || {};

  // Group applications by year ranges (same logic as mobile)
  const groupedApplications = useMemo(() => {
    if (!applications || !attributes?.application) return applications;

    const appAttrs = [...attributes.application].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Find the year attribute index
    const yearAttrIndex = appAttrs.findIndex((attr) =>
      attr.name.toLowerCase().includes('año') ||
      attr.displayName?.toLowerCase().includes('año') ||
      attr.name.toLowerCase().includes('year')
    );

    if (yearAttrIndex === -1) return applications;

    // Group rows by all attributes except year
    const grouped = new Map<string, Application[]>();

    applications.forEach(app => {
      // Create a key from all attribute values except year
      const keyParts: string[] = [];
      appAttrs.forEach((attr, idx) => {
        if (idx !== yearAttrIndex) {
          const attrValue = app.attributeValues.find(av => av.idAttribute === attr.id);
          const value = attrValue?.valueString || attrValue?.valueNumber?.toString() || attrValue?.valueBoolean?.toString() || attrValue?.valueDate?.toString() || '-';
          keyParts.push(String(value));
        }
      });
      const key = keyParts.join('|');

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(app);
    });

    // Process groups to create year ranges
    const groupedApps: Application[] = [];
    grouped.forEach((apps) => {
      if (apps.length === 1) {
        groupedApps.push(apps[0]);
      } else {
        // Sort by year
        const sortedApps = [...apps].sort((a, b) => {
          const yearAttr = appAttrs[yearAttrIndex];
          const yearA = a.attributeValues.find(av => av.idAttribute === yearAttr.id);
          const yearB = b.attributeValues.find(av => av.idAttribute === yearAttr.id);
          const numA = Number(yearA?.valueNumber || yearA?.valueString) || 0;
          const numB = Number(yearB?.valueNumber || yearB?.valueString) || 0;
          return numA - numB;
        });

        // Create year ranges for consecutive years
        let currentGroup: Application[] = [sortedApps[0]];

        for (let i = 1; i < sortedApps.length; i++) {
          const prevYearAttr = sortedApps[i - 1].attributeValues.find(av => av.idAttribute === appAttrs[yearAttrIndex].id);
          const currYearAttr = sortedApps[i].attributeValues.find(av => av.idAttribute === appAttrs[yearAttrIndex].id);
          const prevYear = Number(prevYearAttr?.valueNumber || prevYearAttr?.valueString) || 0;
          const currYear = Number(currYearAttr?.valueNumber || currYearAttr?.valueString) || 0;

          // Check if all other values are the same
          const sameValues = appAttrs.every((attr, idx) => {
            if (idx === yearAttrIndex) return true;
            const prevVal = sortedApps[i - 1].attributeValues.find(av => av.idAttribute === attr.id);
            const currVal = sortedApps[i].attributeValues.find(av => av.idAttribute === attr.id);
            const prevStr = prevVal?.valueString || prevVal?.valueNumber?.toString() || prevVal?.valueBoolean?.toString() || prevVal?.valueDate?.toString() || '-';
            const currStr = currVal?.valueString || currVal?.valueNumber?.toString() || currVal?.valueBoolean?.toString() || currVal?.valueDate?.toString() || '-';
            return prevStr === currStr;
          });

          if (sameValues && currYear === prevYear + 1) {
            currentGroup.push(sortedApps[i]);
          } else {
            // Finalize current group
            if (currentGroup.length > 1) {
              const firstYearAttr = currentGroup[0].attributeValues.find(av => av.idAttribute === appAttrs[yearAttrIndex].id);
              const lastYearAttr = currentGroup[currentGroup.length - 1].attributeValues.find(av => av.idAttribute === appAttrs[yearAttrIndex].id);
              const firstYear = firstYearAttr?.valueNumber?.toString() || firstYearAttr?.valueString || '';
              const lastYear = lastYearAttr?.valueNumber?.toString() || lastYearAttr?.valueString || '';
              const rangeValue = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

              // Create a new application with the year range
              const groupedApp: Application = {
                ...currentGroup[0],
                attributeValues: currentGroup[0].attributeValues.map(av => {
                  if (av.idAttribute === appAttrs[yearAttrIndex].id) {
                    return {
                      ...av,
                      valueString: rangeValue,
                      valueNumber: null
                    };
                  }
                  return av;
                })
              };
              groupedApps.push(groupedApp);
            } else {
              groupedApps.push(currentGroup[0]);
            }
            currentGroup = [sortedApps[i]];
          }
        }

        // Finalize last group
        if (currentGroup.length > 1) {
          const firstYearAttr = currentGroup[0].attributeValues.find(av => av.idAttribute === appAttrs[yearAttrIndex].id);
          const lastYearAttr = currentGroup[currentGroup.length - 1].attributeValues.find(av => av.idAttribute === appAttrs[yearAttrIndex].id);
          const firstYear = firstYearAttr?.valueNumber?.toString() || firstYearAttr?.valueString || '';
          const lastYear = lastYearAttr?.valueNumber?.toString() || lastYearAttr?.valueString || '';
          const rangeValue = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

          const groupedApp: Application = {
            ...currentGroup[0],
            attributeValues: currentGroup[0].attributeValues.map(av => {
              if (av.idAttribute === appAttrs[yearAttrIndex].id) {
                return {
                  ...av,
                  valueString: rangeValue,
                  valueNumber: null
                };
              }
              return av;
            })
          };
          groupedApps.push(groupedApp);
        } else {
          groupedApps.push(currentGroup[0]);
        }
      }
    });

    return groupedApps;
  }, [applications, attributes]);

  const columns = useMemo(() => {
    const initialColumns = [
      {
        accessorKey: "origin",
        header: "Origen",
        cell: ({ row }: { row: { original: Application } }) => {
          const application: Application = row.original;
          const value = application.origin || "N/A";
          const valueStr = String(value);
          const displayValue = valueStr.length > 30 ? `${valueStr.substring(0, 30)}...` : valueStr;
          const hasTooltip = valueStr.length > 30;
          return (
            <div className="flex items-center gap-2" style={{ position: 'relative', overflow: 'visible' }}>
              <div
                className="truncate max-w-[200px]"
                title={valueStr}
              >
                {displayValue}
              </div>
              {hasTooltip && (
                <div className="relative group inline-block" style={{ zIndex: 1000, position: 'relative', overflow: 'visible' }}>
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 transition-colors" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-800 whitespace-normal max-w-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    style={{
                      zIndex: 10000,
                      pointerEvents: 'auto',
                      marginBottom: '4px',
                      position: 'absolute'
                    }}>
                    {valueStr}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                  </div>
                </div>
              )}
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
        header: attribute.displayName || attribute.name,
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
          const hasTooltip = valueStr.length > 30;

          return (
            <div className="flex items-center gap-2">
              <div
                className="truncate max-w-[200px]"
              >
                {displayValue}
              </div>
              {hasTooltip && (
                <div
                  className="relative group inline-block"
                  style={{ zIndex: 1000 }}
                  onMouseEnter={(e) => {
                    const tooltip = (e.currentTarget as HTMLElement).querySelector('.tooltip-content') as HTMLElement;
                    if (tooltip) {
                      const iconRect = e.currentTarget.getBoundingClientRect();
                      // Position tooltip directly above the icon with minimal gap (2px)
                      const tooltipHeight = tooltip.offsetHeight || tooltip.scrollHeight;
                      tooltip.style.top = `${iconRect.top - tooltipHeight - 2}px`;
                      tooltip.style.left = `${iconRect.left + iconRect.width / 2}px`;
                    }
                  }}
                >
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 transition-colors" />
                  <div
                    className="tooltip-content fixed px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-800 whitespace-normal max-w-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none"
                    style={{
                      zIndex: 99999,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {valueStr}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                  </div>
                </div>
              )}
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
    data: groupedApplications,
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

  // Check scroll position and update indicators
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    // Reset scroll position when data changes
    container.scrollLeft = 0;
    checkScrollPosition();

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [groupedApplications, currentPage, pageSize]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay aplicaciones disponibles para este producto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white relative" style={{ overflow: 'visible' }}>
        {/* Left scroll gradient overlay */}
        {showLeftScroll && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 rounded-l-lg" />
        )}

        {/* Right scroll gradient overlay */}
        {showRightScroll && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 rounded-r-lg" />
        )}

        {/* Left scroll button */}
        {showLeftScroll && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Right scroll button */}
        {showRightScroll && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="custom-scrollbar"
          style={{
            overflowX: 'auto',
            overflowY: 'visible',
            scrollbarWidth: 'thin',
            scrollbarColor: '#e2e8f0 #f8fafc'
          }}
        >
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              height: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f8fafc;
              border-radius: 5px;
              margin: 0 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e2e8f0;
              border-radius: 5px;
              border: 2px solid #f8fafc;
              transition: background 0.2s ease;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #cbd5e1;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:active {
              background: #cbd5e1;
            }
          `}</style>
          <Table style={{ overflow: 'visible' }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="bg-[#20314f] text-white first:rounded-tl-lg last:rounded-tr-lg">
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
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      className={`hover:bg-orange-200 odd:bg-[#f5f5f5] even:bg-white`}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            style={{ overflow: 'visible', position: 'relative' }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
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
                  groupedApplications.length
                )}
              </strong>{" "}
              de <strong>{groupedApplications.length}</strong> resultados
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

