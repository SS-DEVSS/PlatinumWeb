import { createContext } from "react";

import { AttributeValue } from "../models/item";

export type ItemContextType = {
  type: "KIT" | "SINGLE" | "";
  setType: React.Dispatch<React.SetStateAction<"KIT" | "SINGLE" | "">>;
  variant: string;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
  valuesAttributes: Array<{ attributeId: string; values: AttributeValue[][] }>;
  setValuesAttributes: React.Dispatch<
    React.SetStateAction<Array<{ attributeId: string; values: AttributeValue[][] }>>
  >;
  selectedFilters: { attributeId: string; value: string }[];
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{ attributeId: string; value: string }[]>
  >;
};

export const ItemContext = createContext<ItemContextType>({} as ItemContextType);
