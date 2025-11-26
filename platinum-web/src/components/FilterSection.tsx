import { Category, Attribute } from "../models/category";
import { useEffect, useState } from "react";
import FilterComponent from "./FilterComponent";
import { useItemContext } from "../context/Item-context";
// import { useProducts } from "../hooks/useProducts";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Item } from "../models/item";
import { AttributeValue } from "../models/item";

type FilterSectionProps = {
  category: Category | null;
  filtroInfo: {
    numParte: string;
    referencia: string;
    vehiculo?: {
      selectedFilters?: Array<{ attributeId: string, value: string }>;
    };
  };
  products?: Item[]; // Products for filtering logic
  onFilterChange?: (filters: Array<{ attributeId: string, value: string }>) => void;
};

const FilterSection = ({ category, filtroInfo, onFilterChange, products = [] }: FilterSectionProps) => {
  const { setSelectedFilters } = useItemContext();
  // const { products } = useProducts(); // Removed internal hook usage

  const [attributeStates, setAttributeStates] = useState<{
    [key: string]: { open: boolean; selectedValue: string; disabled: boolean };
  }>({});

  // Store available options for each attribute
  const [availableOptions, setAvailableOptions] = useState<{
    [key: string]: string[];
  }>({});

  // Determine which attributes to use for filtering (application first, then variant as fallback)
  const getFilterAttributes = () => {
    let attributes: Attribute[] = [];
    if (category?.attributes?.application && category.attributes.application.length > 0) {
      attributes = category.attributes.application;
    } else if (category?.attributes?.variant && category.attributes.variant.length > 0) {
      attributes = category.attributes.variant;
    }
    // Sort by order field (ascending) - Modelo should be first (order: 1)
    return attributes.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  useEffect(() => {
    // Use flexible attribute structure - application attributes for vehicle filtering, variant for size/color
    const filterAttributes = getFilterAttributes();

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

      // Reset filters when category changes
      setSelectedFilters([]);
    } else {
      setAttributeStates({});
    }
  }, [category]);

  useEffect(() => {
    // Initialize with empty filters
    setSelectedFilters([]);
  }, []);

  // Calculate available options for a specific attribute based on current selections
  // Works with application attributes (for vehicle filtering) or variant attributes (for size/color)
  const calculateAvailableOptions = (attributeId: string, currentFilters: Array<{ attributeId: string, value: string }>) => {
    const filterAttributes = getFilterAttributes();
    if (!filterAttributes.length || !products.length) return [];

    // Determine if we're using application or variant attributes
    const usingApplicationAttributes = category?.attributes?.application && category.attributes.application.length > 0;

    // Get attribute values from either applications or variants
    let allAttributeSources: Array<{ id: string; attributeValues: AttributeValue[] }> = [];

    if (usingApplicationAttributes) {
      // Get all applications from all products
      allAttributeSources = products.flatMap((product: Item) =>
        product.applications?.map((application) => ({
          id: application.id,
          attributeValues: application.attributeValues || []
        })) || []
      );
    } else {
      // Get all variants from all products
      allAttributeSources = products.flatMap((product: Item) =>
        product.variants?.map((variant) => ({
          id: variant.id,
          attributeValues: variant.attributeValues || []
        })) || []
      );
    }

    // Get selected attribute indices for ordering
    const attributeOrder = filterAttributes.map(attr => attr.id);
    const currentAttributeIndex = attributeOrder.indexOf(attributeId);

    // Only consider filters for attributes that come before the current one
    const relevantFilters = currentFilters.filter(filter => {
      const filterIndex = attributeOrder.indexOf(filter.attributeId);
      return filterIndex < currentAttributeIndex;
    });

    // If no relevant filters, return all possible values for this attribute
    if (relevantFilters.length === 0) {
      const allValues = new Set<string>();

      allAttributeSources.forEach((source) => {
        const attrValue = source.attributeValues.find((av: AttributeValue) => av.idAttribute === attributeId);
        const value = attrValue?.valueString ||
          attrValue?.valueNumber?.toString() ||
          attrValue?.valueBoolean?.toString() ||
          attrValue?.valueDate?.toString();
        if (value) {
          allValues.add(value);
        }
      });

      return Array.from(allValues).sort();
    }

    // Filter sources that match all selected filters
    const matchingSources = allAttributeSources.filter((source) =>
      relevantFilters.every((filter) => {
        const matchingValue = source.attributeValues.find((av: AttributeValue) =>
          av.idAttribute === filter.attributeId
        );
        const value = matchingValue?.valueString ||
          matchingValue?.valueNumber?.toString() ||
          matchingValue?.valueBoolean?.toString() ||
          matchingValue?.valueDate?.toString();

        return value === filter.value;
      })
    );

    // Get all possible values for the current attribute from matching sources
    const validValues = new Set<string>();

    matchingSources.forEach((source) => {
      const attrValue = source.attributeValues.find((av: AttributeValue) => av.idAttribute === attributeId);
      const value = attrValue?.valueString ||
        attrValue?.valueNumber?.toString() ||
        attrValue?.valueBoolean?.toString() ||
        attrValue?.valueDate?.toString();
      if (value) {
        validValues.add(value);
      }
    });

    return Array.from(validValues).sort();
  };

  // Update available options for all attributes
  const updateAllAvailableOptions = (currentFilters: Array<{ attributeId: string, value: string }>) => {
    const filterAttributes = getFilterAttributes();
    if (!filterAttributes.length) return;

    const newOptions: { [key: string]: string[] } = {};

    filterAttributes.forEach(attribute => {
      newOptions[attribute.id] = calculateAvailableOptions(attribute.id, currentFilters);
    });

    setAvailableOptions(newOptions);
  };

  const handleSelect = (attributeId: string, name: string) => {
    setAttributeStates(prevState => {
      const filterAttributes = getFilterAttributes();
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

      return updatedState;
    });

    setSelectedFilters(prevFilters => {
      let newFilters;

      if (!name) {
        // Remove this filter and all subsequent ones
        const filterAttributes = getFilterAttributes();
        const attributeOrder = filterAttributes.map(attr => attr.id);
        const currentIndex = attributeOrder.indexOf(attributeId);

        newFilters = prevFilters.filter(filter => {
          const filterIndex = attributeOrder.indexOf(filter.attributeId);
          return filterIndex < currentIndex;
        });
      } else {
        // Remove any existing filter with this attribute ID and add the new one
        const withoutCurrent = prevFilters.filter(filter => filter.attributeId !== attributeId);
        newFilters = [...withoutCurrent, { attributeId, value: name }];
      }

      // Update available options based on new filters
      updateAllAvailableOptions(newFilters);

      // Call the callback
      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      return newFilters;
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

  // Clear all filters
  const clearAllFilters = () => {
    const filterAttributes = getFilterAttributes();
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

      // Clear selected filters
      setSelectedFilters([]);

      // Call the callback with empty filters
      if (onFilterChange) {
        onFilterChange([]);
      }
    }
  };

  const filterAttributes = getFilterAttributes();

  return (
    <div className="flex flex-col gap-4">
      {filterAttributes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {filterAttributes.map((attribute) => (
              <FilterComponent
                key={attribute.id}
                attribute={attribute}
                category={category!}
                filtroInfo={filtroInfo}
                open={attributeStates[attribute.id]?.open || false}
                selectedValue={attributeStates[attribute.id]?.selectedValue || ""}
                enabled={!attributeStates[attribute.id]?.disabled}
                availableOptions={availableOptions[attribute.id] || []}
                onToggleOpen={(open: boolean) => toggleOpen(attribute.id, open)}
                onSelect={(name: string) => handleSelect(attribute.id, name)}
              />
            ))}
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-10 text-naranja hover:bg-gray-100 hover:text-naranja"
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