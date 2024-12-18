import { Category } from "../models/category";
import { useEffect, useState } from "react";
import FilterComponent from "./FilterComponent";
import { useItemContext } from "../context/Item-context";

type FilterSectionProps = {
  category: Category | null;
  filtroInfo: {
    numParte: string;
    referencia: string;
  };
};

const FilterSection = ({ category, filtroInfo }: FilterSectionProps) => {
  const { setSelectedFilters } = useItemContext();

  const [attributeStates, setAttributeStates] = useState<{
    [key: string]: { open: boolean; selectedValue: string; disabled: boolean };
  }>({});

  useEffect(() => {
    if (category?.attributes) {
      const initialStates = category.attributes.variant?.reduce(
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
      setAttributeStates(initialStates || {});
    } else {
      setAttributeStates({});
    }
  }, [category]);

  useEffect(() => {
    setSelectedFilters([]);
  }, []);

  const handleSelect = (attributeId: string, name: string) => {
    setAttributeStates((prevState) => {
      const attributeKeys = Object.keys(prevState);
      const currentIndex = attributeKeys.indexOf(attributeId);
      const updatedState = { ...prevState };

      updatedState[attributeId] = {
        ...updatedState[attributeId],
        selectedValue: name,
        open: false,
      };

      if (!name) {
        for (let i = currentIndex; i < attributeKeys.length; i++) {
          updatedState[attributeKeys[i]] = {
            ...updatedState[attributeKeys[i]],
            selectedValue: "",
            disabled: i !== currentIndex,
          };
        }
      } else {
        for (let i = currentIndex + 1; i < attributeKeys.length; i++) {
          updatedState[attributeKeys[i]] = {
            ...updatedState[attributeKeys[i]],
            selectedValue: "",
            disabled: i !== currentIndex + 1,
          };
        }
      }

      return updatedState;
    });

    setSelectedFilters((prevFilters) => {
      if (!name) {
        return prevFilters.filter(
          (filter) => filter.attributeId !== attributeId
        );
      }

      const updatedFilters = prevFilters.filter(
        (filter) => filter.attributeId !== attributeId
      );
      return [...updatedFilters, { attributeId, value: name }];
    });
  };

  const toggleOpen = (attributeId: string, open: boolean) => {
    setAttributeStates((prevState) => ({
      ...prevState,
      [attributeId]: { ...prevState![attributeId], open },
    }));
  };

  return (
    <div className="flex gap-4">
      {category?.attributes !== undefined &&
        category?.attributes?.variant?.map((attribute) => (
          <FilterComponent
            key={attribute.id}
            attribute={attribute}
            category={category}
            filtroInfo={filtroInfo}
            open={attributeStates![attribute.id]?.open}
            selectedValue={attributeStates![attribute.id]?.selectedValue}
            enabled={!attributeStates![attribute.id]?.disabled}
            onToggleOpen={(open: boolean) => toggleOpen(attribute.id, open)}
            onSelect={(name: string) => handleSelect(attribute.id, name)}
          />
        ))}
    </div>
  );
};

export default FilterSection;
