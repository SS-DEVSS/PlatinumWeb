import { Category, Attribute } from "../models/category";
import { useEffect, useState, useMemo } from "react";
import FilterComponent from "./FilterComponent";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type FilterSectionProps = {
  category: Category | null;
  filtroInfo: {
    numParte: string;
    referencia: string;
    vehiculo?: {
      selectedFilters?: Array<{ attributeId: string, value: string }>;
    };
  };
  filterOptions?: Record<string, Array<string | number | boolean | Date>>; // Server-side filter options
  onFilterChange?: (filters: Array<{ attributeId: string, value: string }>) => void;
  onActiveFiltersChange?: (filters: Array<{ attributeId: string, attributeName: string, value: string }>) => void;
};

const FilterSection = ({ category, filtroInfo, onFilterChange, filterOptions, onActiveFiltersChange }: FilterSectionProps) => {
  const [attributeStates, setAttributeStates] = useState<{
    [key: string]: { open: boolean; selectedValue: string; disabled: boolean };
  }>({});

  // filtroInfo is used by FilterComponent, selectedFilters inside it is optional and may not be accessed directly here

  // Determine which attributes to use for filtering (application first, then variant as fallback)
  const filterAttributes = useMemo(() => {
    let attributes: Attribute[] = [];
    if (category?.attributes?.application && category.attributes.application.length > 0) {
      attributes = category.attributes.application;
    } else if (category?.attributes?.variant && category.attributes.variant.length > 0) {
      attributes = category.attributes.variant;
    }
    // Sort by order field (ascending) - Modelo should be first (order: 1)
    return attributes.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [category?.attributes?.application, category?.attributes?.variant]);

  useEffect(() => {
    // Use flexible attribute structure - application attributes for vehicle filtering, variant for size/color

    if (filterAttributes.length > 0) {
      const initialStates = filterAttributes.reduce(
        (acc, attribute, index) => {
          acc[attribute.id] = {
            open: false,
            selectedValue: "",
            disabled: index !== 0,
          };
          return acc;
        },
        {} as {
          [key: string]: {
            open: boolean;
            selectedValue: string;
            disabled: boolean;
          };
        }
      );
      setAttributeStates(initialStates);
    } else {
      setAttributeStates({});
    }
  }, [category?.id, filterAttributes]);

  // Use server-provided options
  const getOptionsForAttribute = useMemo(() => {
    return (attributeId: string): string[] => {
      if (filterOptions && filterOptions[attributeId]) {
        // Convert all values to strings for FilterComponent compatibility
        return filterOptions[attributeId].map(v => String(v));
      }
      return [];
    };
  }, [filterOptions]);

  const handleSelect = (attributeId: string, name: string) => {
    setAttributeStates(prevState => {
      const attributeOrder = filterAttributes.map(attr => attr.id);
      const currentIndex = attributeOrder.indexOf(attributeId);
      const updatedState = { ...prevState };

      // Update the current attribute
      updatedState[attributeId] = {
        ...updatedState[attributeId],
        selectedValue: name,
        open: false,
      };

      if (!name) {
        // If selecting "no value", disable all subsequent filters
        for (let i = currentIndex + 1; i < attributeOrder.length; i++) {
          const nextAttrId = attributeOrder[i];
          updatedState[nextAttrId] = {
            ...updatedState[nextAttrId],
            selectedValue: "",
            disabled: true,
          };
        }
      } else {
        // Enable the next filter only
        for (let i = currentIndex + 1; i < attributeOrder.length; i++) {
          const nextAttrId = attributeOrder[i];
          updatedState[nextAttrId] = {
            ...updatedState[nextAttrId],
            selectedValue: "",
            disabled: i !== currentIndex + 1,
          };
        }
      }

      // Build filters from updated state (inside callback so we can access updatedState)
      let newFilters: Array<{ attributeId: string; value: string }>;

      if (!name) {
        // Remove this filter and all subsequent ones
        newFilters = attributeOrder
          .slice(0, currentIndex)
          .map(attrId => ({
            attributeId: attrId,
            value: updatedState[attrId]?.selectedValue || ""
          }))
          .filter(filter => filter.value !== "");
      } else {
        // Build filters up to and including current selection
        newFilters = attributeOrder
          .slice(0, currentIndex + 1)
          .map(attrId => ({
            attributeId: attrId,
            value: attrId === attributeId ? name : (updatedState[attrId]?.selectedValue || prevState[attrId]?.selectedValue || "")
          }))
          .filter(filter => filter.value !== "");
      }

      // Call the callback immediately with the new filters
      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      return updatedState;
    });
  };

  const toggleOpen = (attributeId: string, open: boolean) => {
    setAttributeStates(prevState => ({
      ...prevState,
      [attributeId]: { ...prevState[attributeId], open },
    }));
  };

  // Get count of active filters
  const activeFiltersCount = Object.values(attributeStates).filter(
    state => state.selectedValue !== ""
  ).length;

  // Get active filters with attribute names for display
  const activeFilters = useMemo(() => {
    return filterAttributes
      .filter(attr => attributeStates[attr.id]?.selectedValue)
      .map(attr => ({
        attributeId: attr.id,
        attributeName: attr.displayName || attr.name,
        value: attributeStates[attr.id]?.selectedValue || ""
      }));
  }, [attributeStates, filterAttributes]);

  // Notify parent of active filters change
  useEffect(() => {
    if (onActiveFiltersChange) {
      onActiveFiltersChange(activeFilters);
    }
  }, [activeFilters, onActiveFiltersChange]);

  // Clear all filters
  const clearAllFilters = () => {
    if (filterAttributes.length > 0) {
      // Reset all attribute states
      const resetStates = filterAttributes.reduce(
        (acc, attribute, index) => {
          acc[attribute.id] = {
            open: false,
            selectedValue: "",
            disabled: index !== 0,
          };
          return acc;
        },
        {} as {
          [key: string]: {
            open: boolean;
            selectedValue: string;
            disabled: boolean;
          };
        }
      );
      setAttributeStates(resetStates);

      // Call the callback with empty filters
      if (onFilterChange) {
        onFilterChange([]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {filterAttributes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3">
            {filterAttributes.map((attribute) => (
              <FilterComponent
                key={attribute.id}
                attribute={attribute}
                category={category!}
                filtroInfo={filtroInfo}
                open={attributeStates[attribute.id]?.open || false}
                selectedValue={attributeStates[attribute.id]?.selectedValue || ""}
                enabled={!attributeStates[attribute.id]?.disabled}
                availableOptions={getOptionsForAttribute(attribute.id)}
                onToggleOpen={(open: boolean) => toggleOpen(attribute.id, open)}
                onSelect={(name: string) => handleSelect(attribute.id, name)}
              />
            ))}
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex justify-end pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-9 text-naranja hover:bg-gray-100 hover:text-naranja text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros ({activeFiltersCount})
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500 text-sm">
          No hay filtros disponibles para esta categoría.
        </div>
      )}
    </div>
  );
};

export default FilterSection;