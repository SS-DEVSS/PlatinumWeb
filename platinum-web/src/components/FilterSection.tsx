import { Category, Attribute } from "../models/category";
import { useEffect, useState, useMemo } from "react";
import FilterComponent from "./FilterComponent";

type VehicleFilterSelection = { attributeId: string; value: string };

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

function buildAttributeStatesFromFilters(
  filterAttributes: Attribute[],
  selectedFilters: VehicleFilterSelection[]
): Record<string, AttributeState> {
  const order = filterAttributes.map((attribute) => attribute.id);
  const valueById = new Map(selectedFilters.map((filter) => [filter.attributeId, filter.value]));
  const lastSelectedIndex =
    selectedFilters.length > 0
      ? order.indexOf(selectedFilters[selectedFilters.length - 1].attributeId)
      : -1;

  return filterAttributes.reduce<Record<string, AttributeState>>((acc, attribute, index) => {
    const disabled =
      selectedFilters.length === 0 ? index !== 0 : index > lastSelectedIndex + 1;

    acc[attribute.id] = {
      open: false,
      selectedValue: valueById.get(attribute.id) ?? "",
      disabled,
    };
    return acc;
  }, {});
}

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
    return attributes.sort((a, b) => (a.order || 0) - (b.order || 0));
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
        return filterOptions[attributeId].map((value) => String(value));
      }
      return [];
    };
  }, [filterOptions]);

  const handleSelect = (attributeId: string, name: string) => {
    setAttributeStates((prevState) => {
      const attributeOrder = filterAttributes.map((attr) => attr.id);
      const currentIndex = attributeOrder.indexOf(attributeId);
      const updatedState = { ...prevState };

      updatedState[attributeId] = {
        ...updatedState[attributeId],
        selectedValue: name,
        open: false,
      };

      if (!name) {
        for (let i = currentIndex + 1; i < attributeOrder.length; i++) {
          const nextAttrId = attributeOrder[i];
          updatedState[nextAttrId] = {
            ...updatedState[nextAttrId],
            selectedValue: "",
            disabled: true,
          };
        }
      } else {
        for (let i = currentIndex + 1; i < attributeOrder.length; i++) {
          const nextAttrId = attributeOrder[i];
          updatedState[nextAttrId] = {
            ...updatedState[nextAttrId],
            selectedValue: "",
            disabled: i !== currentIndex + 1,
          };
        }
      }

      let newFilters: VehicleFilterSelection[];

      if (!name) {
        newFilters = attributeOrder
          .slice(0, currentIndex)
          .map((attrId) => ({
            attributeId: attrId,
            value: updatedState[attrId]?.selectedValue || "",
          }))
          .filter((filter) => filter.value !== "");
      } else {
        newFilters = attributeOrder
          .slice(0, currentIndex + 1)
          .map((attrId) => ({
            attributeId: attrId,
            value:
              attrId === attributeId
                ? name
                : updatedState[attrId]?.selectedValue || prevState[attrId]?.selectedValue || "",
          }))
          .filter((filter) => filter.value !== "");
      }

      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      return updatedState;
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
        value: attributeStates[attr.id]?.selectedValue || "",
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
