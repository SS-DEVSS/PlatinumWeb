import { createContext, useContext, useState } from "react";

type ItemContextType = {
  type: "KIT" | "SINGLE" | "";
  setType: React.Dispatch<React.SetStateAction<"KIT" | "SINGLE" | "">>;
  variant: string;
  setVariant: React.Dispatch<React.SetStateAction<string>>;

  valuesAttributes: [];
  setValuesAttributes: React.Dispatch<React.SetStateAction<[]>>;
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
  const [valuesAttributes, setValuesAttributes] = useState<[]>([]);
  return (
    <ItemContext.Provider
      value={{
        type,
        setType,
        variant,
        setVariant,
        valuesAttributes,
        setValuesAttributes,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
