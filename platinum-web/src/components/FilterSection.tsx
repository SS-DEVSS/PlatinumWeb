import { useEffect, useMemo, useState } from "react";
import FilterComponent from "./FilterComponent";
import { Attribute, Category } from "../models/category";
import {
  applyFilterSelection,
  buildAttributeStatesFromFilters,
  sortFilterAttributes,
  VehicleFilterSelection,
} from "../utils/webCatalogFilter";
import { dedupeFilterOptionValues, normalizeFilterOptionDisplayValue } from "../utils/applicationAttributeValue";

type AttributeState = {
  open: boolean;
  selectedValue: string;
  disabled: boolean;
};

type FilterSectionProps = {
  category: Category | null;
  filtroInfo: {
    numParte: string;
    referencia: string;
    vehiculo?: {
      selectedFilters?: VehicleFilterSelection[];
    };
  };
  filterOptions?: Record<string, Array<string | number | boolean | Date>>;
  loadingFilterOptions?: boolean;
  onFilterChange?: (filters: VehicleFilterSelection[]) => void;
  onActiveFiltersChange?: (
    filters: Array<{ attributeId: string; attributeName: string; value: string }>
  ) => void;
};

const FilterSection = ({
  category,
  filtroInfo,
  onFilterChange,
  filterOptions,
  loadingFilterOptions = false,
  onActiveFiltersChange,
}: FilterSectionProps) => {
  const [attributeStates, setAttributeStates] = useState<Record<string, AttributeState>>({});

  const filterAttributes = useMemo(() => {
    let attributes: Attribute[] = [];
    if (category?.attributes?.application && category.attributes.application.length > 0) {
      attributes = category.attributes.application;
    } else if (category?.attributes?.variant && category.attributes.variant.length > 0) {
      attributes = category.attributes.variant;
    }
    return sortFilterAttributes(attributes);
  }, [category?.attributes?.application, category?.attributes?.variant]);

  const persistedFilters = filtroInfo.vehiculo?.selectedFilters ?? [];
  const persistedFiltersKey = useMemo(
    () => JSON.stringify(persistedFilters),
    [persistedFilters]
  );

  useEffect(() => {
    if (filterAttributes.length === 0) {
      setAttributeStates({});
      return;
    }
    setAttributeStates(buildAttributeStatesFromFilters(filterAttributes, persistedFilters));
  }, [category?.id, filterAttributes, persistedFiltersKey]);

  const getOptionsForAttribute = useMemo(() => {
    return (attributeId: string): string[] => {
      if (filterOptions && filterOptions[attributeId]) {
        const attribute = filterAttributes.find((item) => item.id === attributeId);
        if (!attribute) {
          return filterOptions[attributeId].map((value) => String(value));
        }
        return dedupeFilterOptionValues(filterOptions[attributeId], attribute);
      }
      return [];
    };
  }, [filterOptions, filterAttributes]);

  const handleSelect = (attributeId: string, name: string) => {
    setAttributeStates((prevState) => {
      const currentFilters = filterAttributes
        .filter((attribute) => prevState[attribute.id]?.selectedValue)
        .map((attribute) => ({
          attributeId: attribute.id,
          value: prevState[attribute.id]?.selectedValue || "",
        }));

      const newFilters = applyFilterSelection(
        filterAttributes,
        currentFilters,
        attributeId,
        name
      );
      const nextState = buildAttributeStatesFromFilters(filterAttributes, newFilters);

      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      return nextState;
    });
  };

  const toggleOpen = (attributeId: string, open: boolean) => {
    setAttributeStates((prevState) => ({
      ...prevState,
      [attributeId]: { ...prevState[attributeId], open },
    }));
  };

  const activeFilters = useMemo(() => {
    return filterAttributes
      .filter((attr) => attributeStates[attr.id]?.selectedValue)
      .map((attr) => ({
        attributeId: attr.id,
        attributeName: attr.displayName || attr.name,
        value: normalizeFilterOptionDisplayValue(
          attributeStates[attr.id]?.selectedValue || "",
          attr
        ),
      }));
  }, [attributeStates, filterAttributes]);

  useEffect(() => {
    if (!onActiveFiltersChange) return;
    if (activeFilters.length === 0 && persistedFilters.length > 0) return;
    onActiveFiltersChange(activeFilters);
  }, [activeFilters, onActiveFiltersChange, persistedFilters.length]);

  return (
    <div className="flex flex-col gap-4">
      {filterAttributes.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filterAttributes.map((attribute) => {
            const hasSelection = Boolean(attributeStates[attribute.id]?.selectedValue);
            const isDisabled = Boolean(attributeStates[attribute.id]?.disabled);
            const options = getOptionsForAttribute(attribute.id);
            const isAttributeLoading =
              loadingFilterOptions &&
              !hasSelection &&
              !isDisabled &&
              options.length === 0;
            return (
              <FilterComponent
                key={attribute.id}
                attribute={attribute}
                category={category!}
                filtroInfo={filtroInfo}
                open={attributeStates[attribute.id]?.open || false}
                selectedValue={attributeStates[attribute.id]?.selectedValue || ""}
                enabled={!isDisabled}
                availableOptions={options}
                loading={isAttributeLoading}
                onToggleOpen={(open: boolean) => toggleOpen(attribute.id, open)}
                onSelect={(name: string) => handleSelect(attribute.id, name)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          No hay filtros disponibles para esta categoría.
        </div>
      )}
    </div>
  );
};

export default FilterSection;
