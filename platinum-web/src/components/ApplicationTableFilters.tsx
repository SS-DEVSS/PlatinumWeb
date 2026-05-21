import { useEffect, useMemo, useState } from "react";
import { Attribute, Category } from "../models/category";
import FilterComponent from "./FilterComponent";
import { Button } from "./ui/button";
import { getDistinctApplicationFilterOptions } from "../utils/applicationAttributeValue";
import { Application } from "../models/application";

type FilterSelection = { attributeId: string; value: string };

type ApplicationTableFiltersProps = {
  category: Category;
  filterAttributes: Attribute[];
  applications: Application[];
  onFiltersChange: (filters: FilterSelection[]) => void;
};

type AttributeState = {
  open: boolean;
  selectedValue: string;
  disabled: boolean;
};

function buildAttributeStates(
  filterAttributes: Attribute[],
  selectedFilters: FilterSelection[]
): Record<string, AttributeState> {
  const order = filterAttributes.map((a) => a.id);
  const valueById = new Map(selectedFilters.map((f) => [f.attributeId, f.value]));
  const lastIndex =
    selectedFilters.length > 0
      ? order.indexOf(selectedFilters[selectedFilters.length - 1].attributeId)
      : -1;

  return filterAttributes.reduce<Record<string, AttributeState>>((acc, attribute, index) => {
    const disabled =
      selectedFilters.length === 0 ? index !== 0 : index > lastIndex + 1;
    acc[attribute.id] = {
      open: false,
      selectedValue: valueById.get(attribute.id) ?? "",
      disabled,
    };
    return acc;
  }, {});
}

const ApplicationTableFilters = ({
  category,
  filterAttributes,
  applications,
  onFiltersChange,
}: ApplicationTableFiltersProps) => {
  const [attributeStates, setAttributeStates] = useState<Record<string, AttributeState>>({});

  const attributesById = useMemo(
    () => new Map(filterAttributes.map((a) => [a.id, a])),
    [filterAttributes]
  );

  const activeFilters = useMemo(
    () =>
      filterAttributes
        .map((attr) => ({
          attributeId: attr.id,
          value: attributeStates[attr.id]?.selectedValue ?? "",
        }))
        .filter((f) => f.value !== ""),
    [attributeStates, filterAttributes]
  );

  useEffect(() => {
    if (filterAttributes.length === 0) {
      setAttributeStates({});
      onFiltersChange([]);
      return;
    }
    setAttributeStates(buildAttributeStates(filterAttributes, []));
  }, [category.id, filterAttributes, onFiltersChange]);

  useEffect(() => {
    onFiltersChange(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const handleSelect = (attributeId: string, value: string) => {
    setAttributeStates((prev) => {
      const order = filterAttributes.map((a) => a.id);
      const currentIndex = order.indexOf(attributeId);
      const next = { ...prev };

      order.forEach((id, index) => {
        if (index < currentIndex) return;
        if (index === currentIndex) {
          next[id] = {
            open: false,
            selectedValue: value,
            disabled: false,
          };
          return;
        }
        next[id] = { open: false, selectedValue: "", disabled: index !== currentIndex + 1 };
      });

      return next;
    });
  };

  const clearFilters = () => {
    setAttributeStates(buildAttributeStates(filterAttributes, []));
  };

  if (filterAttributes.length === 0) return null;

  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        {activeFilters.length > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-3">
        {filterAttributes.map((attribute) => {
          const priorFilters = activeFilters.filter((f) => f.attributeId !== attribute.id);
          const options = getDistinctApplicationFilterOptions(
            applications,
            attribute,
            priorFilters,
            attributesById
          );
          const state = attributeStates[attribute.id] ?? {
            open: false,
            selectedValue: "",
            disabled: true,
          };

          return (
            <div key={attribute.id} className="min-w-0">
              <FilterComponent
                attribute={attribute}
                category={category}
                filtroInfo={{ numParte: "", referencia: "" }}
                open={state.open}
                selectedValue={state.selectedValue}
                enabled={!state.disabled}
                availableOptions={options}
                onToggleOpen={(open) =>
                  setAttributeStates((prev) => ({
                    ...prev,
                    [attribute.id]: { ...state, open },
                  }))
                }
                onSelect={(value) => handleSelect(attribute.id, value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTableFilters;
