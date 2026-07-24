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
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Attribute, Category, CategoryAttributesTypes } from "../models/category";
import { AttributeValue } from "../models/item";
import { Application } from "../models/application";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import ApplicationTableFilters from "./ApplicationTableFilters";
import {
  extractYearFromDate,
  formatDateValue,
  applicationMatchesFilters,
  APPLICATION_TABLE_FILTER_LIMIT,
  isCatalogueHiddenApplicationAttribute,
} from "../utils/applicationAttributeValue";

type ApplicationsTableProps = {
  category: Category | null;
  applications: Application[];
};

type ApplicationFilterSelection = { attributeId: string; value: string };

const APPLICATIONS_PAGE_SIZE = 30;

const ApplicationsTable = ({ category, applications }: ApplicationsTableProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showLeftScroll, setShowLeftScroll] = useState<boolean>(false);
  const [showRightScroll, setShowRightScroll] = useState<boolean>(true);
  const [tableFilters, setTableFilters] = useState<ApplicationFilterSelection[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { attributes } = category || {};

  const filterAttributes = useMemo(() => {
    if (!attributes?.application?.length) return [];
    return [...attributes.application]
      .filter((attr) => !isCatalogueHiddenApplicationAttribute(attr))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, APPLICATION_TABLE_FILTER_LIMIT);
  }, [attributes?.application]);

  const attributesById = useMemo(
    () => new Map(filterAttributes.map((attr) => [attr.id, attr])),
    [filterAttributes]
  );

  const handleFiltersChange = useCallback((filters: ApplicationFilterSelection[]) => {
    setTableFilters(filters);
    setCurrentPage(0);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (!applications?.length) return [];
    if (tableFilters.length === 0) return applications;
    return applications.filter((app) =>
      applicationMatchesFilters(app, tableFilters, attributesById)
    );
  }, [applications, tableFilters, attributesById]);

  // Group applications by year ranges (same logic as mobile)
  const groupedApplications = useMemo(() => {
    if (!filteredApplications || !attributes?.application) {
      return filteredApplications;
    }

    const appAttrs = [...attributes.application].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Find the year attribute index
    const yearAttrIndex = appAttrs.findIndex((attr) =>
      attr.name.toLowerCase().includes('año') ||
      attr.displayName?.toLowerCase().includes('año') ||
      attr.name.toLowerCase().includes('year')
    );

    if (yearAttrIndex === -1) return filteredApplications;

    // Group rows by all attributes except year
    const grouped = new Map<string, Application[]>();

    filteredApplications.forEach(app => {
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

          let numA = 0;
          let numB = 0;

          if (yearAttr.type === CategoryAttributesTypes.DATE) {
            if (yearA?.valueDate) {
              numA = new Date(yearA.valueDate).getFullYear();
            }
            if (yearB?.valueDate) {
              numB = new Date(yearB.valueDate).getFullYear();
            }
          } else {
            numA = Number(yearA?.valueNumber || yearA?.valueString) || 0;
            numB = Number(yearB?.valueNumber || yearB?.valueString) || 0;
          }

          return numA - numB;
        });

        // Create year ranges for consecutive years
        let currentGroup: Application[] = [sortedApps[0]];

        for (let i = 1; i < sortedApps.length; i++) {
          const yearAttr = appAttrs[yearAttrIndex];
          const prevYearAttr = sortedApps[i - 1].attributeValues.find(av => av.idAttribute === yearAttr.id);
          const currYearAttr = sortedApps[i].attributeValues.find(av => av.idAttribute === yearAttr.id);

          let prevYear = 0;
          let currYear = 0;

          if (yearAttr.type === CategoryAttributesTypes.DATE) {
            prevYear = extractYearFromDate(prevYearAttr?.valueDate) ?? 0;
            currYear = extractYearFromDate(currYearAttr?.valueDate) ?? 0;
          } else {
            prevYear = Number(prevYearAttr?.valueNumber || prevYearAttr?.valueString) || 0;
            currYear = Number(currYearAttr?.valueNumber || currYearAttr?.valueString) || 0;
          }

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
              const yearAttr = appAttrs[yearAttrIndex];
              const firstYearAttr = currentGroup[0].attributeValues.find(av => av.idAttribute === yearAttr.id);
              const lastYearAttr = currentGroup[currentGroup.length - 1].attributeValues.find(av => av.idAttribute === yearAttr.id);

              let firstYear = '';
              let lastYear = '';

              if (yearAttr.type === CategoryAttributesTypes.DATE) {
                const firstYearNum = extractYearFromDate(firstYearAttr?.valueDate);
                const lastYearNum = extractYearFromDate(lastYearAttr?.valueDate);
                firstYear = firstYearNum?.toString() || '';
                lastYear = lastYearNum?.toString() || '';
              } else {
                firstYear = firstYearAttr?.valueNumber?.toString() || firstYearAttr?.valueString || '';
                lastYear = lastYearAttr?.valueNumber?.toString() || lastYearAttr?.valueString || '';
              }

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
          const yearAttr = appAttrs[yearAttrIndex];
          const firstYearAttr = currentGroup[0].attributeValues.find(av => av.idAttribute === yearAttr.id);
          const lastYearAttr = currentGroup[currentGroup.length - 1].attributeValues.find(av => av.idAttribute === yearAttr.id);

          let firstYear = '';
          let lastYear = '';

          if (yearAttr.type === CategoryAttributesTypes.DATE) {
            const firstYearNum = extractYearFromDate(firstYearAttr?.valueDate);
            const lastYearNum = extractYearFromDate(lastYearAttr?.valueDate);
            firstYear = firstYearNum?.toString() || '';
            lastYear = lastYearNum?.toString() || '';
          } else {
            firstYear = firstYearAttr?.valueNumber?.toString() || firstYearAttr?.valueString || '';
            lastYear = lastYearAttr?.valueNumber?.toString() || lastYearAttr?.valueString || '';
          }

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

    // Sort by first 5 attributes in descending order
    if (attributes?.application && groupedApps.length > 0) {
      const appAttrs = [...attributes.application].sort((a, b) => (a.order || 0) - (b.order || 0));
      const first5Attrs = appAttrs.slice(0, 5);

      groupedApps.sort((a, b) => {
        for (const attr of first5Attrs) {
          const attrValueA = a.attributeValues.find(av => av.idAttribute === attr.id);
          const attrValueB = b.attributeValues.find(av => av.idAttribute === attr.id);

          const isDateAttribute = attr.type === CategoryAttributesTypes.DATE ||
            attr.name.toLowerCase().includes('año') ||
            attr.name.toLowerCase().includes('year') ||
            (attr.displayName && (attr.displayName.toLowerCase().includes('año') || attr.displayName.toLowerCase().includes('year')));

          let valueA: string | number = '';
          let valueB: string | number = '';

          if (isDateAttribute) {
            let yearA = extractYearFromDate(attrValueA?.valueDate);
            let yearB = extractYearFromDate(attrValueB?.valueDate);

            if (yearA === null && attrValueA?.valueString) {
              const dateFromString = new Date(attrValueA.valueString);
              if (!isNaN(dateFromString.getTime())) {
                yearA = dateFromString.getFullYear();
              }
            }
            if (yearB === null && attrValueB?.valueString) {
              const dateFromString = new Date(attrValueB.valueString);
              if (!isNaN(dateFromString.getTime())) {
                yearB = dateFromString.getFullYear();
              }
            }

            valueA = yearA ?? 0;
            valueB = yearB ?? 0;
            if (valueB !== valueA) {
              return valueA - valueB;
            }
          } else if (attr.type === CategoryAttributesTypes.NUMERIC) {
            valueA = attrValueA?.valueNumber ?? (attrValueA?.valueString ? parseFloat(attrValueA.valueString) : 0) ?? 0;
            valueB = attrValueB?.valueNumber ?? (attrValueB?.valueString ? parseFloat(attrValueB.valueString) : 0) ?? 0;
            if (valueB !== valueA) {
              return valueB - valueA;
            }
          } else {
            valueA = attrValueA?.valueString ?? attrValueA?.valueNumber?.toString() ?? attrValueA?.valueBoolean?.toString() ?? '';
            valueB = attrValueB?.valueString ?? attrValueB?.valueNumber?.toString() ?? attrValueB?.valueBoolean?.toString() ?? '';
            const strA = String(valueA).toLowerCase();
            const strB = String(valueB).toLowerCase();
            if (strB !== strA) {
              const comparison = strA.localeCompare(strB);
              return comparison;
            }
          }
        }
        return 0;
      });
    }

    return groupedApps;
  }, [filteredApplications, attributes]);

  const columns = useMemo(() => {
    // Get application attribute columns
    const getApplicationAttributeColumns = () => {
      if (!attributes?.application || attributes.application.length === 0) return [];

      const sortedAttributes = [...attributes.application]
        .filter((attr) => !isCatalogueHiddenApplicationAttribute(attr))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      return sortedAttributes.map((attribute: Attribute) => ({
        accessorKey: attribute.id,
        header: attribute.displayName || attribute.name,
        cell: ({ row }: { row: { original: Application } }) => {
          const application: Application = row.original;
          const attrValue = application.attributeValues.find(
            (av: AttributeValue) => av.idAttribute === attribute.id
          );

          let fullValue: string;

          const isDateAttribute = attribute.type === CategoryAttributesTypes.DATE ||
            attribute.name.toLowerCase().includes('año') ||
            attribute.name.toLowerCase().includes('year') ||
            (attribute.displayName && (attribute.displayName.toLowerCase().includes('año') || attribute.displayName.toLowerCase().includes('year')));

          if (isDateAttribute && attrValue?.valueDate) {
            fullValue = formatDateValue(attrValue.valueDate);
          } else if (isDateAttribute && attrValue?.valueString) {
            const dateFromString = new Date(attrValue.valueString);
            if (!isNaN(dateFromString.getTime())) {
              fullValue = dateFromString.getFullYear().toString();
            } else {
              fullValue = attrValue.valueString;
            }
          } else {
            fullValue =
              attrValue?.valueString ||
              attrValue?.valueNumber?.toString() ||
              attrValue?.valueBoolean?.toString() ||
              (attrValue?.valueDate ? formatDateValue(attrValue.valueDate) : null) ||
              "-";
          }

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

    return dynamicColumns;
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
        pageSize: APPLICATIONS_PAGE_SIZE,
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
  }, [groupedApplications, currentPage]);

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
      {category && filterAttributes.length > 0 && (
        <ApplicationTableFilters
          category={category}
          filterAttributes={filterAttributes}
          applications={applications}
          onFiltersChange={handleFiltersChange}
        />
      )}
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

      {groupedApplications.length > 0 && (
        <div className="mt-4 flex w-full max-w-full min-w-0 flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 sm:px-4">
          <p className="w-full min-w-0 text-center text-xs font-medium text-gray-700 sm:text-left sm:text-sm">
            Mostrando{" "}
            <span className="font-semibold text-gray-900">
              {table.getState().pagination.pageIndex * APPLICATIONS_PAGE_SIZE + 1} -{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * APPLICATIONS_PAGE_SIZE,
                groupedApplications.length
              )}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-gray-900">{groupedApplications.length}</span>{" "}
            resultados
          </p>
          {totalPages > 1 && (
            <div className="flex w-full max-w-full min-w-0 flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 shrink-0 px-2 border-gray-300 bg-white hover:bg-gray-50"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                &lt;&lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 shrink-0 px-2 border-gray-300 bg-white hover:bg-gray-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                &lt;
              </Button>
              <span className="min-w-0 whitespace-nowrap px-1 text-center text-xs text-gray-700 sm:text-sm">
                Página{" "}
                <span className="font-semibold text-gray-900">
                  {table.getState().pagination.pageIndex + 1} de {totalPages}
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-9 shrink-0 px-2 border-gray-300 bg-white hover:bg-gray-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                &gt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 shrink-0 px-2 border-gray-300 bg-white hover:bg-gray-50"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!table.getCanNextPage()}
              >
                &gt;&gt;
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;

