import { useDeferredValue, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Category } from "../models/category";
import { Subcategory } from "../models/subcategory";
import {
  CategoryDrillLevel,
  flattenCategorySearchHits,
  getCategoryFilterLabel,
  matchCategorySearch,
} from "../utils/categoryHierarchyFilter";
import { cn } from "../lib/utils";

type CategoryHierarchyFilterProps = {
  categories: Category[];
  subcategoriesByCategoryId: Map<string, Subcategory[]>;
  selectedCategory: Category | null;
  selectedSubcategoryId: string | null;
  onSelect: (category: Category | null, subcategoryId: string | null) => void;
  triggerClassName?: string;
};

export function CategoryHierarchyFilter({
  categories,
  subcategoriesByCategoryId,
  selectedCategory,
  selectedSubcategoryId,
  onSelect,
  triggerClassName,
}: CategoryHierarchyFilterProps) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterMenuSearch, setFilterMenuSearch] = useState("");
  const filterMenuSearchDeferred = useDeferredValue(filterMenuSearch);
  const [drillStack, setDrillStack] = useState<CategoryDrillLevel[]>([]);

  const searchQuery = filterMenuSearchDeferred.trim().toLowerCase();
  const globalSearchHits =
    searchQuery.length > 0
      ? flattenCategorySearchHits(categories, subcategoriesByCategoryId).filter((hit) =>
          hit.label.toLowerCase().includes(searchQuery)
        )
      : [];
  const showGlobalSearch = searchQuery.length > 0;

  const goBack = () => setDrillStack((prev) => prev.slice(0, -1));
  const drillIntoCategory = (cat: Category) =>
    setDrillStack((prev) => [...prev, { type: "category", category: cat }]);
  const drillIntoSubcategory = (cat: Category, node: Subcategory) =>
    setDrillStack((prev) => [...prev, { type: "subcategory", category: cat, node }]);

  const handleFilterOpenChange = (open: boolean) => {
    setFilterMenuOpen(open);
    if (!open) {
      setDrillStack([]);
      setFilterMenuSearch("");
    }
  };

  const handleSelect = (cat: Category | null, subId: string | null) => {
    onSelect(cat, subId);
    setFilterMenuOpen(false);
    setDrillStack([]);
    setFilterMenuSearch("");
  };

  const selectedLabel = getCategoryFilterLabel(
    selectedCategory,
    selectedSubcategoryId,
    subcategoriesByCategoryId
  );

  return (
    <DropdownMenu open={filterMenuOpen} onOpenChange={handleFilterOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 sm:h-10 w-full justify-between bg-white font-normal text-gray-900",
            triggerClassName
          )}
        >
          <span className="truncate text-left text-sm">{selectedLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[240px] p-0"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        modal={false}
      >
        <div className="p-2 border-b" onPointerDown={(e) => e.stopPropagation()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar categoría o subcategoría..."
              value={filterMenuSearch}
              onChange={(e) => setFilterMenuSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              className="h-9 pl-8"
            />
          </div>
        </div>
        {drillStack.length > 0 && !showGlobalSearch && (
          <div className="px-3 py-2 bg-orange-50 border-b border-orange-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estás en</p>
            <p
              className="text-sm font-semibold truncate text-gray-900"
              title={drillStack
                .map((d) => (d.type === "category" ? d.category.name : d.node.name))
                .join(" › ")}
            >
              {drillStack
                .map((d) => (d.type === "category" ? d.category.name : d.node.name))
                .join(" › ")}
            </p>
          </div>
        )}
        <div className="max-h-[300px] overflow-y-auto py-1">
          {showGlobalSearch ? (
            <>
              <DropdownMenuItem onClick={() => handleSelect(null, null)}>
                Todas las categorías
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {globalSearchHits.length === 0 ? (
                <div className="px-2 py-4 text-sm text-gray-500 text-center">No hay coincidencias</div>
              ) : (
                globalSearchHits.map((hit) => (
                  <DropdownMenuItem
                    key={`${hit.category.id ?? ""}-${hit.subcategoryId ?? "all"}`}
                    onClick={() => handleSelect(hit.category, hit.subcategoryId)}
                  >
                    {hit.label}
                  </DropdownMenuItem>
                ))
              )}
            </>
          ) : (
            <>
              {drillStack.length > 0 && (
                <>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={goBack}
                    className="text-gray-600"
                  >
                    ← Volver
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {drillStack.length === 0 && (
                <>
                  <DropdownMenuItem onClick={() => handleSelect(null, null)}>
                    Todas las categorías
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories
                    .filter((cat) => matchCategorySearch(filterMenuSearchDeferred, cat.name ?? ""))
                    .map((cat) => {
                      if (!cat.id) return null;
                      const tree = subcategoriesByCategoryId.get(cat.id);
                      const hasChildren = tree && tree.length > 0;
                      return (
                        <DropdownMenuItem
                          key={cat.id}
                          onSelect={(e) => {
                            if (hasChildren) e.preventDefault();
                          }}
                          onClick={() =>
                            hasChildren ? drillIntoCategory(cat) : handleSelect(cat, null)
                          }
                          className="flex items-center justify-between"
                        >
                          <span>{cat.name}</span>
                          {hasChildren && <ChevronRight className="h-4 w-4" />}
                        </DropdownMenuItem>
                      );
                    })}
                </>
              )}
              {drillStack.length > 0 &&
                (() => {
                  const top = drillStack[drillStack.length - 1];
                  if (top.type === "category") {
                    const catId = top.category.id ?? "";
                    const nodes = subcategoriesByCategoryId.get(catId) ?? [];
                    return (
                      <>
                        <DropdownMenuItem onClick={() => handleSelect(top.category, null)}>
                          Todas las subcategorías
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {nodes
                          .filter((n) => matchCategorySearch(filterMenuSearchDeferred, n.name))
                          .map((node) => {
                            const hasChildren = node.children && node.children.length > 0;
                            return (
                              <DropdownMenuItem
                                key={node.id}
                                onSelect={(e) => {
                                  if (hasChildren) e.preventDefault();
                                }}
                                onClick={() =>
                                  hasChildren
                                    ? drillIntoSubcategory(top.category, node)
                                    : handleSelect(top.category, node.id)
                                }
                                className="flex items-center justify-between"
                              >
                                <span>{node.name}</span>
                                {hasChildren && <ChevronRight className="h-4 w-4" />}
                              </DropdownMenuItem>
                            );
                          })}
                      </>
                    );
                  }
                  const nodes = top.node.children ?? [];
                  return (
                    <>
                      <DropdownMenuItem onClick={() => handleSelect(top.category, top.node.id)}>
                        {top.node.name}
                      </DropdownMenuItem>
                      {nodes.length > 0 && <DropdownMenuSeparator />}
                      {nodes
                        .filter((n) => matchCategorySearch(filterMenuSearchDeferred, n.name))
                        .map((node) => {
                          const hasChildren = node.children && node.children.length > 0;
                          return (
                            <DropdownMenuItem
                              key={node.id}
                              onSelect={(e) => {
                                if (hasChildren) e.preventDefault();
                              }}
                              onClick={() =>
                                hasChildren
                                  ? drillIntoSubcategory(top.category, node)
                                  : handleSelect(top.category, node.id)
                              }
                              className="flex items-center justify-between"
                            >
                              <span>{node.name}</span>
                              {hasChildren && <ChevronRight className="h-4 w-4" />}
                            </DropdownMenuItem>
                          );
                        })}
                    </>
                  );
                })()}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
