import { useState } from "react";
import { AttributeValue } from "../models/item";
import { ItemContext } from "./item-context-base";

export const ItemContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [type, setType] = useState<"KIT" | "SINGLE" | "">("");
  const [variant, setVariant] = useState<string>("");
  const [valuesAttributes, setValuesAttributes] = useState<Array<{ attributeId: string; values: AttributeValue[][] }>>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    { attributeId: string; value: string }[]
  >([]);
  return (
    <ItemContext.Provider
      value={{
        type,
        setType,
        variant,
        setVariant,
        valuesAttributes,
        setValuesAttributes,
        selectedFilters,
        setSelectedFilters,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
