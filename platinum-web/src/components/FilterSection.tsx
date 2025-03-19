import { Category } from "../models/category";
import { useEffect, useState } from "react";
import FilterComponent from "./FilterComponent";
import { useItemContext } from "../context/Item-context";
import { useProducts } from "../hooks/useProducts";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type FilterSectionProps = {
  category: Category | null;
  filtroInfo: {
    numParte: string;
    referencia: string;
    vehiculo?: any;
  };
  onFilterChange?: (filters: Array<{ attributeId: string, value: string }>) => void;
};

const FilterSection = ({ category, filtroInfo, onFilterChange }: FilterSectionProps) => {
  const { setSelectedFilters, valuesAttributes } = useItemContext();
  const { products } = useProducts();

  const [attributeStates, setAttributeStates] = useState<{
    [key: string]: { open: boolean; selectedValue: string; disabled: boolean };
  }>({});

  // Store available options for each attribute
  const [availableOptions, setAvailableOptions] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    if (category?.attributes?.variant) {
      const initialStates = category.attributes.variant.reduce(
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
  const calculateAvailableOptions = (attributeId: string, currentFilters: Array<{ attributeId: string, value: string }>) => {
    if (!category?.attributes?.variant || !products.length) return [];

    // Get all variants from all products
    const allVariants = products.flatMap(product =>
      product.variants?.map(variant => ({
        id: variant.id,
        attributeValues: variant.attributeValues
      })) || []
    );

    // Get selected attribute indices for ordering
    const attributeOrder = category.attributes.variant.map(attr => attr.id);
    const currentAttributeIndex = attributeOrder.indexOf(attributeId);

    // Only consider filters for attributes that come before the current one
    const relevantFilters = currentFilters.filter(filter => {
      const filterIndex = attributeOrder.indexOf(filter.attributeId);
      return filterIndex < currentAttributeIndex;
    });

    // If no relevant filters, return all possible values for this attribute
    if (relevantFilters.length === 0) {
      const allValues = new Set<string>();

      allVariants.forEach(variant => {
        const attrValue = variant.attributeValues.find(av => av.idAttribute === attributeId);
        if (attrValue?.valueString) {
          allValues.add(attrValue.valueString);
        }
      });

      return Array.from(allValues).sort();
    }

    // Filter variants that match all selected filters
    const matchingVariants = allVariants.filter(variant =>
      relevantFilters.every(filter => {
        const matchingValue = variant.attributeValues.find(av =>
          av.idAttribute === filter.attributeId
        );

        return matchingValue?.valueString === filter.value;
      })
    );

    // Get all possible values for the current attribute from matching variants
    const validValues = new Set<string>();

    matchingVariants.forEach(variant => {
      const attrValue = variant.attributeValues.find(av => av.idAttribute === attributeId);
      if (attrValue?.valueString) {
        validValues.add(attrValue.valueString);
      }
    });

    return Array.from(validValues).sort();
  };

  // Update available options for all attributes
  const updateAllAvailableOptions = (currentFilters: Array<{ attributeId: string, value: string }>) => {
    if (!category?.attributes?.variant) return;

    const newOptions: { [key: string]: string[] } = {};

    category.attributes.variant.forEach(attribute => {
      newOptions[attribute.id] = calculateAvailableOptions(attribute.id, currentFilters);
    });

    setAvailableOptions(newOptions);
  };

  const handleSelect = (attributeId: string, name: string) => {
    setAttributeStates(prevState => {
      const attributeOrder = category?.attributes?.variant?.map(attr => attr.id) || [];
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
        const attributeOrder = category?.attributes?.variant?.map(attr => attr.id) || [];
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
    if (category?.attributes?.variant) {
      // Reset all attribute states
      const resetStates = category.attributes.variant.reduce(
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {category?.attributes?.variant?.map((attribute) => (
          <FilterComponent
            key={attribute.id}
            attribute={attribute}
            category={category}
            filtroInfo={filtroInfo}
            open={attributeStates[attribute.id]?.open || false}
            selectedValue={attributeStates[attribute.id]?.selectedValue || ""}
            enabled={!attributeStates[attribute.id]?.disabled}
            availableOptions={availableOptions[attribute.id] || []}
            onToggleOpen={(open: boolean) => toggleOpen(attribute.id, open)}
            onSelect={(name: string) => handleSelect(attribute.id, name)}
          />
        ))}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-10 self-end mb-3 text-naranja hover:bg-gray-100 hover:text-naranja"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;