import { Category } from "../models/category";
import { useEffect, useState } from "react";
import FilterComponent from "./FilterComponent";

type FilterSectionProps = {
  category: Category | null;
  filtroInfo: {
    numParte: string;
    referencia: string;
  };
};

const FilterSection = ({ category, filtroInfo }: FilterSectionProps) => {
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
      setAttributeStates(initialStates!);
    }
  }, [category]);

  const handleSelect = (attributeId: string, name: string) => {
    setAttributeStates((prevState: any) => {
      const attributeKeys = Object.keys(prevState);
      const currentIndex = attributeKeys.indexOf(attributeId);

      const updatedState = {
        ...prevState,
        [attributeId]: {
          ...prevState![attributeId],
          selectedValue: name,
          open: false,
        },
      };

      if (currentIndex + 1 < attributeKeys.length) {
        const nextId = attributeKeys[currentIndex + 1];
        updatedState[nextId].disabled = false;
      }

      return updatedState;
    });
  };

  const handleResetFrom = (attributeId: string) => {
    setAttributeStates((prevState: any) => {
      const attributeKeys = Object.keys(prevState);
      const currentIndex = attributeKeys.indexOf(attributeId);

      const updatedState = { ...prevState };
      for (let i = currentIndex + 1; i < attributeKeys.length; i++) {
        const id = attributeKeys[i];
        updatedState[id] = {
          ...updatedState[id],
          selectedValue: "",
          disabled: true,
        };
      }

      return updatedState;
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
            onReset={() => handleResetFrom(attribute.id)}
          />
        ))}
    </div>
  );
};

export default FilterSection;
