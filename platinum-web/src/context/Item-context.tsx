import { createContext, useContext, useState } from "react";
import { AttributeValue } from "../models/item";

type ItemContextType = {
  type: "KIT" | "SINGLE" | "";
  setType: React.Dispatch<React.SetStateAction<"KIT" | "SINGLE" | "">>;
  variant: string;
  setVariant: React.Dispatch<React.SetStateAction<string>>;

  valuesAttributes: Array<{ attributeId: string; values: AttributeValue[][] }>;
  setValuesAttributes: React.Dispatch<React.SetStateAction<Array<{ attributeId: string; values: AttributeValue[][] }>>>;

  selectedFilters: { attributeId: string; value: string }[];
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{ attributeId: string; value: string }[]>
  >;
};

const ItemContext = createContext<ItemContextType>({} as ItemContextType);

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error(
      "useItemContext must be used within an ItemContextProvider"
    );
  }
  return context;
};

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
